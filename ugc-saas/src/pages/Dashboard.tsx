import React from 'react'
import { Video, Zap, TrendingUp, Clock, ArrowRight, Plus } from 'lucide-react'
import { PageProps } from '../types'

const Dashboard: React.FC<PageProps> = ({ navigate, user, videos }) => {
  if (!user) {
    navigate('landing')
    return null
  }

  const completedVideos = videos.filter((v) => v.status === 'completed').length
  const generatingVideos = videos.filter((v) => v.status === 'generating' || v.status === 'queued').length
  const creditsPct = Math.round((user.creditsUsed / user.creditsTotal) * 100)

  const recentVideos = videos.slice(0, 4)

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d > 0) return `${d}d ago`
    if (h > 0) return `${h}h ago`
    return 'Just now'
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="badge-green badge">Completed</span>
      case 'generating': return <span className="badge-yellow badge">Generating</span>
      case 'queued': return <span className="badge bg-gray-700 text-gray-300">Queued</span>
      case 'failed': return <span className="badge-red badge">Failed</span>
      default: return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your videos.</p>
        </div>
        <button
          onClick={() => navigate('create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Video
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-violet-900/40 rounded-xl flex items-center justify-center border border-violet-700/30">
              <Video size={20} className="text-violet-400" />
            </div>
            <span className="text-xs text-gray-500">{user.plan} plan</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedVideos}</p>
          <p className="text-sm text-gray-400 mt-0.5">Videos completed</p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-900/30 rounded-xl flex items-center justify-center border border-yellow-700/30">
              <Clock size={20} className="text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{generatingVideos}</p>
          <p className="text-sm text-gray-400 mt-0.5">In progress</p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-900/40 rounded-xl flex items-center justify-center border border-indigo-700/30">
              <Zap size={20} className="text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{user.creditsTotal - user.creditsUsed}</p>
          <p className="text-sm text-gray-400 mt-0.5">Credits remaining</p>
        </div>

        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center border border-green-700/30">
              <TrendingUp size={20} className="text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{videos.length}</p>
          <p className="text-sm text-gray-400 mt-0.5">Total videos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Videos</h2>
            <button
              onClick={() => navigate('library')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {recentVideos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Video size={40} className="mx-auto mb-3 opacity-30" />
              <p>No videos yet. Create your first one!</p>
              <button onClick={() => navigate('create')} className="btn-primary mt-4 text-sm px-4 py-2">
                Create Video
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                  <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    {video.thumbnailUrl && (
                      <img src={video.thumbnailUrl} alt={video.productName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{video.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {video.preset.mode} · {video.hook.name} hook · {video.setting.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {statusBadge(video.status)}
                      <span className="text-xs text-gray-600">{timeAgo(video.createdAt)}</span>
                    </div>
                  </div>
                  {video.duration && (
                    <span className="text-xs text-gray-500 flex-shrink-0">{video.duration}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Credits */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-4">Credits Usage</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Used this month</span>
              <span className="text-white font-medium">{user.creditsUsed} / {user.creditsTotal}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  creditsPct > 80
                    ? 'bg-red-500'
                    : creditsPct > 60
                    ? 'bg-yellow-500'
                    : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                }`}
                style={{ width: `${creditsPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{user.creditsTotal - user.creditsUsed} credits remaining</p>
            <button onClick={() => navigate('pricing')} className="w-full btn-secondary mt-4 text-sm py-2">
              Upgrade Plan
            </button>
          </div>

          {/* Quick Create */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-700/40 p-5">
            <div className="absolute top-0 right-0 text-6xl opacity-10 leading-none">🚀</div>
            <h3 className="font-semibold text-white mb-2">Ready to create?</h3>
            <p className="text-sm text-gray-300 mb-4">You have {user.creditsTotal - user.creditsUsed} credits. Start generating.</p>
            <button
              onClick={() => navigate('create')}
              className="w-full bg-white text-gray-900 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Create New Video
            </button>
          </div>

          {/* Plan */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Current Plan</h3>
              <span className="badge-violet badge capitalize">{user.plan}</span>
            </div>
            <p className="text-sm text-gray-400">{user.creditsTotal} videos/month</p>
            <button onClick={() => navigate('pricing')} className="text-sm text-violet-400 hover:text-violet-300 mt-3 flex items-center gap-1">
              Upgrade <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
