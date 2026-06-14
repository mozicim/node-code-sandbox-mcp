import React, { useState, useCallback } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Play,
  Link,
  Sparkles,
  ExternalLink,
  CheckCheck,
} from 'lucide-react'
import { PageProps, Preset, Hook, Setting, Avatar } from '../types'
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

const STEP_LABELS = ['Ürün', 'Stil', 'Hook', 'Setting', 'Avatar', 'Prompt']

// English prompt + Turkish spoken dialogue embedded inside
// Hook: 0-3s visual | Pitch: 3-9s speaking | CTA beat: 9-10s
function generateTurkishScript(wizard: WizardState): { scene: string; script: string } {
  const product = wizard.productName || 'product'
  const hook = wizard.hook?.name || ''
  const setting = wizard.setting?.name || ''

  const settingVisual: Record<string, string> = {
    Bedroom:         'in a cozy bedroom, soft window light, unmade bed and pillows visible, relaxed morning or evening vibe',
    Kitchen:         'standing at a kitchen counter, natural daylight, everyday items in background, mid-day casual energy',
    Street:          'walking on a city sidewalk, handheld selfie camera, storefronts and traffic in background, spontaneous feel',
    Gym:             'on the gym floor or near equipment, bright overhead lighting, post-workout energy',
    Nature:          'outdoors on a trail, park, or beach, natural light, greenery or open sky, active peaceful mood',
    Bathroom:        'bathroom mirror selfie or front camera, vanity or ring lighting, tiles visible, mid-routine intimate feel',
    Office:          'at a desk, laptop open, coffee nearby, soft overhead light, quick mid-workday share energy',
    'In Car':        'selfie from passenger or driver seat, window light on face, parked or cruising, casual tone',
    'Airplane Wing': 'sitting on an airplane wing mid-flight at altitude, powerful wind, clouds below, engine roar, zero concern',
    Rooftop:         'on the edge of a skyscraper rooftop, full city skyline stretched behind, golden hour or dusk light, wind in hair',
    'Volcano Rim':   'sitting casually on the rim of an active volcano, lava bubbling below, smoke drifting, completely unbothered',
    'Car Roof':      'on the roof of a moving car on a desert highway, golden hour, semi-truck passes, swaying with the road',
    'Train Surf':    'hanging outside a moving train filming a selfie, wind pressing hard, tracks rushing below',
    'Tiny Reviewer': 'person shrunk to 15cm standing next to a full-size product, normal selfie framing at impossible scale',
  }

  const hookVisual: Record<string, string> = {
    'Spicy':
      `[0–3s] Starts with an extreme close-up of the collarbone/neck. Camera slowly tilts upward to reveal ${product} on the face or in hand. Pulls back into selfie framing. Silent dramatic pause before speaking.`,
    'Product Hit':
      `[0–3s] ${product} flies into frame and hits the person. Brief surprised reaction. Next frame: person holds it naturally, looks at camera, begins speaking.`,
    'Interview':
      `[0–3s] Street interview setup — a stranger asks a question based on the previous stranger's random answer. Confusion builds. Person naturally notices ${product} and pivots into a casual review.`,
    'Random Object Mic':
      `[0–3s] A random absurd object (banana, hammer, toy) falls from above into the person's hand. They immediately use it as a microphone with complete seriousness and begin the review.`,
    'Product Crash':
      `[0–3s] ${product} falls from above and appears to shatter, creating chaos. Sharp cut — scene instantly becomes perfectly clean and calm. Person holds ${product} and starts reviewing without missing a beat.`,
    'Blizzard':
      `[0–3s] A cozy indoor scene is suddenly hit by a violent impossible blizzard. Objects fly, room fills with chaos. Storm stops — ${product} is still intact and functioning. Person begins review.`,
    'Camera Bump':
      `[0–3s] Camera operator accidentally bumps into the person, hitting their forehead. Brief reaction and recovery. Person naturally transitions into revealing and reviewing ${product}.`,
    'Product Dodge':
      `[0–3s] ${product} flies directly at the person's face. They quickly duck to avoid it. Next frame: they stand back up holding ${product} as if nothing happened and begin the review.`,
    'Epic Fail':
      `[0–3s] Person attempts a backflip, lands badly, and falls. Without hesitation they stand back up, pull out ${product}, and begin an completely composed review.`,
  }

  const turkishPitch = getProductPitch(product, wizard.productUrl)
  const settingDesc = settingVisual[setting] || 'in a natural everyday setting, handheld phone camera, authentic real-user feel'
  const hookDesc = hookVisual[hook] || `[0–3s] ${product} enters the frame naturally. Person reacts and holds it toward camera.`

  const scene =
`10-second vertical UGC video (9:16 aspect ratio). Authentic real-user feel — handheld phone camera aesthetic, natural lighting, no studio look, no cuts.

SETTING: ${settingDesc}.

HOOK (0–3 seconds):
${hookDesc}

PRODUCT SCENE (3–10 seconds):
Person holds ${product} toward the camera, direct eye contact, speaking in Turkish directly to the viewer. Selfie angle. Background: ${settingDesc}. Tone is natural and genuine — not overly excited, not flat. Like a real person sharing something they actually use.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE (Turkish, embedded in video):
"${turkishPitch}"

VIDEO SPECS: 10 seconds | 9:16 | UGC style | Turkish spoken audio`

  const script =
`[0–3s] HOOK — visual only, no speaking
${hookDesc}

[3–10s] PERSON SPEAKS IN TURKISH:
"${turkishPitch}"

[Person holds ${product} toward camera, natural smile, direct eye contact]

LANGUAGE NOTE: Voiceover must be in Turkish. Natural conversational pace — fits comfortably in 7 seconds. Not rushed.`

  return { scene, script }
}

// 7 saniyelik konuşma ≈ 25-32 Türkçe kelime — UGC dili: samimi, kısa, direkt
function getProductPitch(productName: string, url: string): string {
  const name = productName.toLowerCase()

  if (name.includes('gözlük') || name.includes('optik') || name.includes('güneş')) {
    return `Şuna bir bakın. ${productName} — şu an ${name.includes('999') ? '999 TL' : 'kampanya fiyatıyla'}. Bu kaliteyi bu fiyata başka yerde bulamazsın. Kaçırmayın.`
  }
  if (name.includes('serum') || name.includes('cilt') || name.includes('krem') || name.includes('maske')) {
    return `Cilt bakım rutinime bunu ekledim ve fark inanılmaz. ${productName} — bir hafta içinde göreceksin. Gerçekten işe yarıyor.`
  }
  if (name.includes('enerji') || name.includes('spor') || name.includes('protein') || name.includes('supplement')) {
    return `Antrenmandan önce bunu içmeye başladım. ${productName} — vücudun ne istediğini anlıyor. Tavsiye ederim, gerçekten.`
  }
  if (name.includes('kafe') || name.includes('kahve') || name.includes('çay') || name.includes('içecek')) {
    return `Bu tadı bir defa alınca bırakamıyorsun. ${productName} — bugün denedin mi? Hemen al.`
  }
  if (name.includes('giyim') || name.includes('kıyafet') || name.includes('elbise') || name.includes('ayakkabı')) {
    return `Bunu giyince bakışlar üzerimde. ${productName} — kalitesi, fiyatı, her şeyiyle mükemmel. Al, pişman olmayacaksın.`
  }
  if (url) {
    return `${productName} — linkte detaylar var. Bu fiyata bu kalite gerçekten inanılmaz. Stoklarla sınırlı, kaçırma.`
  }
  return `${productName} — bunu çok daha önce keşfetmem gerekirdi. Hiç beklemediğim kadar iyi. Tavsiye ederim.`
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        copied
          ? 'bg-green-900/40 text-green-400 border border-green-700/40'
          : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700'
      }`}
    >
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
      {copied ? 'Kopyalandı!' : label || 'Kopyala'}
    </button>
  )
}

const CreateVideo: React.FC<PageProps> = ({ user, onLogin }) => {
  const [step, setStep] = useState<Step>(1)
  const [promptReady, setPromptReady] = useState(false)
  const [hookFilter, setHookFilter] = useState<'all' | 'stunt' | 'subtle'>('all')
  const [settingFilter, setSettingFilter] = useState<'all' | 'realistic' | 'unrealistic'>('all')
  const [hovered, setHovered] = useState<string | null>(null)
  const [customScript, setCustomScript] = useState('')
  const [customScene, setCustomScene] = useState('')

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
        <h2 className="text-2xl font-bold text-white mb-2">Giriş yapman gerekiyor</h2>
        <p className="text-gray-400 mb-6">UGC videoları oluşturmak için hesabına giriş yap.</p>
        <button onClick={onLogin} className="btn-primary">Ücretsiz Başla</button>
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

  const handleGeneratePrompt = () => {
    const { scene, script } = generateTurkishScript(wizard)
    setCustomScene(scene)
    setCustomScript(script)
    setPromptReady(true)
  }

  const filteredHooks = hookFilter === 'all' ? HOOKS : HOOKS.filter((h) => h.type === hookFilter)
  const filteredSettings = settingFilter === 'all' ? SETTINGS : SETTINGS.filter((s) => s.type === settingFilter)

  const fullPromptForCopy = () => {
    return `=== HİGGSFİELD UGC PROMPT ===

ÜRÜN: ${wizard.productName}${wizard.productUrl ? '\nURL: ' + wizard.productUrl : ''}
PRESET: ${wizard.preset?.mode}
HOOK: ${wizard.hook?.name}
SETTİNG: ${wizard.setting?.name}
AVATAR: ${wizard.avatar?.name} — ${wizard.avatar?.style}

--- SAHNE TANIMI ---
${customScene}

--- TÜRKÇE SCRIPT ---
${customScript}
`
  }

  if (promptReady && wizard.hook && wizard.setting && wizard.preset && wizard.avatar) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Higgsfield Promptun Hazır!</h1>
          <p className="text-gray-400 mt-2">Aşağıdaki her alanı kopyala, Higgsfield'a yapıştır.</p>
        </div>

        {/* Quick summary */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="badge-violet badge">{wizard.preset.emoji} {wizard.preset.mode}</span>
          <span className="badge bg-gray-800 text-gray-300">Hook: {wizard.hook.name}</span>
          <span className="badge bg-gray-800 text-gray-300">Setting: {wizard.setting.name}</span>
          <span className="badge bg-gray-800 text-gray-300">Avatar: {wizard.avatar.name}</span>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {/* Step 1 */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                <span className="text-sm font-semibold text-white">Ürün Adı — "Product & App" alanına yaz</span>
              </div>
              <CopyButton text={wizard.productName} />
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-200 font-mono">
              {wizard.productName}
            </div>
          </div>

          {/* Step 2 */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                <span className="text-sm font-semibold text-white">Hook & Setting seç</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 flex gap-3 items-center">
                <img src={wizard.hook.thumbnail} className="w-10 h-14 rounded object-cover flex-shrink-0" alt="" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Hook</p>
                  <p className="text-sm font-semibold text-white">{wizard.hook.name}</p>
                  <span className={`badge text-xs mt-1 ${wizard.hook.type === 'stunt' ? 'badge-violet' : 'badge-green'}`}>{wizard.hook.type}</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 flex gap-3 items-center">
                <img src={wizard.setting.thumbnail} className="w-10 h-10 rounded object-cover flex-shrink-0" alt="" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Setting</p>
                  <p className="text-sm font-semibold text-white">{wizard.setting.name}</p>
                  <span className={`badge text-xs mt-1 ${wizard.setting.type === 'realistic' ? 'badge-green' : 'badge-yellow'}`}>{wizard.setting.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 - Scene */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
                <span className="text-sm font-semibold text-white">"Describe what happens" kutusuna yapıştır</span>
              </div>
              <CopyButton text={customScene} />
            </div>
            <textarea
              value={customScene}
              onChange={(e) => setCustomScene(e.target.value)}
              rows={4}
              className="input text-sm font-mono resize-none"
            />
            <p className="text-xs text-gray-600 mt-1.5">Düzenleyebilirsin ↑</p>
          </div>

          {/* Step 4 - Script */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">4</span>
                <span className="text-sm font-semibold text-white">Türkçe Script — aynı kutuya ekle</span>
              </div>
              <CopyButton text={customScript} />
            </div>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              rows={6}
              className="input text-sm font-mono resize-none"
            />
            <p className="text-xs text-gray-600 mt-1.5">İstediğin gibi değiştirebilirsin ↑</p>
          </div>
        </div>

        {/* Copy all + Open Higgsfield */}
        <div className="flex flex-col sm:flex-row gap-3">
          <CopyButton text={fullPromptForCopy()} label="Tümünü Kopyala" />
          <a
            href="https://higgsfield.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-sm py-3 flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            Higgsfield'ı Aç & Yapıştır
          </a>
          <button
            onClick={() => {
              setPromptReady(false)
              setStep(1)
              setWizard({ productName: '', productUrl: '', preset: null, hook: null, setting: null, avatar: null })
            }}
            className="btn-secondary text-sm py-3"
          >
            Yeni Prompt
          </button>
        </div>

        <div className="mt-6 card p-4 bg-violet-900/20 border-violet-700/40">
          <p className="text-xs text-violet-300 font-semibold mb-2">💡 Higgsfield'da ne yapacaksın?</p>
          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
            <li>Marketing Studio → New Video → <strong className="text-white">UGC</strong> seç</li>
            <li>Ürün fotoğrafını yükle (gözlük görseli)</li>
            <li>Avatar ekle</li>
            <li><strong className="text-white">Hook: {wizard.hook.name}</strong> + <strong className="text-white">Setting: {wizard.setting.name}</strong> seç</li>
            <li>"Describe what happens" kutusuna sahne + scripti yapıştır</li>
            <li>GENERATE bas 🚀</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">UGC Video Oluştur</h1>
        <p className="text-gray-400 mt-2">Tercihlerini seç, Türkçe Higgsfield promptun hazır olsun.</p>
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
                <div className={`h-px w-6 sm:w-10 mx-1 ${done ? 'bg-violet-600' : 'bg-gray-800'}`} />
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
              Ürün Bilgileri
            </h2>
            <p className="text-gray-400 text-sm mb-6">Kampanyan için ürün adını ve varsa URL'yi gir.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ürün / Kampanya Adı <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="örn. Gökçen Optik — Güneş Gözlüğü 999 TL"
                  value={wizard.productName}
                  onChange={(e) => setWizard({ ...wizard, productName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Web Sitesi / Ürün URL <span className="text-gray-500 font-normal">(opsiyonel)</span>
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://gokcenoptik.com/..."
                  value={wizard.productUrl}
                  onChange={(e) => setWizard({ ...wizard, productUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preset */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles size={20} className="text-violet-400" />
              Video Stili Seç
            </h2>
            <p className="text-gray-400 text-sm mb-6">Nasıl bir video yapmak istiyorsun?</p>
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
                    {selected && <Check size={14} className="text-violet-400 mt-2" />}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Hook */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Hook Seç</h2>
            <p className="text-gray-400 text-sm mb-4">İlk saniyede dikkat çeken açılış sahnesi. Üzerine gelince önizle.</p>
            <div className="flex gap-2 mb-5">
              {(['all', 'stunt', 'subtle'] as const).map((f) => (
                <button key={f} onClick={() => setHookFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${hookFilter === f ? 'bg-violet-600 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'}`}>
                  {f === 'all' ? 'Tümü' : f === 'stunt' ? 'Stunt' : 'Subtle'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredHooks.map((hook) => {
                const selected = wizard.hook?.id === hook.id
                return (
                  <button key={hook.id} onClick={() => setWizard({ ...wizard, hook })}
                    onMouseEnter={() => setHovered(hook.id)} onMouseLeave={() => setHovered(null)}
                    className={`relative rounded-xl overflow-hidden aspect-[9/14] border-2 transition-all text-left ${selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-gray-700 hover:border-gray-600'}`}>
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
                      <div className={`badge mb-1 ${hook.type === 'stunt' ? 'badge-violet' : 'badge-green'}`}>{hook.type}</div>
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
            <h2 className="text-xl font-semibold text-white mb-1">Setting Seç</h2>
            <p className="text-gray-400 text-sm mb-4">Videonun geçtiği ortam. Üzerine gelince önizle.</p>
            <div className="flex gap-2 mb-5">
              {(['all', 'realistic', 'unrealistic'] as const).map((f) => (
                <button key={f} onClick={() => setSettingFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${settingFilter === f ? 'bg-violet-600 text-white' : 'border border-gray-700 text-gray-400 hover:text-white'}`}>
                  {f === 'all' ? 'Tümü' : f === 'realistic' ? 'Gerçekçi' : 'Absürt'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredSettings.map((setting) => {
                const selected = wizard.setting?.id === setting.id
                return (
                  <button key={setting.id} onClick={() => setWizard({ ...wizard, setting })}
                    onMouseEnter={() => setHovered(setting.id)} onMouseLeave={() => setHovered(null)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-gray-700 hover:border-gray-600'}`}>
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
                      <div className={`badge mb-0.5 ${setting.type === 'realistic' ? 'badge-green' : 'badge-yellow'}`}>{setting.type}</div>
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
            <h2 className="text-xl font-semibold text-white mb-1">Avatar Seç</h2>
            <p className="text-gray-400 text-sm mb-6">Ürünü tanıtacak kişi.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {AVATARS.map((avatar) => {
                const selected = wizard.avatar?.id === avatar.id
                return (
                  <button key={avatar.id} onClick={() => setWizard({ ...wizard, avatar })}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${selected ? 'border-violet-500 bg-violet-900/20 ring-1 ring-violet-500/40' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/40'}`}>
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <img src={avatar.thumbnail} alt={avatar.name} className="w-full h-full rounded-full object-cover border-2 border-gray-700" />
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

        {/* Step 6: Generate Prompt */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Özet & Prompt Oluştur</h2>
            <p className="text-gray-400 text-sm mb-6">Her şey hazır. "Prompt Oluştur" bas — Higgsfield'a yapıştırılacak Türkçe içerik hazırlanır.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Ürün', value: wizard.productName },
                { label: 'Stil', value: `${wizard.preset?.emoji} ${wizard.preset?.mode}` },
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
                      {badge && <span className={`badge ${badge === 'stunt' || badge === 'unrealistic' ? 'badge-yellow' : 'badge-green'}`}>{badge}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGeneratePrompt}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Türkçe Prompt Oluştur
            </button>
            <p className="text-center text-xs text-gray-600 mt-3">Prompt hazırlandıktan sonra düzenleyip Higgsfield'a yapıştırırsın</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
          disabled={step === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${step === 1 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'btn-secondary'}`}
        >
          <ArrowLeft size={16} />
          Geri
        </button>

        <span className="text-xs text-gray-600">{step} / {STEP_LABELS.length}</span>

        {step < 6 ? (
          <button
            onClick={() => setStep((s) => Math.min(6, s + 1) as Step)}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${canProceed() ? 'btn-primary' : 'opacity-40 cursor-not-allowed bg-gray-800 text-gray-500'}`}
          >
            İleri
            <ArrowRight size={16} />
          </button>
        ) : <div />}
      </div>
    </div>
  )
}

export default CreateVideo
