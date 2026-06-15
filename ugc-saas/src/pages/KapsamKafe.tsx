import React, { useState } from 'react'
import { Coffee, Copy, Check, Film, ImageIcon } from 'lucide-react'
import { PageProps } from '../types'

type OutputType = 'image' | 'video'

interface KState {
  quote: string
  outputType: OutputType
  style: string
  background: string
  motion: string
  format: string
  tone: string
}

const STYLES = [
  {
    id: 'minimal',
    label: 'Minimal',
    en: 'clean minimal composition, abundant white space, elegant simplicity',
    lighting: 'soft diffused natural light, even exposure, no harsh shadows',
  },
  {
    id: 'dark',
    label: 'Dark Aesthetic',
    en: 'dark and moody atmosphere, dramatic shadows, high contrast, brooding cinematic aesthetic',
    lighting: 'low-key dramatic lighting, deep blacks, single rim light source',
  },
  {
    id: 'vintage',
    label: 'Vintage',
    en: 'vintage aged aesthetic, worn film grain texture, nostalgic faded character',
    lighting: 'warm golden light, slightly overexposed edges, subtle lens flare',
  },
  {
    id: 'grunge',
    label: 'Grunge',
    en: 'grungy urban aesthetic, rough distressed textures, raw and authentic street feel',
    lighting: 'harsh directional industrial light, strong contrast shadows',
  },
  {
    id: 'neon',
    label: 'Neon',
    en: 'neon-lit cyberpunk aesthetic, glowing electric accents, night city energy',
    lighting: 'neon glow, purple and blue light spill, night scene illumination',
  },
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

function buildPrompt(s: KState): string {
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
Font: clean bold sans-serif or elegant serif. Letters well-spaced, strong visual hierarchy. The text is the absolute focal point of the entire composition.

COMPOSITION:
- Text centered with generous breathing room
- Background softly de-focused where appropriate
- No people, no objects, no logos, no watermarks
- Rule of thirds applied for short quotes

MOOD: ${style.en}.

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | Ultra-sharp text rendering | Photorealistic texture quality | Instagram/TikTok ready`
  }

  return `Cinematic 8-second atmospheric social media video — typography content.

BACKGROUND: ${bg.en}. ${style.en}.
COLOR PALETTE: ${tone.palette}.
LIGHTING: ${style.lighting}.

MOTION: ${motion.en}. The movement is subtle and hypnotic — never distracts from the text.

TEXT REVEAL — centered:
"${q}"
Font: bold readable typeface, high legibility. Text fades in softly over the first 2 seconds, holds prominently for 5 seconds, fades out gently in the final second.

MOOD: ${style.en}. Contemplative and emotionally resonant — made to be watched twice.

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | Duration: 8 seconds | Seamlessly loopable | No hard cuts
TikTok / Instagram Reels ready
AUDIO: ${AUDIO_HINTS[s.motion] || 'minimal ambient'}, no voiceover, no lyrics`
}

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

function OptionGrid({
  options,
  selected,
  onSelect,
  cols = 3,
}: {
  options: { id: string; label: string; sub?: string }[]
  selected: string
  onSelect: (id: string) => void
  cols?: number
}) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
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

const KapsamKafe: React.FC<PageProps> = () => {
  const [state, setState] = useState<KState>({
    quote: '',
    outputType: 'image',
    style: 'dark',
    background: 'wall',
    motion: 'particles',
    format: 'reels',
    tone: 'moody',
  })

  const set = (key: keyof KState) => (val: string) =>
    setState(prev => ({ ...prev, [key]: val }))

  const prompt = buildPrompt(state)
  const hasQuote = state.quote.trim().length > 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm font-medium mb-4">
          <Coffee size={14} />
          KapsamKafe
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Duvar Yazısı <span className="text-amber-400">Üretici</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          TikTok ve Instagram için estetik quote içerikleri — Higgsfield'e hazır prompt.
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
            <p className="text-sm font-semibold text-white mb-3">Çıktı Tipi</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'image' as OutputType, label: 'Görsel', icon: <ImageIcon size={18} />, desc: 'Fotoğraf / Statik' },
                { id: 'video' as OutputType, label: 'Video', icon: <Film size={18} />, desc: '8 saniyelik video' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setState(prev => ({ ...prev, outputType: opt.id }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    state.outputType === opt.id
                      ? 'border-amber-500 bg-amber-900/20 text-amber-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {opt.icon}
                  <span className="font-semibold text-sm">{opt.label}</span>
                  <span className="text-[11px] opacity-60">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-3">Stil</p>
            <OptionGrid
              options={STYLES.map(s => ({ id: s.id, label: s.label }))}
              selected={state.style}
              onSelect={set('style')}
            />
          </div>

          {/* Background */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-3">Arka Plan</p>
            <OptionGrid
              options={BACKGROUNDS.map(b => ({ id: b.id, label: b.label }))}
              selected={state.background}
              onSelect={set('background')}
            />
          </div>

          {/* Motion (only for video) */}
          {state.outputType === 'video' && (
            <div className="card p-5">
              <p className="text-sm font-semibold text-white mb-3">Hareket Efekti</p>
              <OptionGrid
                options={MOTIONS.map(m => ({ id: m.id, label: m.label }))}
                selected={state.motion}
                onSelect={set('motion')}
              />
            </div>
          )}

          {/* Format */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-3">Format</p>
            <OptionGrid
              options={FORMATS.map(f => ({ id: f.id, label: f.label, sub: f.ratio }))}
              selected={state.format}
              onSelect={set('format')}
              cols={3}
            />
          </div>

          {/* Tone */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-white mb-3">Renk Tonu</p>
            <OptionGrid
              options={TONES.map(t => ({ id: t.id, label: t.label }))}
              selected={state.tone}
              onSelect={set('tone')}
            />
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* Prompt output */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                {state.outputType === 'image'
                  ? <ImageIcon size={14} className="text-amber-400" />
                  : <Film size={14} className="text-amber-400" />}
                {state.outputType === 'image' ? 'Görsel Prompt' : 'Video Prompt'}
              </h3>
              {hasQuote && <CopyBtn text={prompt} />}
            </div>
            <pre
              className={`text-xs font-mono whitespace-pre-wrap leading-relaxed rounded-xl p-4 border border-gray-800 max-h-[420px] overflow-y-auto ${
                hasQuote ? 'text-gray-300 bg-gray-950' : 'text-gray-600 bg-gray-900/50'
              }`}
            >
              {prompt}
            </pre>
          </div>

          {/* Big copy button */}
          {hasQuote && (
            <CopyAll text={prompt} />
          )}

          {!hasQuote && (
            <div className="card p-5 text-center">
              <Coffee size={28} className="text-amber-700 mx-auto mb-2 opacity-40" />
              <p className="text-gray-500 text-sm">Sol tarafta yazını gir,<br />prompt otomatik hazırlanır.</p>
            </div>
          )}

          {/* Tips */}
          <div className="card p-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Nasıl Kullanırım</p>
            <ol className="space-y-2">
              {[
                'Yazını gir, stil ve arka planı seç',
                'Sağdaki promptu kopyala',
                'Higgsfield → Image veya Video sekmesine gir',
                'Promptu yapıştır ve üret',
                'İndir → TikTok / Instagram\'a yükle',
              ].map((step, i) => (
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

export default KapsamKafe
