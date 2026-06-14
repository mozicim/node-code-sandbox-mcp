import React, { useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  Check,
  Star,
  TrendingUp,
  Users,
  Video,
  ChevronRight,
} from 'lucide-react'
import { PageProps } from '../types'
import { PRESETS, HOOKS, SETTINGS } from '../data'

const Landing: React.FC<PageProps> = ({ navigate, onLogin }) => {
  const [hoveredHook, setHoveredHook] = useState<string | null>(null)
  const [hoveredSetting, setHoveredSetting] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'realistic' | 'unrealistic'>('all')

  const filteredSettings =
    activeFilter === 'all'
      ? SETTINGS.slice(0, 8)
      : SETTINGS.filter((s) => s.type === activeFilter).slice(0, 8)

  const testimonials = [
    {
      name: 'Mia Chen',
      role: 'E-commerce Founder',
      avatar: 'MC',
      text: 'UGCraft cut our content production cost by 80%. We went from 2 UGC videos a week to 20. The hooks are insanely good.',
      stars: 5,
    },
    {
      name: 'Jason Park',
      role: 'Growth Marketer',
      avatar: 'JP',
      text: 'Finally stopped paying $500 per UGC video. These AI-generated ones convert just as well, sometimes better.',
      stars: 5,
    },
    {
      name: 'Sofia Martinez',
      role: 'DTC Brand Owner',
      avatar: 'SM',
      text: 'The setting variety is what hooked me. "Volcano Rim" for our fire sauce brand? No human would think of that.',
      stars: 5,
    },
  ]

  const stats = [
    { value: '50K+', label: 'Videos Generated', icon: Video },
    { value: '9', label: 'Video Presets', icon: Sparkles },
    { value: '126', label: 'Hook × Setting Combos', icon: Zap },
    { value: '4.9/5', label: 'Avg. Rating', icon: Star },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grid-bg">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/40 text-violet-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Sparkles size={14} />
            Powered by Higgsfield AI · 9 presets · 9 hooks · 14 settings
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Scale Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              UGC Videos
            </span>
            <br />
            with AI
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create authentic, scroll-stopping product videos in minutes. No influencers. No studios.
            Just pick a hook, a setting, and let AI do the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onLogin} className="btn-primary text-base px-8 py-4 flex items-center gap-2 justify-center">
              <Zap size={18} fill="white" />
              Start Creating Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('pricing')}
              className="btn-secondary text-base px-8 py-4 flex items-center gap-2 justify-center"
            >
              <Play size={16} className="text-violet-400" />
              See Pricing
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-5">No credit card required · 3 free videos/month</p>

          {/* Preview strip */}
          <div className="mt-16 flex gap-3 justify-center flex-wrap">
            {HOOKS.slice(0, 5).map((hook) => (
              <div
                key={hook.id}
                className="relative w-24 h-36 rounded-xl overflow-hidden border border-gray-800 group cursor-pointer"
                onMouseEnter={() => setHoveredHook(hook.id)}
                onMouseLeave={() => setHoveredHook(null)}
              >
                <img
                  src={hook.thumbnail}
                  alt={hook.name}
                  className="w-full h-full object-cover"
                />
                {hoveredHook === hook.id && (
                  <video
                    src={hook.preview}
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 p-2">
                  <p className="text-xs text-white font-medium truncate">{hook.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-violet-900/40 rounded-xl flex items-center justify-center border border-violet-700/30">
                  <Icon size={20} className="text-violet-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-gray-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="section-title">How UGCraft Works</h2>
          <p className="section-sub mx-auto">
            From product URL to viral video in under 5 minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Add Your Product', desc: 'Paste a URL or upload your product image. Our AI analyzes colors, style, and context.', icon: '🛍️' },
            { step: '02', title: 'Choose a Preset', desc: 'Pick from UGC, Tutorial, Unboxing, Product Review, TV Spot, and more.', icon: '🎬' },
            { step: '03', title: 'Pick Hook & Setting', desc: 'Mix and match 9 hooks with 14 cinematic settings for 126 unique combinations.', icon: '🎭' },
            { step: '04', title: 'Generate & Share', desc: 'AI renders your video in minutes. Download in HD/4K, no watermark.', icon: '🚀' },
          ].map((item, i) => (
            <div key={i} className="relative">
              {i < 3 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-violet-700/50 to-transparent z-10" />
              )}
              <div className="card p-6 h-full">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-violet-500 mb-2 uppercase tracking-widest">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={onLogin} className="btn-primary inline-flex items-center gap-2">
            Try It Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Presets */}
      <section className="bg-gray-900/30 border-y border-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">9 Video Presets</h2>
            <p className="section-sub mx-auto">Every content format you need — from casual UGC to polished TV spots.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRESETS.map((preset) => (
              <div
                key={preset.slug}
                onClick={() => navigate('create')}
                className="card-hover p-5 text-center group"
              >
                <div className="text-3xl mb-3">{preset.emoji}</div>
                <h3 className="text-sm font-semibold text-white mb-1">{preset.mode}</h3>
                <p className="text-xs text-gray-500">{preset.description}</p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="text-violet-400 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hooks showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <div className="badge-violet inline-block mb-4">9 Unique Hooks</div>
          <h2 className="section-title">Stop the Scroll with Powerful Hooks</h2>
          <p className="section-sub mx-auto">
            Each hook is a cinematic opener designed to grab attention in the first second.
            Hover to preview.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {HOOKS.map((hook) => (
            <div
              key={hook.id}
              className="relative rounded-2xl overflow-hidden group cursor-pointer border border-gray-800 hover:border-violet-600/50 transition-all aspect-[9/16]"
              onMouseEnter={() => setHoveredHook(hook.id)}
              onMouseLeave={() => setHoveredHook(null)}
              onClick={() => navigate('create')}
            >
              <img src={hook.thumbnail} alt={hook.name} className="w-full h-full object-cover" />
              {hoveredHook === hook.id && (
                <video
                  src={hook.preview}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-3 w-full">
                <div className={`badge mb-1 ${hook.type === 'stunt' ? 'badge-violet' : 'badge-green'}`}>
                  {hook.type}
                </div>
                <p className="text-sm font-semibold text-white">{hook.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{hook.description}</p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={14} className="text-white" fill="white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings showcase */}
      <section className="bg-gray-900/30 border-y border-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="badge-violet inline-block mb-4">14 Unique Settings</div>
            <h2 className="section-title">Any Scene You Can Imagine</h2>
            <p className="section-sub mx-auto">
              From your bedroom to the rim of an active volcano — every setting tells a different story.
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {(['all', 'realistic', 'unrealistic'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSettings.map((setting) => (
              <div
                key={setting.id}
                className="relative rounded-2xl overflow-hidden group cursor-pointer border border-gray-800 hover:border-violet-600/50 transition-all aspect-square"
                onMouseEnter={() => setHoveredSetting(setting.id)}
                onMouseLeave={() => setHoveredSetting(null)}
                onClick={() => navigate('create')}
              >
                <img src={setting.thumbnail} alt={setting.name} className="w-full h-full object-cover" />
                {hoveredSetting === setting.id && (
                  <video
                    src={setting.preview}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-3 w-full">
                  <div className={`badge mb-1 ${setting.type === 'realistic' ? 'badge-green' : 'badge-yellow'}`}>
                    {setting.type}
                  </div>
                  <p className="text-sm font-semibold text-white">{setting.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('create')} className="btn-primary inline-flex items-center gap-2">
              <Sparkles size={16} />
              Explore All Combinations
            </button>
          </div>
        </div>
      </section>

      {/* Why UGCraft */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="badge-violet inline-block mb-4">Why UGCraft</div>
            <h2 className="section-title mb-6">
              Authentic UGC at
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                100× the Speed
              </span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: '⚡', title: 'Minutes, not weeks', desc: 'Traditional UGC takes 2-4 weeks from brief to delivery. UGCraft takes under 5 minutes.' },
                { icon: '💰', title: '$2 per video, not $500', desc: 'Stop paying influencer rates. Generate high-converting UGC at a fraction of the cost.' },
                { icon: '🎯', title: 'A/B test at scale', desc: 'Generate 10 variations with different hooks and settings. Find your winner fast.' },
                { icon: '🔄', title: 'Unlimited iterations', desc: 'Tweak the hook, change the setting, swap the avatar — iterate until perfect.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="text-2xl mt-0.5">{item.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-violet-400" />
              Traditional vs. UGCraft
            </h3>
            {[
              { metric: 'Time to first video', old: '2-4 weeks', new: '< 5 min' },
              { metric: 'Cost per video', old: '$300–$800', new: '~$2' },
              { metric: 'Variations per product', old: '1–3', new: 'Unlimited' },
              { metric: 'Turnaround for revision', old: '3–5 days', new: 'Instant' },
              { metric: 'Hooks available', old: 'One per brief', new: '9 prebuilt' },
            ].map((row) => (
              <div key={row.metric} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-400">{row.metric}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-red-400 line-through">{row.old}</span>
                  <span className="text-green-400 font-semibold">{row.new}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900/30 border-y border-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Loved by Brands</h2>
            <p className="section-sub mx-auto">Join thousands of DTC brands scaling their UGC with AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="section-title">Everything You Need</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '🎭', title: '9 Dramatic Hooks', desc: 'Stunts, subtle reveals, fail moments, blizzards — every hook is designed to stop the scroll.' },
            { icon: '🏙️', title: '14 Cinematic Settings', desc: 'Bedroom to Volcano Rim. Realistic daily life or impossible viral scenarios.' },
            { icon: '🧑‍🎤', title: 'Custom Avatars', desc: 'Use our preset avatars or upload your own custom person for a branded look.' },
            { icon: '📦', title: 'Bulk Generation', desc: 'Generate up to 4 variations at once. Find your winning creative fast.' },
            { icon: '📤', title: 'One-Click Export', desc: 'Download MP4 in 720p, 1080p, or 4K. Ready for TikTok, Reels, YouTube Shorts.' },
            { icon: '🔌', title: 'API Access', desc: 'Integrate UGCraft into your workflow. Generate videos programmatically at scale.' },
          ].map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-700/40 p-12 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to go viral?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Start with 3 free videos. No credit card. No commitment.
              Scale when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onLogin} className="btn-primary text-base px-8 py-4 flex items-center gap-2 justify-center">
                <Zap size={18} fill="white" />
                Create Your First Video Free
              </button>
              <button onClick={() => navigate('pricing')} className="btn-secondary text-base px-8 py-4">
                View Pricing
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
              {['Free 3 videos', 'No credit card', 'Cancel anytime'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check size={14} className="text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
