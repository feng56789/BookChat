export default function BottomTabBar({ books, selectedId, onSelect }) {
  return (
    <div className="bottom-tab-bar">
      {books.map((book) => {
        const isActive = selectedId === book.id
        return (
          <button
            key={book.id}
            className={`tab-item ${isActive ? 'tab-item-active' : ''}`}
            onClick={() => onSelect(book.id)}
            style={isActive ? {
              color: book.colorFrom,
              borderTopColor: book.colorFrom,
            } : {}}
          >
            <span className="tab-emoji">{book.emoji}</span>
            <span className="tab-label">{book.titleShort}</span>
          </button>
        )
      })}
    </div>
  )
}
