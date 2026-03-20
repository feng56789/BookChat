function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

export default function MessageBubble({ message, book, onSpeak }) {
  const isAI = message.role === 'ai'

  const userBubbleStyle = !isAI ? {
    background: `linear-gradient(135deg, ${book.colorFrom}, ${book.colorTo})`,
    boxShadow: `0 1px 4px ${book.colorFrom}59`,
  } : {}

  return (
    <div className={`message-row ${isAI ? 'ai-row' : 'user-row'}`}>
      {isAI && (
        <div className="avatar-col">
          <span className="bubble-avatar">{book.emoji}</span>
        </div>
      )}

      <div className={`bubble-col ${isAI ? 'ai-col' : 'user-col'}`}>
        <div className={`bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`} style={userBubbleStyle}>
          {message.loading ? (
            <span className="typing-dots">
              <span /><span /><span />
            </span>
          ) : (
            <>
              {message.attachment?.type === 'image' && (
                <img
                  src={message.attachment.preview}
                  alt={message.attachment.name}
                  className="msg-image"
                />
              )}
              {message.attachment?.type === 'pdf' && (
                <div className="msg-pdf-tag">
                  📄 {message.attachment.name}
                </div>
              )}
              {message.text && (
                <span className="bubble-text">{message.text}</span>
              )}
            </>
          )}
        </div>
        {isAI && !message.loading && (
          <button
            className="speak-btn"
            onClick={() => onSpeak(message.text)}
            title="朗读这条消息"
          >
            <SpeakerIcon />
          </button>
        )}
      </div>
    </div>
  )
}
