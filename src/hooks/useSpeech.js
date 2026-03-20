import { useState, useCallback, useRef } from 'react'

function detectLanguage(text) {
  const chinesePattern = /[\u4e00-\u9fff]/
  return chinesePattern.test(text) ? 'zh-CN' : 'en-US'
}

function getBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
    null
  )
}

export function useSpeech() {
  const [autoRead, setAutoRead] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const lang = detectLanguage(text)
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = 0.95
    utter.pitch = 1.05

    // Voices may not be loaded yet; try after a short delay
    const trySpeak = () => {
      const voice = getBestVoice(lang)
      if (voice) utter.voice = voice
      utter.onstart = () => setSpeaking(true)
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      utteranceRef.current = utter
      window.speechSynthesis.speak(utter)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        trySpeak()
      }
    } else {
      trySpeak()
    }
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  const toggleAutoRead = useCallback(() => {
    setAutoRead((v) => !v)
  }, [])

  return { autoRead, speaking, speak, stop, toggleAutoRead }
}
