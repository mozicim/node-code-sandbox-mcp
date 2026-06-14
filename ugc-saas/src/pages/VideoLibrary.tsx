import React, { useState } from 'react'
import {
  Download,
  Share2,
  Trash2,
  Play,
  Clock,
  Video,
  Search,
  Filter,
  Plus,
  Loader2,
  X,
} from 'lucide-react'
import { PageProps, GeneratedVideo, VideoStatus } from '../types'

const VideoLibrary: React.FC<PageProps> = ({ navigate, user, videos, updateVideo }) => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | VideoStatus>('all')
  const [filterPreset, setFilterPreset] = useState('all')
  const [playingId, setPlayingId] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to View Library</h2>
        <p className="text-gray-400 mb-6">Your generated videos will appear here.</p>
        <button onClick={() => navigate('landing')} className="btn-primary">
          Get Started Free
        </button>
      </div>
    )
  }

  const uniquePresets = ['all', ...Array.from(new Set(videos.map((v) => v.preset.mode)))]

  const filtered = videos.filter((v) => {
    const matchSearch = v.productName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    const matchPreset = filterPreset === 'all' || v.preset.mode === filterPreset
    return matchSearch && matchStatus && matchPreset
  })

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d > 0) return `${d}d ago`
    if (h > 0) return `${h}h ago`
    if (m > 0) return `${m}m ago`
    return 'Just now'
  }

  const statusBadge = (status: VideoStatus) => {
    switch (status) {
      case 'completed': return <span className="badge-green badge">Completed</span>
      case 'generating': return (
        <span className="badge-yellow badge flex items-center gap-1">
          <Loader2 size={10} className="animate-spin" />
          Generating
        </span>
      )
      case 'queued': return <span className="badge bg-gray-700 text-gray-300">Queued</span>
      case 'failed': return <span className="badge-red badge">Failed</span>
    }
  }

  const handleDelete = (id: string) => {
    updateVideo(id, { status: 'failed' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Video Library</h1>
          <p className="text-gray-400 mt-1">{videos.length} videos generated</p>
        </div>
        <button onClick={() => navigate('create')} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Video
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="input pl-9 py-2"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-gray-500 mr-1" />
            {(['all', 'completed', 'generating', 'failed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === s ? 'bg-violet-600 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Preset filter */}
          <select
            value={filterPreset}
            onChange={(e) => setFilterPreset(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
          >
            {uniquePresets.map((p) => (
              <option key={p} value={p}>{p === 'all' ? 'All Styles' : p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Video size={48} className="mx-auto mb-4 text-gray-700" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {videos.length === 0 ? 'No videos yet' : 'No videos match your search'}
          </h3>
          <p className="text-gray-500 mb-6">
            {videos.length === 0
              ? 'Create your first UGC video to get started.'
              : 'Try adjusting your filters.'}
          </p>
          {videos.length === 0 && (
            <button onClick={() => navigate('create')} className="btn-primary">
              Create First Video
            </button>
          )}
        </div>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isPlaying={playingId === video.id}
            onPlay={() => setPlayingId(playingId === video.id ? null : video.id)}
            onDelete={() => handleDelete(video.id)}
            timeAgo={timeAgo}
            statusBadge={statusBadge}
          />
        ))}
      </div>
    </div>
  )
}

interface VideoCardProps {
  video: GeneratedVideo
  isPlaying: boolean
  onPlay: () => void
  onDelete: (id: string) => void
  timeAgo: (iso: string) => string
  statusBadge: (status: VideoStatus) => React.ReactNode
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isPlaying, onPlay, onDelete, timeAgo, statusBadge }) => {
  return (
    <div className="card overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-gray-800">
        {video.thumbnailUrl ? (
          <>
            <img
              src={video.thumbnailUrl}
              alt={video.productName}
              className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            />
            {isPlaying && video.videoUrl && (
              <video
                src={video.videoUrl}
                autoPlay
                loop
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {video.status === 'generating' ? (
              <div className="text-center">
                <Loader2 size={32} className="text-violet-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-400">Generating...</p>
              </div>
            ) : (
              <Video size={32} className="text-gray-600" />
            )}
          </div>
        )}

        {/* Overlay on hover */}
        {video.status === 'completed' && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onPlay}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex gap-1">
                  <div className="w-1.5 h-full bg-gray-900 rounded-sm" />
                  <div className="w-1.5 h-full bg-gray-900 rounded-sm" />
                </div>
              ) : (
                <Play size={20} className="text-gray-900" fill="currentColor" />
              )}
            </button>
          </div>
        )}

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}

        {/* Status */}
        <div className="absolute top-2 left-2">
          {statusBadge(video.status)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white truncate mb-1">{video.productName}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="badge bg-gray-800 text-gray-400">{video.preset.mode}</span>
          <span className="badge bg-gray-800 text-gray-400">{video.hook.name}</span>
        </div>
        <div className="text-xs text-gray-500 mb-1">{video.setting.name} · {video.avatarName}</div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock size={10} />
          {timeAgo(video.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
          {video.status === 'completed' && video.videoUrl ? (
            <>
              <a
                href={video.videoUrl}
                download
                className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
              >
                <Download size={13} />
                Download
              </a>
              <button className="flex items-center justify-center gap-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <Share2 size={13} />
              </button>
            </>
          ) : (
            <div className="flex-1 h-8 bg-gray-800/50 rounded-lg animate-pulse" />
          )}
          <button
            onClick={() => onDelete(video.id)}
            className="flex items-center justify-center p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoLibrary
