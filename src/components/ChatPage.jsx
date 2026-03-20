import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { sendMessage } from '../utils/gemini'
import { processFile } from '../utils/fileHandler'
import { useSpeech } from '../hooks/useSpeech'

const WELCOME_PROMPT = '请用你自己的风格做一个简短自然的自我介绍，像第一次见到朋友打招呼一样。不超过两句话。'

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function VolumeIcon({ on }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {on ? (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      ) : (
        <>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  )
}

function loadHistory(bookId) {
  try {
    const saved = localStorage.getItem(`bookchat_msgs_${bookId}`)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

function saveHistory(bookId, messages) {
  try {
    const toSave = messages
      .filter((m) => !m.loading && !m.isWelcome)
      .map((m) => ({
        ...m,
        attachment: m.attachment?.type === 'pdf'
          ? { type: 'pdf', name: m.attachment.name }
          : m.attachment?.type === 'image'
          ? { type: 'image', name: m.attachment.name }
          : null,
      }))
    localStorage.setItem(`bookchat_msgs_${bookId}`, JSON.stringify(toSave))
  } catch {}
}

const WELCOME_ID = 'welcome'

export default function ChatPage({ book, apiKey, onOpenSettings }) {
  const history = loadHistory(book.id)
  const [messages, setMessages] = useState([
    { id: WELCOME_ID, role: 'ai', text: '', loading: true, isWelcome: true },
    ...history,
  ])
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [fileLoading, setFileLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const readyToSave = useRef(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const { autoRead, speak, toggleAutoRead } = useSpeech()

  // Generate welcome on mount
  useEffect(() => {
    if (!apiKey) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === WELCOME_ID
            ? { ...m, text: '请先在设置页面输入 OpenRouter API Key 开始对话。', loading: false }
            : m
        )
      )
      readyToSave.current = true
      return
    }

    sendMessage(apiKey, book.systemPrompt, [], WELCOME_PROMPT)
      .then((text) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === WELCOME_ID ? { ...m, text, loading: false } : m
          )
        )
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === WELCOME_ID ? { ...m, text: '你好！有什么想聊的吗？', loading: false } : m
          )
        )
      })
      .finally(() => {
        readyToSave.current = true
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist conversation history (exclude welcome messages)
  useEffect(() => {
    if (readyToSave.current) {
      saveHistory(book.id, messages)
    }
  }, [messages, book.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const headerStyle = {
    background: `linear-gradient(135deg, ${book.colorFrom} 0%, ${book.colorTo} 100%)`,
    boxShadow: `0 2px 8px ${book.colorFrom}4d`,
  }

  const sendBtnStyle = {
    background: `linear-gradient(135deg, ${book.colorFrom}, ${book.colorTo})`,
    boxShadow: `0 2px 8px ${book.colorFrom}66`,
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setFileLoading(true)
    try {
      const result = await processFile(file)
      setAttachment(result)
    } catch (err) {
      alert(`文件处理失败：${err.message}`)
    } finally {
      setFileLoading(false)
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text && !attachment) return
    if (loading) return
    if (!apiKey) {
      alert('请先在设置页面输入 OpenRouter API Key')
      onOpenSettings()
      return
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      attachment: attachment ? { type: attachment.type, name: attachment.name, preview: attachment.preview } : null,
    }
    const loadingMsg = { id: Date.now() + 1, role: 'ai', text: '', loading: true }

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    const currentAttachment = attachment
    setAttachment(null)
    setLoading(true)

    try {
      const conversationHistory = messages
        .filter((m) => !m.isWelcome && !m.loading)
        .map((m) => ({ role: m.role, text: m.text }))

      const reply = await sendMessage(apiKey, book.systemPrompt, conversationHistory, text, currentAttachment)

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id ? { ...m, text: reply, loading: false } : m
        )
      )

      if (autoRead) {
        setTimeout(() => speak(reply), 100)
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? { ...m, text: `出错了: ${err.message}`, loading: false }
            : m
        )
      )
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header" style={headerStyle}>
        <div className="header-left">
          <span className="header-emoji">{book.emoji}</span>
          <div className="header-info">
            <div className="header-title">{book.title}</div>
            <div className="header-subtitle">{book.author} {book.authorEn}</div>
          </div>
        </div>
        <div className="header-actions">
          <button
            className={`icon-btn ${autoRead ? 'icon-btn-active' : ''}`}
            onClick={toggleAutoRead}
            title={autoRead ? '关闭自动朗读' : '开启自动朗读'}
          >
            <VolumeIcon on={autoRead} />
          </button>
          <button className="icon-btn" onClick={onOpenSettings} title="设置">
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} book={book} onSpeak={speak} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment preview */}
      {attachment && (
        <div className="attachment-bar">
          {attachment.type === 'image' ? (
            <img src={attachment.preview} alt={attachment.name} className="attachment-thumb" />
          ) : (
            <span className="attachment-pdf-tag">📄 {attachment.name}</span>
          )}
          <button className="attachment-remove" onClick={() => setAttachment(null)}>✕</button>
        </div>
      )}

      {/* Input */}
      <div className="input-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <textarea
          ref={inputRef}
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="用中文或英文提问… / Ask in English or Chinese…"
          rows={1}
          disabled={loading}
        />
        <button
          className="send-btn"
          style={sendBtnStyle}
          onClick={handleSend}
          disabled={loading || (!input.trim() && !attachment)}
          title="发送"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}
