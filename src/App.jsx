import { useState } from 'react'
import ChatPage from './components/ChatPage'
import SettingsPage from './components/SettingsPage'
import Sidebar from './components/Sidebar'
import { BOOKS } from './data/books'
import './App.css'

const STORAGE_KEY = 'bookchat_gemini_key'

export default function App() {
  const [page, setPage] = useState('chat')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [selectedBookId, setSelectedBookId] = useState(BOOKS[0].id)

  const selectedBook = BOOKS.find((b) => b.id === selectedBookId)

  const handleSaveKey = (key) => {
    setApiKey(key)
    localStorage.setItem(STORAGE_KEY, key)
  }

  if (page === 'settings') {
    return (
      <div className="app-wrapper">
        <SettingsPage apiKey={apiKey} onSave={handleSaveKey} onBack={() => setPage('chat')} />
      </div>
    )
  }

  return (
    <div className="app-wrapper app-wrapper-chat">
      <Sidebar books={BOOKS} selectedId={selectedBookId} onSelect={setSelectedBookId} />
      <ChatPage
        key={selectedBookId}
        book={selectedBook}
        apiKey={apiKey}
        onOpenSettings={() => setPage('settings')}
      />
    </div>
  )
}
