import React, { useState, useEffect } from 'react'
import { Zap, Menu, X, Video, Library, LayoutDashboard, Tag, Coffee } from 'lucide-react'
import { Page, User } from '../types'

interface NavbarProps {
  page: Page
  navigate: (p: Page) => void
  user: User | null
  onLogin: () => void
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ page, navigate, user, onLogin, onLogout }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links: { label: string; page: Page; icon: React.ReactNode; amber?: boolean }[] = [
    { label: 'Dashboard', page: 'dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Create', page: 'create', icon: <Video size={16} /> },
    { label: 'Library', page: 'library', icon: <Library size={16} /> },
    { label: 'Pricing', page: 'pricing', icon: <Tag size={16} /> },
    { label: 'KapsamKafe', page: 'kapsam', icon: <Coffee size={16} />, amber: true },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/40 group-hover:shadow-violet-900/60 transition-shadow">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              UG<span className="text-violet-400">Craft</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link, i) => (
              <React.Fragment key={link.page}>
                {i === links.length - 1 && (
                  <span className="w-px h-5 bg-gray-700 mx-1" />
                )}
                <button
                  onClick={() => navigate(link.page)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === link.page
                      ? link.amber
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'bg-violet-900/40 text-violet-300'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Auth / CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                    <p className="text-xs text-violet-400 capitalize">{user.plan} plan</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Sign in
                </button>
                <button onClick={onLogin} className="btn-primary py-2 px-4 text-sm">
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-1">
          {links.map((link) => (
            <button
              key={link.page}
              onClick={() => { navigate(link.page); setMobileOpen(false) }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                page === link.page
                  ? link.amber
                    ? 'bg-amber-900/40 text-amber-300'
                    : 'bg-violet-900/40 text-violet-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
            {user ? (
              <button onClick={() => { onLogout(); setMobileOpen(false) }} className="btn-secondary py-2">
                Sign out
              </button>
            ) : (
              <>
                <button onClick={() => { onLogin(); setMobileOpen(false) }} className="btn-secondary py-2">
                  Sign in
                </button>
                <button onClick={() => { onLogin(); setMobileOpen(false) }} className="btn-primary py-2">
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
