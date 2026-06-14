import React, { useState } from 'react'
import { Zap, Lock, Eye, EyeOff } from 'lucide-react'

const ACCESS_CODE = 'ugcraft2026'
const STORAGE_KEY = 'ugcraft_access'

const AccessGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setTimeout(() => setError(false), 2000)
      setCode('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
      </div>
      <div
        className={`relative w-full max-w-sm transition-transform ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/40">
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            UG<span className="text-violet-400">Craft</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Private access only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Lock size={14} className="text-violet-400" />
              Access Code
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                autoFocus
                className={`input pr-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-1.5">Wrong code. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

export default AccessGate
