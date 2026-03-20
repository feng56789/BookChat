import { useState } from 'react'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}

export default function SettingsPage({ apiKey, onSave, onBack }) {
  const [value, setValue] = useState(apiKey || '')
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState(false)

  const handleSave = () => {
    onSave(value.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="icon-btn" onClick={onBack} title="返回">
          <BackIcon />
        </button>
        <span className="settings-title">设置 Settings</span>
      </div>

      <div className="settings-body">
        <div className="settings-card">
          <div className="settings-card-header">
            <KeyIcon />
            <span>OpenRouter API Key</span>
          </div>

          <p className="settings-desc">
            在 <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">OpenRouter</a> 免费注册并获取 API Key。当前使用模型：<code>arcee-ai/trinity-large-preview:free</code>（完全免费，无需充值）。
          </p>

          <div className="key-input-row">
            <input
              type={show ? 'text' : 'password'}
              className="key-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-or-v1-..."
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className="toggle-show-btn"
              onClick={() => setShow((v) => !v)}
              type="button"
            >
              {show ? '隐藏' : '显示'}
            </button>
          </div>

          <button
            className={`save-btn ${saved ? 'save-btn-saved' : ''}`}
            onClick={handleSave}
            disabled={!value.trim()}
          >
            {saved ? '✓ 已保存' : '保存'}
          </button>
        </div>

        <div className="settings-note">
          <strong>隐私说明：</strong>API Key 仅保存在您的浏览器本地（localStorage），不会上传到任何服务器。
        </div>
      </div>
    </div>
  )
}
