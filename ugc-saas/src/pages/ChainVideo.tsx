import React, { useState } from 'react'
import { Layers, Copy, Check, ChevronRight, ChevronDown, Zap } from 'lucide-react'
import { PageProps } from '../types'

type ContentType = 'ugc' | 'quote' | 'general'
type Platform = 'higgsfield' | 'grok'

interface ChainState {
  brief: string
  contentType: ContentType
  platform: Platform
  tone: string
  setting: string
  seg1Text: string
  seg2Text: string
  seg3Text: string
}

interface Segment {
  label: string
  timeRange: string
  prompt: string
  lastFrame?: string
}

// ─── Data ──────────────────────────────────────────────────────────────────

const TONES: Record<string, { label: string; en: string; lighting: string; camera: string }> = {
  energetic: {
    label: 'Enerjik', en: 'high-energy, dynamic and enthusiastic delivery',
    lighting: 'bright vibrant lighting', camera: 'natural energetic handheld movement',
  },
  calm: {
    label: 'Sakin', en: 'calm, composed and trustworthy delivery',
    lighting: 'soft warm natural lighting', camera: 'very stable, gentle slow drift',
  },
  emotional: {
    label: 'Duygusal', en: 'heartfelt, genuine emotional authenticity',
    lighting: 'soft intimate warm tones', camera: 'almost still, held-breath feeling',
  },
  fun: {
    label: 'Eğlenceli', en: 'playful, lighthearted and relatable',
    lighting: 'bright colorful lighting', camera: 'casual natural movement',
  },
  dramatic: {
    label: 'Dramatik', en: 'dramatic intensity, powerful cinematic delivery',
    lighting: 'high contrast, deep shadows', camera: 'imperceptible slow zoom',
  },
  trust: {
    label: 'Güven Verici', en: 'confident, authoritative and clear expert delivery',
    lighting: 'clean professional even lighting', camera: 'steady and composed',
  },
}

const SETTINGS: Record<string, { label: string; en: string }> = {
  home: { label: 'Ev', en: 'cozy home interior — warm ambient light, natural lived-in background' },
  street: { label: 'Sokak', en: 'urban street setting — authentic outdoor energy, natural daylight, city blurred behind' },
  studio: { label: 'Stüdyo', en: 'clean minimal studio — seamless neutral background, professional lighting' },
  cafe: { label: 'Kafe', en: 'warm café corner — ambient warmth, wooden surfaces, blurred patrons in background' },
  office: { label: 'Ofis', en: 'modern office space — professional backdrop, natural window light' },
  nature: { label: 'Doğa', en: 'natural outdoor setting — trees and open sky, soft natural light' },
}

// ─── Last frame builder ────────────────────────────────────────────────────

function buildLastFrame(s: ChainState, seg: 1 | 2): string {
  const settingEn = SETTINGS[s.setting]?.en || 'the chosen setting'

  if (s.contentType === 'ugc') {
    return seg === 1
      ? `Person holding the featured item at mid-chest level. Warm confident expression, direct sincere eye contact with camera. Natural inter-sentence pause — lips slightly relaxed. Background: ${settingEn}. Lighting and color temperature fully continuous.`
      : `Same person, same setting, all lighting continuous. Now leaning 5–8cm closer to the camera — energy quietly building toward the close. Expression: warm and direct. Hands open in an inviting gesture. One beat of silence before the final words.`
  }

  if (s.contentType === 'quote') {
    return seg === 1
      ? `Speaker in ${settingEn}. Eyes briefly drop to a neutral midpoint — natural pause after the first lines. Contemplative expression. Slow visible breath. Posture unchanged, composed and fully present.`
      : `Speaker with deepened emotional presence. Gaze returns to camera with quiet intensity. The final words are approaching — a beat of inner stillness before the closing line. Atmosphere: charged, expectant.`
  }

  return seg === 1
    ? `Speaker in ${settingEn}. Natural pause between points. Engaged expression, direct eye contact. Breath before the next thought. All visual elements fully continuous.`
    : `Speaker leaning slightly closer to camera. Energy quietly building. Preparing to deliver the closing message — warm, direct, fully present.`
}

// ─── Prompt builders ───────────────────────────────────────────────────────

const HOOKS: Record<ContentType, string> = {
  ugc: 'Product or person bursts into frame from below the frame edge — sudden visual impact, immediate attention. [0–3s]',
  quote: 'Extreme close-up on speaker\'s eyes, held for 2 seconds. Camera slowly pulls back to reveal person at their setup. [0–3s]',
  general: 'Person walks calmly into the empty frame from the side. Settles, takes a breath, makes direct eye contact. [0–3s]',
}

function buildHighgsfieldSegments(s: ChainState): Segment[] {
  const tone = TONES[s.tone] || TONES.calm
  const setting = SETTINGS[s.setting] || SETTINGS.home
  const t1 = s.seg1Text.trim() || '[1. BÖLÜM — Türkçe konuşma metni]'
  const t2 = s.seg2Text.trim() || '[2. BÖLÜM — Türkçe konuşma metni]'
  const t3 = s.seg3Text.trim() || '[3. BÖLÜM — Türkçe konuşma metni]'
  const brief = s.brief.trim() || '[içerik konusu]'

  const lf1 = buildLastFrame(s, 1)
  const lf2 = buildLastFrame(s, 2)

  return [
    {
      label: 'Bölüm 1', timeRange: '0–10s',
      prompt: `10-second vertical UGC video (9:16). ${brief}. Authentic handheld phone camera feel, ${tone.en}. No studio gloss.

SETTING: ${setting.en}.

HOOK (0–3s):
${HOOKS[s.contentType]}

MAIN SCENE (3–10s):
Person speaks directly into camera. ${tone.en}. Selfie angle. ${tone.lighting}. Natural, unscripted energy.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE — Segment 1 of 3:
"${t1}"

VIDEO SPECS: 10s | 9:16 | UGC | Turkish audio | Single continuous take | No cuts`,
      lastFrame: lf1,
    },
    {
      label: 'Bölüm 2', timeRange: '10–20s',
      prompt: `10-second vertical UGC video (9:16). Seamless continuation — picks up exactly where Segment 1 ended.

STARTING FRAME (match precisely to start this segment):
${lf1}

SCENE (0–10s):
Continuous — same person, same setting: ${setting.en}. Identical lighting, identical color temperature. The moment flows forward without any visual break. ${tone.en}.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE — Segment 2 of 3:
"${t2}"

VIDEO SPECS: 10s | 9:16 | UGC | Turkish audio | Seamless continuation | No cuts`,
      lastFrame: lf2,
    },
    {
      label: 'Bölüm 3', timeRange: '20–30s',
      prompt: `10-second vertical UGC video (9:16). Final segment — closing of a 30-second chain.

STARTING FRAME (match precisely to start this segment):
${lf2}

SCENE (0–10s):
Emotional close. Person delivers the final words with full presence. ${tone.en}. Direct, warm, memorable ending. Scene holds 1 second of silence after speaking — natural, powerful close.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE — Segment 3 of 3 (Closing):
"${t3}"

VIDEO SPECS: 10s | 9:16 | UGC | Turkish audio | Strong closing frame | No cuts`,
    },
  ]
}

function buildGrokSegments(s: ChainState): Segment[] {
  const tone = TONES[s.tone] || TONES.calm
  const setting = SETTINGS[s.setting] || SETTINGS.home
  const t1 = s.seg1Text.trim() || '[1. BÖLÜM — Türkçe konuşma metni]'
  const t2 = s.seg2Text.trim() || '[2. BÖLÜM — Türkçe konuşma metni]'
  const t3 = s.seg3Text.trim() || '[3. BÖLÜM — Türkçe konuşma metni]'
  const brief = s.brief.trim() || '[içerik konusu]'

  const lf1 = buildLastFrame(s, 1)
  const lf2 = buildLastFrame(s, 2)

  return [
    {
      label: 'Bölüm 1', timeRange: '0–10s',
      prompt: `Hyperrealistic cinematic 10-second vertical video. 4K ultra-detailed. ${brief}.

SUBJECT: ${s.contentType === 'ugc' ? 'Authentic UGC content creator — real person feel, no commercial gloss' : 'Thoughtful, genuine speaker'}.
SETTING: ${setting.en}.
ACTION (0–3s): ${s.contentType === 'ugc' ? 'Product or person enters frame suddenly from below — immediate visual hook.' : 'Extreme close-up on eyes held 2 seconds, camera slowly pulls back.'}
ACTION (3–10s): Person speaks naturally to camera. ${tone.en}. Subtle authentic body movement.
CAMERA: Handheld selfie angle, slight natural micro-shake, ${tone.camera}.
LIGHTING: ${tone.lighting}.
COLOR GRADE: Warm cinematic, subtle desaturation, film feel.
DIALOGUE (Turkish spoken audio): "${t1}"

VIDEO SPECS: 9:16 | 10s | 4K | Hyperrealistic skin texture | Film grain: subtle | No hard cuts`,
      lastFrame: lf1,
    },
    {
      label: 'Bölüm 2', timeRange: '10–20s',
      prompt: `Hyperrealistic cinematic 10-second vertical video. 4K ultra-detailed. Direct continuation of Segment 1.

PRECISE STARTING FRAME — recreate this exactly to open the video:
${lf1}
This video begins from this precise moment. Perfect visual continuity — identical lighting, color temperature, camera angle, subject position. No discontinuity, no jump cut.

SUBJECT: Same person, same wardrobe.
SETTING: Same — ${setting.en}.
ACTION (0–10s): Continues speaking naturally. ${tone.en}. Uninterrupted flow.
CAMERA: Continuous handheld — identical to Segment 1, ${tone.camera}.
LIGHTING: Exactly matching Segment 1 — ${tone.lighting}.
DIALOGUE (Turkish spoken audio): "${t2}"

VIDEO SPECS: 9:16 | 10s | 4K | Hyperrealistic | Perfect visual continuity | No hard cuts`,
      lastFrame: lf2,
    },
    {
      label: 'Bölüm 3', timeRange: '20–30s',
      prompt: `Hyperrealistic cinematic 10-second vertical video. 4K ultra-detailed. Final segment of a 30-second chain.

PRECISE STARTING FRAME — recreate this exactly to open the video:
${lf2}
This video begins from this precise moment. Identical visual continuity throughout — same everything.

SUBJECT: Same person, same wardrobe.
SETTING: Same — ${setting.en}.
ACTION (0–10s): Delivers closing message with full emotional presence. ${tone.en}. Holds camera contact for 1 second of silence after last word — powerful, natural ending.
CAMERA: Very subtle imperceptible drift 2–3mm closer during final words. Settles.
LIGHTING: Continuous from Segment 2 — ${tone.lighting}.
DIALOGUE (Turkish spoken audio — closing): "${t3}"

VIDEO SPECS: 9:16 | 10s | 4K | Hyperrealistic | Strong final frame | Perfect chain ending`,
    },
  ]
}

function buildSegments(s: ChainState): Segment[] {
  return s.platform === 'grok' ? buildGrokSegments(s) : buildHighgsfieldSegments(s)
}

// ─── UI helpers ────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Kopyala' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-medium transition-colors"
    >
      {done ? <Check size={12} /> : <Copy size={12} />}
      {done ? 'Kopyalandı!' : label}
    </button>
  )
}

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        active
          ? 'border-violet-500 bg-violet-900/30 text-violet-300'
          : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function SegmentCard({ seg, idx }: { seg: Segment; idx: number }) {
  const [showFrame, setShowFrame] = useState(false)

  const colors = [
    'from-violet-900/30 to-indigo-900/20 border-violet-700/40',
    'from-indigo-900/30 to-blue-900/20 border-indigo-700/40',
    'from-blue-900/30 to-violet-900/20 border-blue-700/40',
  ]
  const badges = ['bg-violet-700/50 text-violet-200', 'bg-indigo-700/50 text-indigo-200', 'bg-blue-700/50 text-blue-200']

  return (
    <div className={`rounded-2xl border bg-gradient-to-b ${colors[idx]} p-4 flex flex-col gap-3`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badges[idx]}`}>
            {seg.label}
          </span>
          <span className="text-xs text-gray-500 font-mono">{seg.timeRange}</span>
        </div>
        <CopyButton text={seg.prompt} />
      </div>

      {/* Prompt */}
      <pre className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-950/60 rounded-xl p-3 border border-gray-800/60 max-h-64 overflow-y-auto flex-1">
        {seg.prompt}
      </pre>

      {/* Last Frame */}
      {seg.lastFrame && (
        <div className="border border-amber-800/40 rounded-xl bg-amber-950/20 overflow-hidden">
          <button
            onClick={() => setShowFrame(!showFrame)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-amber-400 font-medium"
          >
            <span>⬇ Son Kare (Bölüm {idx + 2} başlangıcı)</span>
            {showFrame ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {showFrame && (
            <div className="px-3 pb-3 space-y-2">
              <pre className="text-[11px] font-mono text-amber-200/70 whitespace-pre-wrap leading-relaxed">
                {seg.lastFrame}
              </pre>
              <CopyButton text={seg.lastFrame} label="Son Kareyi Kopyala" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

const ChainVideo: React.FC<PageProps> = () => {
  const [state, setState] = useState<ChainState>({
    brief: '',
    contentType: 'ugc',
    platform: 'higgsfield',
    tone: 'energetic',
    setting: 'home',
    seg1Text: '',
    seg2Text: '',
    seg3Text: '',
  })
  const [segments, setSegments] = useState<Segment[] | null>(null)

  const set = <K extends keyof ChainState>(key: K) => (val: ChainState[K]) =>
    setState(prev => ({ ...prev, [key]: val }))

  const handleGenerate = () => setSegments(buildSegments(state))

  const canGenerate = state.brief.trim().length > 0 || state.seg1Text.trim().length > 0

  const allPrompts = segments
    ? segments.map(s => `── ${s.label} (${s.timeRange}) ──\n\n${s.prompt}`).join('\n\n\n')
    : ''

  const CONTENT_TYPES: { id: ContentType; label: string; desc: string }[] = [
    { id: 'ugc', label: 'UGC Ürün', desc: 'Ürün / marka tanıtımı' },
    { id: 'quote', label: 'Sesli Quote', desc: 'Söz / KapsamKafe' },
    { id: 'general', label: 'Genel', desc: 'Serbest içerik' },
  ]

  const SEG_PLACEHOLDERS: Record<ContentType, [string, string, string]> = {
    ugc: [
      'Merhaba! [ürün adı] ile tanışın — [özellik/fayda].',
      '[Detay veya ikinci fayda]. Farkı gerçekten hissediyorsunuz.',
      'Hemen deneyin! [fiyat/kampanya/link].',
    ],
    quote: [
      '[Alıntının birinci kısmı — ilk cümle veya iki cümle]',
      '[Alıntının devamı — derinleşen kısım]',
      '[Alıntının kapanışı — en güçlü son cümle]',
    ],
    general: [
      '[Açılış — izleyiciyi içine çeken ilk cümle]',
      '[Ana mesaj — vermek istediğin bilgi veya duygu]',
      '[Kapanış — eylem çağrısı veya unutulmaz son söz]',
    ],
  }

  const ph = SEG_PLACEHOLDERS[state.contentType]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-900/30 border border-violet-700/40 text-violet-300 text-sm font-medium mb-4">
          <Layers size={14} />
          Zincir Video
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          30 Saniye <span className="text-violet-400">Zincir</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          3 × 10 saniyelik bağlantılı video promptu. Son kare bir sonrakinin başlangıcı — Grok veya Higgsfield ile kullan.
        </p>
      </div>

      {/* Form */}
      <div className="card p-6 mb-8 space-y-6">
        {/* Brief */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            İstek / Konu
            <span className="ml-2 text-xs text-gray-500 font-normal">
              ne hakkında? ürün, mesaj, hedef kitle, ton...
            </span>
          </label>
          <textarea
            value={state.brief}
            onChange={e => setState(prev => ({ ...prev, brief: e.target.value }))}
            placeholder="Örnek: Gökçen Optik güneş gözlükleri, 999 TL yaz kampanyası. Genç ve dinamik kitleye enerjik şekilde anlat. Sonunda siteye yönlendir."
            rows={3}
            className="input w-full resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Content type + Platform + Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">İçerik Tipi</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map(c => (
                <Chip key={c.id} active={state.contentType === c.id} onClick={() => set('contentType')(c.id)}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Platform</p>
            <div className="flex gap-2">
              {(['higgsfield', 'grok'] as Platform[]).map(p => (
                <Chip key={p} active={state.platform === p} onClick={() => set('platform')(p)}>
                  {p === 'higgsfield' ? 'Higgsfield' : 'Grok'}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Ton</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TONES).map(([id, t]) => (
                <Chip key={id} active={state.tone === id} onClick={() => set('tone')(id)}>
                  {t.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Setting */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Ortam</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SETTINGS).map(([id, s]) => (
              <Chip key={id} active={state.setting === id} onClick={() => set('setting')(id)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Turkish dialogue per segment */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Türkçe Konuşma Metinleri
            <span className="ml-2 font-normal normal-case text-gray-500">her bölüm için ~10–15 kelime</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { key: 'seg1Text' as const, label: 'Bölüm 1', color: 'border-violet-700/40 focus:border-violet-500' },
              { key: 'seg2Text' as const, label: 'Bölüm 2', color: 'border-indigo-700/40 focus:border-indigo-500' },
              { key: 'seg3Text' as const, label: 'Bölüm 3', color: 'border-blue-700/40 focus:border-blue-500' },
            ]).map((s, i) => (
              <div key={s.key}>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <textarea
                  value={state[s.key]}
                  onChange={e => setState(prev => ({ ...prev, [s.key]: e.target.value }))}
                  placeholder={ph[i]}
                  rows={2}
                  className={`input w-full resize-none text-xs leading-relaxed ${s.color}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            canGenerate
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-900/30'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Zap size={18} fill={canGenerate ? 'white' : 'currentColor'} />
          {segments ? '3 Promptu Yeniden Üret' : '3 Bölüm Üret'}
        </button>

        {!canGenerate && (
          <p className="text-center text-xs text-gray-600 -mt-3">Üstteki istek alanını ya da konuşma metinlerini doldur.</p>
        )}
      </div>

      {/* Output */}
      {segments && (
        <div className="space-y-6">
          {/* Copy all */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              30 Saniyelik Zincir
              <span className="ml-2 text-sm font-normal text-gray-500">
                {state.platform === 'grok' ? 'Grok / Aurora' : 'Higgsfield'} formatında
              </span>
            </h2>
            <CopyAllButton text={allPrompts} />
          </div>

          {/* Workflow hint */}
          <div className="rounded-xl border border-violet-800/30 bg-violet-950/20 p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2 font-medium text-violet-300 flex-shrink-0">
              <Layers size={13} />
              Kullanım Akışı
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['Bölüm 1 promptunu üret', 'Son kareyi kaydet', 'Bölüm 2 promptunu + son kare → video uzat', 'Bölüm 3 için tekrarla', '3 videoyu birleştir = 30s'].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{step}</span>
                  {idx < arr.length - 1 && <ChevronRight size={12} className="text-gray-600 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3 segment cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {segments.map((seg, i) => (
              <div key={i} className="flex flex-col gap-3">
                <SegmentCard seg={seg} idx={i} />
                {i < 2 && (
                  <div className="flex lg:hidden items-center justify-center text-gray-700 py-1">
                    <ChevronDown size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CopyAllButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm font-medium transition-colors border border-violet-700/30"
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
      {done ? 'Tümü Kopyalandı!' : '3 Promptu Kopyala'}
    </button>
  )
}

export default ChainVideo
