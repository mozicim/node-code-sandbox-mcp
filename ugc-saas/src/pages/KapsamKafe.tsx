import React, { useState } from 'react'
import { Coffee, Copy, Check, Film, ImageIcon, Mic } from 'lucide-react'
import { PageProps } from '../types'

type OutputType = 'image' | 'video' | 'voice'

interface KState {
  quote: string
  outputType: OutputType
  // image / video
  style: string
  background: string
  motion: string
  format: string
  tone: string
  // voice
  micType: string
  voiceSetting: string
  voiceHook: string
  gender: 'male' | 'female'
}

// ─── Image / Video data ────────────────────────────────────────────────────

const STYLES = [
  { id: 'minimal', label: 'Minimal', en: 'clean minimal composition, abundant white space, elegant simplicity', lighting: 'soft diffused natural light, even exposure, no harsh shadows' },
  { id: 'dark', label: 'Dark Aesthetic', en: 'dark and moody atmosphere, dramatic shadows, high contrast, brooding cinematic aesthetic', lighting: 'low-key dramatic lighting, deep blacks, single rim light source' },
  { id: 'vintage', label: 'Vintage', en: 'vintage aged aesthetic, worn film grain texture, nostalgic faded character', lighting: 'warm golden light, slightly overexposed edges, subtle lens flare' },
  { id: 'grunge', label: 'Grunge', en: 'grungy urban aesthetic, rough distressed textures, raw and authentic street feel', lighting: 'harsh directional industrial light, strong contrast shadows' },
  { id: 'neon', label: 'Neon', en: 'neon-lit cyberpunk aesthetic, glowing electric accents, night city energy', lighting: 'neon glow, purple and blue light spill, night scene illumination' },
]

const BACKGROUNDS = [
  { id: 'wall', label: 'Duvar Dokusu', en: 'cracked plaster wall with natural imperfections and aged character' },
  { id: 'concrete', label: 'Beton', en: 'raw exposed concrete surface, industrial texture, structural authenticity' },
  { id: 'wood', label: 'Ahşap', en: 'weathered wooden planks, natural wood grain, rustic character' },
  { id: 'abstract', label: 'Soyut', en: 'fluid abstract painted background, smooth color gradients, painterly texture' },
  { id: 'city', label: 'Şehir', en: 'blurred urban cityscape, bokeh street lights, urban depth of field' },
  { id: 'nature', label: 'Doğa', en: 'soft natural landscape, trees and sky gently out of focus, organic serenity' },
]

const MOTIONS = [
  { id: 'slowzoom', label: 'Slow Zoom', en: 'imperceptibly slow gentle zoom in, almost still, deeply meditative' },
  { id: 'parallax', label: 'Parallax', en: 'subtle parallax depth shift between background and text layers' },
  { id: 'particles', label: 'Parçacık', en: 'tiny floating dust particles drifting gently through the frame, dreamlike' },
  { id: 'smoke', label: 'Duman', en: 'wisps of atmospheric mist or smoke slowly passing through the scene, ethereal' },
  { id: 'rain', label: 'Yağmur', en: 'gentle rain droplets on a glass surface in the foreground, moody and cinematic' },
  { id: 'fire', label: 'Ateş', en: 'warm flickering ember sparks and fire light dancing softly across the scene' },
]

const FORMATS = [
  { id: 'reels', label: 'TikTok / Reels', ratio: '9:16' },
  { id: 'feed', label: 'Feed', ratio: '1:1' },
  { id: 'story', label: 'Story', ratio: '4:5' },
]

const TONES = [
  { id: 'warm', label: 'Sıcak', palette: 'warm amber, golden hour tones, burnt orange, cream and honey' },
  { id: 'cool', label: 'Soğuk', palette: 'cool blue, steel grey, icy white, midnight tones' },
  { id: 'bw', label: 'Siyah-Beyaz', palette: 'high-contrast black and white, pure monochrome, no color whatsoever' },
  { id: 'sepia', label: 'Sepya', palette: 'warm sepia brown, faded vintage tones, aged photograph warmth' },
  { id: 'moody', label: 'Moody', palette: 'deep teal, dark violet, forest green, mysterious layered shadows' },
]

const AUDIO_HINTS: Record<string, string> = {
  rain: 'soft rain ambience, no music',
  fire: 'gentle fire crackling, no music',
  smoke: 'deep atmospheric drone hum',
  particles: 'minimal ambient texture, barely audible',
  slowzoom: 'silence or very faint ambient breath',
  parallax: 'subtle cinematic texture, no melody',
}

// ─── Voice data ────────────────────────────────────────────────────────────

const VOICE_HOOKS = [
  {
    id: 'deepbreath',
    label: 'Derin Nefes',
    en: 'Person already in frame, eyes cast slightly downward. Takes one slow, visible breath. Lifts their gaze directly into the lens — ready to speak. [0–3s]',
  },
  {
    id: 'faceclose',
    label: 'Yüz Yakın Plan',
    en: 'Extreme close-up on the speaker\'s eyes — camera holds for 2 seconds. Slowly pulls back to reveal the person at their recording setup. [0–3s]',
  },
  {
    id: 'micreveal',
    label: 'Mikrofon Açılımı',
    en: 'Camera starts tight on the microphone surface. Person leans smoothly into frame from offscreen and settles to speak. [0–3s]',
  },
  {
    id: 'bookclose',
    label: 'Defter Kapanışı',
    en: 'Person holds an open notebook. Pauses. Slowly and deliberately closes it. Looks up directly into the camera. [0–3s]',
  },
  {
    id: 'walkinto',
    label: 'Çerçeveye Giriş',
    en: 'Frame begins empty — just the setting visible. Person walks calmly into frame from the side and settles naturally in front of the camera. [0–3s]',
  },
]

const VOICE_SETTINGS = [
  { id: 'podcast', label: 'Podcast Odası', en: 'cozy intimate podcast booth — warm table lamp, overflowing bookshelves, dark wooden desk, a coffee cup in the corner' },
  { id: 'studio', label: 'Kayıt Stüdyosu', en: 'professional recording studio with dark acoustic foam panels, soft overhead studio lighting — polished and intentional' },
  { id: 'cafe', label: 'Kafe Köşesi', en: 'quiet corner of a café — warm ambient light, blurred patrons in background, wooden table, steam rising from a cup' },
  { id: 'rooftop', label: 'Çatı Katı', en: 'rooftop terrace at golden hour — city skyline softly out of focus in the background, warm late-afternoon light' },
  { id: 'home', label: 'Ev Stüdyosu', en: 'personal home recording setup — cozy bedroom or study corner, ring light glow, intimate and authentic' },
  { id: 'street', label: 'Sokak', en: 'urban street corner — city life gently blurred in background, natural daylight, authentic urban energy' },
]

const VOICE_MICS = [
  { id: 'vintage', label: 'Vintage Kondenser', en: 'holds a classic large-diaphragm condenser microphone on a boom arm — warm, retro, timeless look' },
  { id: 'usb', label: 'Modern Mikrofon', en: 'positioned at a sleek modern USB studio microphone on a desk stand — clean and professional' },
  { id: 'handheld', label: 'El Mikrofonu', en: 'holds a dynamic handheld microphone, comfortable natural grip, speaks directly into it' },
  { id: 'ring', label: 'Ring Mikrofon', en: 'positioned with a selfie ring-light microphone setup — modern content creator look, soft ring-light halo visible' },
  { id: 'none', label: 'Mikrofonsuz', en: 'no microphone — speaks openly and directly into the camera in an honest documentary style' },
]

// ─── Prompt builders ───────────────────────────────────────────────────────

function buildTextPrompt(s: KState): string {
  const style = STYLES.find(x => x.id === s.style) || STYLES[1]
  const bg = BACKGROUNDS.find(x => x.id === s.background) || BACKGROUNDS[0]
  const fmt = FORMATS.find(x => x.id === s.format) || FORMATS[0]
  const tone = TONES.find(x => x.id === s.tone) || TONES[4]
  const motion = MOTIONS.find(x => x.id === s.motion) || MOTIONS[2]
  const q = s.quote.trim() || '[QUOTE TEXT HERE]'

  if (s.outputType === 'image') {
    return `Aesthetic typography photograph for social media.

BACKGROUND: ${bg.en}. ${style.en}.
COLOR PALETTE: ${tone.palette}.
LIGHTING: ${style.lighting}.

TEXT OVERLAY — centered, large, bold:
"${q}"
Font: clean bold sans-serif or elegant serif. Well-spaced letters, strong visual hierarchy. Text is the absolute focal point.

COMPOSITION:
- Text centered with generous breathing room
- Background softly de-focused where appropriate
- No people, no objects, no logos, no watermarks

MOOD: ${style.en}.

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | Ultra-sharp text | Photorealistic texture | Instagram/TikTok ready`
  }

  return `Cinematic 8-second atmospheric social media video — typography content.

BACKGROUND: ${bg.en}. ${style.en}.
COLOR PALETTE: ${tone.palette}.
LIGHTING: ${style.lighting}.

MOTION: ${motion.en}. Subtle and hypnotic — never distracts from the text.

TEXT REVEAL — centered:
"${q}"
Font: bold readable typeface, high legibility. Fades in softly over 2 seconds, holds for 5 seconds, fades out in the final second.

MOOD: ${style.en}. Contemplative and emotionally resonant.

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | 8 seconds | Seamlessly loopable | No hard cuts | TikTok / Instagram Reels ready
AUDIO: ${AUDIO_HINTS[s.motion] || 'minimal ambient'}, no voiceover, no lyrics`
}

function buildVoicePrompt(s: KState): string {
  const hook = VOICE_HOOKS.find(x => x.id === s.voiceHook) || VOICE_HOOKS[0]
  const setting = VOICE_SETTINGS.find(x => x.id === s.voiceSetting) || VOICE_SETTINGS[0]
  const mic = VOICE_MICS.find(x => x.id === s.micType) || VOICE_MICS[0]
  const person = s.gender === 'male' ? 'A young man' : 'A young woman'
  const q = s.quote.trim() || '[QUOTE TEXT HERE]'

  return `10-second vertical spoken-word UGC video (9:16 aspect ratio). Authentic podcast/quote-reader aesthetic — handheld phone camera feel, natural lighting, feels discovered not produced.

SETTING: ${setting.en}.

HOOK (0–3 seconds):
${hook.en}

SPEAKING SCENE (3–10 seconds):
${person} ${mic.en}. Direct and sincere eye contact with camera. Calm, unhurried delivery — sharing a personal thought with a close friend. Selfie angle or gentle low-angle shot.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE (Turkish, read aloud naturally over 7 seconds):
"${q}"

TONE: Intimate and thoughtful. Spoken-word poetry feel. Not scripted — a genuine quiet moment.
VIDEO SPECS: 10 seconds | 9:16 vertical | Turkish spoken audio | No cuts | Single continuous take`
}

function getPrompt(s: KState): string {
  if (s.outputType === 'voice') return buildVoicePrompt(s)
  return buildTextPrompt(s)
}

// ─── UI helpers ────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-medium transition-colors"
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
      {done ? 'Kopyalandı!' : 'Kopyala'}
    </button>
  )
}

function CopyAll({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
      {done ? 'Prompt Kopyalandı!' : 'Promptu Kopyala'}
    </button>
  )
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: { id: string; label: string; sub?: string }[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
            selected === o.id
              ? 'border-amber-500 bg-amber-900/20 text-amber-300'
              : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
          }`}
        >
          <span className="block">{o.label}</span>
          {o.sub && <span className="text-[10px] opacity-60">{o.sub}</span>}
        </button>
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

const KapsamKafe: React.FC<PageProps> = () => {
  const [state, setState] = useState<KState>({
    quote: '',
    outputType: 'image',
    style: 'dark',
    background: 'wall',
    motion: 'particles',
    format: 'reels',
    tone: 'moody',
    micType: 'vintage',
    voiceSetting: 'podcast',
    voiceHook: 'deepbreath',
    gender: 'female',
  })

  const set = <K extends keyof KState>(key: K) => (val: KState[K]) =>
    setState(prev => ({ ...prev, [key]: val }))

  const prompt = getPrompt(state)
  const hasQuote = state.quote.trim().length > 0
  const isVoice = state.outputType === 'voice'

  const OUTPUT_TYPES = [
    { id: 'image' as OutputType, label: 'Görsel', icon: <ImageIcon size={16} />, desc: 'Statik fotoğraf' },
    { id: 'video' as OutputType, label: 'Video', icon: <Film size={16} />, desc: 'Atmosferik video' },
    { id: 'voice' as OutputType, label: 'Sesli Okuma', icon: <Mic size={16} />, desc: 'UGC tarzı konuşma' },
  ]

  const promptLabel = isVoice ? 'Sesli Okuma Prompt' : state.outputType === 'image' ? 'Görsel Prompt' : 'Video Prompt'
  const promptIcon = isVoice
    ? <Mic size={14} className="text-amber-400" />
    : state.outputType === 'image'
    ? <ImageIcon size={14} className="text-amber-400" />
    : <Film size={14} className="text-amber-400" />

  const voiceTips = [
    'Yazını gir, mikrofon ve ortam seç',
    'Promptu kopyala',
    'Higgsfield → UGC / Video sekmesine gir',
    'Promptu yapıştır, avatar seç, üret',
    'İndir → TikTok / Instagram\'a yükle',
  ]
  const genericTips = [
    'Yazını gir, stil ve arka planı seç',
    'Promptu kopyala',
    'Higgsfield → Image veya Video sekmesine gir',
    'Promptu yapıştır ve üret',
    'İndir → TikTok / Instagram\'a yükle',
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm font-medium mb-4">
          <Coffee size={14} />
          KapsamKafe
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          İçerik <span className="text-amber-400">Üretici</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Estetik görsel, video veya sesli okuma — TikTok ve Instagram için Higgsfield'e hazır prompt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-8">
        {/* LEFT: Controls */}
        <div className="space-y-5">
          {/* Quote input */}
          <div className="card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Coffee size={14} className="text-amber-400" />
              Yazı / Söz
            </label>
            <textarea
              value={state.quote}
              onChange={e => setState(prev => ({ ...prev, quote: e.target.value }))}
              placeholder="Örnek: Hayat, yaşadıklarımızın toplamı değil; hissettiklerimizin özüdür."
              rows={3}
              className="input w-full resize-none text-sm leading-relaxed"
            />
            <p className="text-xs text-gray-500 mt-2">{state.quote.length} karakter</p>
          </div>

          {/* Output type */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-3">İçerik Tipi</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUT_TYPES.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setState(prev => ({ ...prev, outputType: opt.id }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    state.outputType === opt.id
                      ? 'border-amber-500 bg-amber-900/20 text-amber-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {opt.icon}
                  <span className="font-semibold text-xs">{opt.label}</span>
                  <span className="text-[10px] opacity-60 text-center leading-tight">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── VOICE controls ── */}
          {isVoice && (
            <>
              {/* Gender */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Karakter</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: 'female' as const, label: 'Kadın' },
                    { id: 'male' as const, label: 'Erkek' },
                  ]).map(g => (
                    <button
                      key={g.id}
                      onClick={() => set('gender')(g.id)}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        state.gender === g.id
                          ? 'border-amber-500 bg-amber-900/20 text-amber-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mic */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Mikrofon</p>
                <OptionGrid
                  options={VOICE_MICS.map(m => ({ id: m.id, label: m.label }))}
                  selected={state.micType}
                  onSelect={val => set('micType')(val)}
                />
              </div>

              {/* Voice Setting */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Ortam</p>
                <OptionGrid
                  options={VOICE_SETTINGS.map(s => ({ id: s.id, label: s.label }))}
                  selected={state.voiceSetting}
                  onSelect={val => set('voiceSetting')(val)}
                />
              </div>

              {/* Voice Hook */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-1">Giriş (Hook)</p>
                <p className="text-xs text-gray-500 mb-3">İlk 0–3 saniyenin görsel açılışı</p>
                <OptionGrid
                  options={VOICE_HOOKS.map(h => ({ id: h.id, label: h.label }))}
                  selected={state.voiceHook}
                  onSelect={val => set('voiceHook')(val)}
                />
              </div>
            </>
          )}

          {/* ── IMAGE / VIDEO controls ── */}
          {!isVoice && (
            <>
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Stil</p>
                <OptionGrid
                  options={STYLES.map(s => ({ id: s.id, label: s.label }))}
                  selected={state.style}
                  onSelect={val => set('style')(val)}
                />
              </div>

              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Arka Plan</p>
                <OptionGrid
                  options={BACKGROUNDS.map(b => ({ id: b.id, label: b.label }))}
                  selected={state.background}
                  onSelect={val => set('background')(val)}
                />
              </div>

              {state.outputType === 'video' && (
                <div className="card p-5">
                  <p className="text-sm font-semibold text-white mb-3">Hareket Efekti</p>
                  <OptionGrid
                    options={MOTIONS.map(m => ({ id: m.id, label: m.label }))}
                    selected={state.motion}
                    onSelect={val => set('motion')(val)}
                  />
                </div>
              )}

              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Format</p>
                <OptionGrid
                  options={FORMATS.map(f => ({ id: f.id, label: f.label, sub: f.ratio }))}
                  selected={state.format}
                  onSelect={val => set('format')(val)}
                />
              </div>

              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-3">Renk Tonu</p>
                <OptionGrid
                  options={TONES.map(t => ({ id: t.id, label: t.label }))}
                  selected={state.tone}
                  onSelect={val => set('tone')(val)}
                />
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Output */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Prompt preview */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {promptIcon}
                {promptLabel}
              </h3>
              {hasQuote && <CopyBtn text={prompt} />}
            </div>
            <pre
              className={`text-xs font-mono whitespace-pre-wrap leading-relaxed rounded-xl p-4 border border-gray-800 max-h-[440px] overflow-y-auto ${
                hasQuote ? 'text-gray-300 bg-gray-950' : 'text-gray-600 bg-gray-900/50'
              }`}
            >
              {prompt}
            </pre>
          </div>

          {hasQuote ? (
            <CopyAll text={prompt} />
          ) : (
            <div className="card p-5 text-center">
              <Coffee size={28} className="text-amber-700 mx-auto mb-2 opacity-40" />
              <p className="text-gray-500 text-sm">
                Sol tarafta yazını gir,<br />prompt otomatik hazırlanır.
              </p>
            </div>
          )}

          {/* Sesli okuma bilgi kartı */}
          {isVoice && (
            <div className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-4">
              <p className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <Mic size={12} />
                Sesli Okuma Modu
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Higgsfield'de <strong className="text-white">UGC</strong> veya <strong className="text-white">Video</strong> sekmesini kullan. Avatar seç, promptu yapıştır — avatar seçtiğin Türkçe sözü doğal şekilde okuyacak.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="card p-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Nasıl Kullanırım</p>
            <ol className="space-y-2">
              {(isVoice ? voiceTips : genericTips).map((step, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-gray-500">
                  <span className="text-amber-600 font-bold flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KapsamKafe
