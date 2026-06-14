import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateVideo from './pages/CreateVideo'
import VideoLibrary from './pages/VideoLibrary'
import Pricing from './pages/Pricing'
import { Page, User, GeneratedVideo, PageProps } from './types'
import { MOCK_VIDEOS } from './data'

const STORAGE_KEY = 'ugcraft_videos'

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing')
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<GeneratedVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : MOCK_VIDEOS
    } catch {
      return MOCK_VIDEOS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
  }, [videos])

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = () => {
    setUser({
      name: 'Alex Johnson',
      email: 'alex@ugcraft.ai',
      plan: 'pro',
      creditsUsed: 12,
      creditsTotal: 100,
    })
    navigate('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('landing')
  }

  const addVideo = (video: GeneratedVideo) => {
    setVideos((prev) => [video, ...prev])
  }

  const updateVideo = (id: string, updates: Partial<GeneratedVideo>) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))
  }

  const pageProps: PageProps = {
    navigate,
    user,
    videos,
    onLogin: handleLogin,
    onLogout: handleLogout,
    addVideo,
    updateVideo,
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar page={page} navigate={navigate} user={user} onLogout={handleLogout} onLogin={handleLogin} />
      <main className="flex-1">
        {page === 'landing' && <Landing {...pageProps} />}
        {page === 'dashboard' && <Dashboard {...pageProps} />}
        {page === 'create' && <CreateVideo {...pageProps} />}
        {page === 'library' && <VideoLibrary {...pageProps} />}
        {page === 'pricing' && <Pricing {...pageProps} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

export default App
