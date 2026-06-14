import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Play,
  Link,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { PageProps, Preset, Hook, Setting, Avatar, GeneratedVideo } from '../types'
import { PRESETS, HOOKS, SETTINGS, AVATARS } from '../data'

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface WizardState {
  productName: string
  productUrl: string
  preset: Preset | null
  hook: Hook | null
  setting: Setting | null
  avatar: Avatar | null
}

const STEP_LABELS = ['Product', 'Style', 'Hook', 'Setting', 'Avatar', 'Generate']

const CreateVideo: React.FC<PageProps> = ({ navigate, user, addVideo, updateVideo, onLogin }) => {
  const [step, setStep] = useState<Step>(1)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [hookFilter, setHookFilter] = useState<'all' | 'stunt' | 'subtle'>('all')
  const [settingFilter, setSettingFilter] = useState<'all' | 'realistic' | 'unrealistic'>('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const [wizard, setWizard] = useState<WizardState>({
    productName: '',
    productUrl: '',
    preset: null,
    hook: null,
    setting: null,
    avatar: null,
  })

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to Create</h2>
        <p className="text-gray-400 mb-6">You need an account to generate UGC videos.</p>
        <button onClick={onLogin} className="btn-primary">
          Sign in & Start Free
        </button>
      </div>
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1: return wizard.productName.trim().length > 0
      case 2: return wizard.preset !== null
      case 3: return wizard.hook !== null
      case 4: return wizard.setting !== null
      case 5: return wizard.avatar !== null
      default: return false
    }
  }

  const handleGenerate = async () => {
    if (!wizard.preset || !wizard.hook || !wizard.setting || !wizard.avatar) return
    setGenerating(true)

    const id = `vid_${Date.now()}`
    const newVideo: GeneratedVideo = {
      id,
      productName: wizard.productName,
      productUrl: wizard.productUrl || undefined,
      preset: wizard.preset,
      hook: wizard.hook,
      setting: wizard.setting,
      avatarName: wizard.avatar.name,
      status: 'generating',
      createdAt: new Date().toISOString(),
    }
    addVideo(newVideo)
    setGeneratedId(id)

    // Simulate Higgsfield API call (~10–30 seconds)
    setTimeout(() => {
      updateVideo(id, {
        status: 'completed',
        thumbnailUrl: wizard.hook!.thumbnail,
        videoUrl: wizard.hook!.preview,
        duration: '0:' + (Math.floor(Math.random() * 20) + 20),
      })
      setGenerating(false)
      setGenerated(true)
    }, 6000)
  }

  const filteredHooks = hookFilter === 'all' ? HOOKS : HOOKS.filter((h) => h.type === hookFilter)
  const filteredSettings = settingFilter === 'all' ? SETTINGS : SETTINGS.filter((s) => s.type === settingFilter)

  if (generated && generatedId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center border border-green-700/40 mb-6">
          <Check size={32} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Video Generated!</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Your UGC video for <strong className="text-white">{wizard.productName}</strong> has been created.
          Check your library to view and download it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('library')} className="btn-primary flex items-center gap-2">
            View in Library <ArrowRight size={16} />
          </button>
          <button
            onClick={() => {
              setStep(1)
              setGenerated(false)
              setGeneratedId(null)
              setWizard({ productName: '', productUrl: '', preset: null, hook: null, setting: null, avatar: null })
            }}
            className="btn-secondary"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create UGC Video</h1>
        <p className="text-gray-400 mt-2">Follow the steps to generate your AI-powered UGC video.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEP_LABELS.map((label, i) => {
          const s = (i + 1) as Step
          const done = step > s
          const active = step === s
          return (
            <React.Fragment key={label}>
              <button
                onClick={() => { if (done) setStep(s) }}
                className={`flex flex-col items-center ${done ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done
                      ? 'bg-violet-600 text-white'
                      : active
                      ? 'bg-violet-600 text-white ring-4 ring-violet-600/30'
                      : 'bg-gray-800 text-gray-500 border border-gray-700'
                  }`}
                >
                  {done ? <Check size={14} /> : s}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-violet-300' : done ? 'text-gray-400' : 'text-gray-600'}`}>
                  {label}
                </span>
              </button>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px w-8 sm:w-12 mx-1 ${done ? 'bg-violet-600' : 'bg-gray-800'}`} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step content */}
      <div className="card p-6 sm:p-8 min-h-[400px]">

        {/* Step 1: Product */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
              <Link size={20} className="text-violet-400" />
              Add Your Product
            </h2>
            <p className="text-gray-400 text-sm mb-6">Enter your product name and optionally paste a URL for AI to analyze.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Glow Face Serum, AirPods Pro, Energy Drink X"
                  value={wizard.productName}
                  onChange={(e) => setWizard({ ...wizard, productName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product URL <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://yourstore.com/products/..."
                  value={wizard.productUrl}
                  onChange={(e) => setWizard({ ...wizard, productUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Paste a product page URL and our AI will extract colors, images, and context.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preset */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles size={20} className="text-violet-400" />
              Choose Video Style
            </h2>
            <p className="text-gray-400 text-sm mb-6">What kind of video do you want to create?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => {
                const selected = wizard.preset?.slug === preset.slug
                return (
                  <button
                    key={preset.slug}
                    onClick={() => setWizard({ ...wizard, preset })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-violet-500 bg-violet-900/30 ring-1 ring-violet-500'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{preset.emoji}</div>
                    <p className="text-sm font-semibold text-white">{preset.mode}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{preset.description}</p>
                    {selected && (
                      <div className="mt-2">
                        <Check size={14} className="text-violet-400" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Hook */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Choose a Hook</h2>
            <p className="text-gray-400 text-sm mb-4">The hook is the cinematic opener — it grabs attention in the first second.</p>
            <div className="flex gap-2 mb-5">
              {(['all', 'stunt', 'subtle'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setHookFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    hookFilter === f ? 'bg-violet-600 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredHooks.map((hook) => {
                const selected = wizard.hook?.id === hook.id
                return (
                  <button
                    key={hook.id}
                    onClick={() => setWizard({ ...wizard, hook })}
                    onMouseEnter={() => setHovered(hook.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative rounded-xl overflow-hidden aspect-[9/14] border-2 transition-all text-left ${
                      selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <img src={hook.thumbnail} alt={hook.name} className="w-full h-full object-cover" />
                    {hovered === hook.id && (
                      <video src={hook.preview} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    {selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 p-2.5 w-full">
                      <div className={`badge mb-1 ${hook.type === 'stunt' ? 'badge-violet' : 'badge-green'}`}>
                        {hook.type}
                      </div>
                      <p className="text-xs font-semibold text-white">{hook.name}</p>
                    </div>
                    {hovered === hook.id && (
                      <div className="absolute top-2 left-2 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                        <Play size={10} className="text-white" fill="white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Setting */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Choose a Setting</h2>
            <p className="text-gray-400 text-sm mb-4">Where does your video take place? Hover to preview.</p>
            <div className="flex gap-2 mb-5">
              {(['all', 'realistic', 'unrealistic'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSettingFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    settingFilter === f ? 'bg-violet-600 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredSettings.map((setting) => {
                const selected = wizard.setting?.id === setting.id
                return (
                  <button
                    key={setting.id}
                    onClick={() => setWizard({ ...wizard, setting })}
                    onMouseEnter={() => setHovered(setting.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <img src={setting.thumbnail} alt={setting.name} className="w-full h-full object-cover" />
                    {hovered === setting.id && (
                      <video src={setting.preview} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 p-2 w-full">
                      <div className={`badge mb-0.5 ${setting.type === 'realistic' ? 'badge-green' : 'badge-yellow'}`}>
                        {setting.type}
                      </div>
                      <p className="text-xs font-semibold text-white">{setting.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 5: Avatar */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Choose an Avatar</h2>
            <p className="text-gray-400 text-sm mb-6">Pick who will present your product. Custom avatars available on Pro+.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {AVATARS.map((avatar) => {
                const selected = wizard.avatar?.id === avatar.id
                return (
                  <button
                    key={avatar.id}
                    onClick={() => setWizard({ ...wizard, avatar })}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selected
                        ? 'border-violet-500 bg-violet-900/20 ring-1 ring-violet-500/40'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <img
                        src={avatar.thumbnail}
                        alt={avatar.name}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-700"
                      />
                      {selected && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{avatar.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{avatar.style}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 6: Review & Generate */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Review & Generate</h2>
            <p className="text-gray-400 text-sm mb-6">Everything look good? Hit generate to create your video.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Product', value: wizard.productName },
                { label: 'Video Style', value: `${wizard.preset?.emoji} ${wizard.preset?.mode}` },
                { label: 'Hook', value: wizard.hook?.name, badge: wizard.hook?.type },
                { label: 'Setting', value: wizard.setting?.name, badge: wizard.setting?.type },
                { label: 'Avatar', value: wizard.avatar?.name },
              ].map(({ label, value, badge }) => (
                <div key={label} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl">
                  <Check size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      {value}
                      {badge && (
                        <span className={`badge ${badge === 'stunt' || badge === 'unrealistic' ? 'badge-yellow' : 'badge-green'}`}>
                          {badge}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hook + Setting preview */}
            {wizard.hook && wizard.setting && (
              <div className="flex gap-3 mb-6">
                <div className="relative rounded-lg overflow-hidden w-24 h-32 flex-shrink-0">
                  <img src={wizard.hook.thumbnail} alt="Hook preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1">
                    <p className="text-xs text-white text-center truncate">{wizard.hook.name}</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden w-24 h-32 flex-shrink-0">
                  <img src={wizard.setting.thumbnail} alt="Setting preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1">
                    <p className="text-xs text-white text-center truncate">{wizard.setting.name}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <p className="text-sm text-gray-400">Hook × Setting</p>
                    <p className="text-xs text-gray-600 mt-0.5">AI blends both seamlessly</p>
                  </div>
                </div>
              </div>
            )}

            {generating ? (
              <div className="text-center py-8">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Loader2 size={64} className="text-violet-500 animate-spin" />
                </div>
                <p className="text-white font-semibold">Generating your video...</p>
                <p className="text-gray-400 text-sm mt-1">This usually takes 20–60 seconds</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {['Analyzing product', 'Generating frames', 'Rendering video'].map((s, i) => (
                    <span key={s} className="text-xs text-gray-500 flex items-center gap-1">
                      {i > 0 && <ChevronRight size={10} className="text-gray-700" />}
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Generate Video
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {!generating && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              step === 1
                ? 'opacity-30 cursor-not-allowed text-gray-500'
                : 'btn-secondary'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="text-xs text-gray-600">Step {step} of {STEP_LABELS.length}</span>

          {step < 6 ? (
            <button
              onClick={() => setStep((s) => Math.min(6, s + 1) as Step)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                canProceed()
                  ? 'btn-primary'
                  : 'opacity-40 cursor-not-allowed bg-gray-800 text-gray-500'
              }`}
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  )
}

export default CreateVideo
