export default function Sidebar({ books, selectedId, onSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">📚</span>
        <span className="sidebar-title">BookChat</span>
      </div>
      <div className="sidebar-list">
        {books.map((book) => (
          <button
            key={book.id}
            className={`sidebar-item ${selectedId === book.id ? 'sidebar-item-active' : ''}`}
            onClick={() => onSelect(book.id)}
            style={selectedId === book.id ? {
              background: `linear-gradient(135deg, ${book.colorFrom}18, ${book.colorTo}28)`,
              borderLeft: `3px solid ${book.colorFrom}`,
            } : {}}
          >
            <span className="sidebar-emoji">{book.emoji}</span>
            <div className="sidebar-book-info">
              <div className="sidebar-book-title">{book.title}</div>
              <div className="sidebar-book-author">{book.author}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
