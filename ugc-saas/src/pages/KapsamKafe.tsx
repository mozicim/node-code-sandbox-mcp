import React, { useState } from 'react'
import { Coffee, Copy, Check, Film, ImageIcon, Mic, Zap, Sparkles, LayoutGrid } from 'lucide-react'
import { PageProps } from '../types'

type OutputType = 'image' | 'video' | 'voice'
type VoicePlatform = 'grok' | 'higgsfield'

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
  voicePlatform: VoicePlatform
  micType: string
  voiceSetting: string
  voiceHook: string
  gender: 'male' | 'female'
}

type KTab = 'builder' | 'gallery'

// ─── Hook Gallery data ─────────────────────────────────────────────────────

interface HookTemplate {
  id: string
  name: string
  type: 'carpici' | 'yumusak'
  emoji: string
  gradient: string
  accentColor: string
  description: string
  outputType: OutputType
  settings: Partial<KState>
}

const HOOK_TEMPLATES: HookTemplate[] = [
  {
    id: 'duvar-kesfi',
    name: 'Duvar Keşfi',
    type: 'carpici',
    emoji: '🧱',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    accentColor: 'border-orange-700/60',
    description: 'Kamera ağır çekimde tekstürlü duvara doğru ilerler, söz yavaşça belirmeye başlar.',
    outputType: 'video',
    settings: { style: 'dark', background: 'wall', motion: 'slowzoom', tone: 'moody', format: 'reels' },
  },
  {
    id: 'mum-isigi',
    name: 'Mum Işığı',
    type: 'yumusak',
    emoji: '🕯️',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #451a03 100%)',
    accentColor: 'border-amber-600/60',
    description: 'Titreşen mum aydınlığı, sıcak ahşap zemin üzerinde yazıyı nazikçe çerçeveler.',
    outputType: 'image',
    settings: { style: 'vintage', background: 'wood', tone: 'warm', format: 'reels' },
  },
  {
    id: 'yagmur-cami',
    name: 'Yağmur Camı',
    type: 'yumusak',
    emoji: '🌧️',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    accentColor: 'border-blue-700/60',
    description: 'Camdan akan yağmur damlaları arasında şehir ışıkları bokeh yapar, söz öne çıkar.',
    outputType: 'video',
    settings: { style: 'minimal', background: 'city', motion: 'rain', tone: 'cool', format: 'reels' },
  },
  {
    id: 'neon-gece',
    name: 'Neon Gece',
    type: 'carpici',
    emoji: '💜',
    gradient: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #86198f 100%)',
    accentColor: 'border-purple-500/60',
    description: 'Neon ışıklar parlayan gece sahnesinde yazı adeta elektrik gibi çarpar.',
    outputType: 'image',
    settings: { style: 'neon', background: 'city', tone: 'moody', format: 'reels' },
  },
  {
    id: 'beton-ruh',
    name: 'Beton Ruh',
    type: 'carpici',
    emoji: '🏗️',
    gradient: 'linear-gradient(135deg, #27272a 0%, #3f3f46 50%, #18181b 100%)',
    accentColor: 'border-zinc-500/60',
    description: 'Ham beton doku üzerinde yüksek kontrast siyah-beyaz estetik — sert ve güçlü.',
    outputType: 'image',
    settings: { style: 'grunge', background: 'concrete', tone: 'bw', format: 'reels' },
  },
  {
    id: 'orman-nefesi',
    name: 'Orman Nefesi',
    type: 'yumusak',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #022c22 100%)',
    accentColor: 'border-emerald-600/60',
    description: 'Doğa arka planı, yeşilin huzurlu derinliği — ruh sezgisine seslenen bir açılış.',
    outputType: 'image',
    settings: { style: 'minimal', background: 'nature', tone: 'warm', format: 'reels' },
  },
  {
    id: 'duman-perdesi',
    name: 'Duman Perdesi',
    type: 'carpici',
    emoji: '🌫️',
    gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #030712 100%)',
    accentColor: 'border-gray-500/60',
    description: 'Atmosferik duman tülü yavaşça çekilir, arkasında söz belirir — dramatik ve gizemli.',
    outputType: 'video',
    settings: { style: 'dark', background: 'abstract', motion: 'smoke', tone: 'moody', format: 'reels' },
  },
  {
    id: 'sabah-isigi',
    name: 'Sabah Işığı',
    type: 'yumusak',
    emoji: '☀️',
    gradient: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #78350f 100%)',
    accentColor: 'border-yellow-600/60',
    description: 'Altın sabah güneşi doğa manzarasına yavaş zoom ile yaklaşır — umut dolu açılış.',
    outputType: 'video',
    settings: { style: 'minimal', background: 'nature', motion: 'slowzoom', tone: 'warm', format: 'reels' },
  },
  {
    id: 'goz-acilisi',
    name: 'Göz Açılışı',
    type: 'carpici',
    emoji: '👁️',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f0a2e 100%)',
    accentColor: 'border-violet-500/60',
    description: 'Gözler kapalı, derin bir an — sonra yavaşça kameraya bakış. En etkili UGC girişi.',
    outputType: 'voice',
    settings: { voiceHook: 'eyeopen', voiceSetting: 'street', micType: 'handheld' },
  },
  {
    id: 'derin-nefes',
    name: 'Derin Nefes',
    type: 'yumusak',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #082f49 100%)',
    accentColor: 'border-cyan-600/60',
    description: 'Sessizce derin bir nefes, gözler kaldırılır — sakin ve içten bir başlangıç.',
    outputType: 'voice',
    settings: { voiceHook: 'deepbreath', voiceSetting: 'home', micType: 'usb' },
  },
  {
    id: 'yuz-yakan-plan',
    name: 'Yüz Yakın Plan',
    type: 'carpici',
    emoji: '🎬',
    gradient: 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #4c0519 100%)',
    accentColor: 'border-rose-600/60',
    description: 'Önce gözlere ekstrem yakın plan, sonra geriye çekilerek kişi ortaya çıkar.',
    outputType: 'voice',
    settings: { voiceHook: 'faceclose', voiceSetting: 'podcast', micType: 'vintage' },
  },
  {
    id: 'defter-kapanisi',
    name: 'Defter Kapanışı',
    type: 'yumusak',
    emoji: '📓',
    gradient: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #1c1917 100%)',
    accentColor: 'border-amber-700/60',
    description: 'El yavaşça defteri kapatır, sonra kameraya bakar — düşünceli ve içe dönük.',
    outputType: 'voice',
    settings: { voiceHook: 'bookclose', voiceSetting: 'cafe', micType: 'handheld' },
  },
]

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

// Order matters — eyeopen is first because it's proven to work best
const VOICE_HOOKS = [
  {
    id: 'eyeopen',
    label: 'Göz Açılışı',
    en: 'Person stands with eyes gently closed, head slightly lowered — a private moment of stillness [0–2s]. Eyes open slowly and deliberately, making unhurried direct eye contact with the camera [2–3s].',
  },
  {
    id: 'deepbreath',
    label: 'Derin Nefes',
    en: 'Person already in frame, eyes cast slightly downward. Takes one slow, visible breath. Lifts their gaze directly into the lens — ready to speak. [0–3s]',
  },
  {
    id: 'faceclose',
    label: 'Yüz Yakın Plan',
    en: 'Extreme close-up on the speaker\'s eyes — camera holds for 2 seconds. Slowly pulls back to reveal the person at their setup. [0–3s]',
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
]

const VOICE_SETTINGS = [
  { id: 'street', label: 'Sokak', en: 'urban street setting — blurred city buildings in background, soft natural daylight, gentle bokeh depth of field. Authentic and unplanned feel.' },
  { id: 'podcast', label: 'Podcast Odası', en: 'cozy intimate podcast booth — warm table lamp, overflowing bookshelves, dark wooden desk, a coffee cup in the corner' },
  { id: 'studio', label: 'Kayıt Stüdyosu', en: 'professional recording studio with dark acoustic foam panels, soft overhead studio lighting — polished and intentional' },
  { id: 'cafe', label: 'Kafe Köşesi', en: 'quiet corner of a café — warm ambient light, blurred patrons in background, wooden table, steam rising from a cup' },
  { id: 'rooftop', label: 'Çatı Katı', en: 'rooftop terrace at golden hour — city skyline softly out of focus in the background, warm late-afternoon light' },
  { id: 'home', label: 'Ev Stüdyosu', en: 'personal home recording setup — cozy bedroom or study corner, ring light glow, intimate and authentic' },
]

const VOICE_MICS = [
  { id: 'handheld', label: 'El Kondenser', en: 'holds a handheld condenser microphone with a shock mount — natural grip, authentic street reporter feel' },
  { id: 'vintage', label: 'Vintage Stand', en: 'positioned at a classic large-diaphragm condenser microphone on a boom stand — warm, retro, timeless look' },
  { id: 'usb', label: 'Modern Mikrofon', en: 'positioned at a sleek modern USB studio microphone on a desk stand — clean and professional' },
  { id: 'ring', label: 'Ring Mikrofon', en: 'positioned with a selfie ring-light microphone setup — modern content creator look, soft ring-light halo visible' },
  { id: 'none', label: 'Mikrofonsuz', en: 'no microphone — speaks openly and directly into the camera in an honest documentary style' },
]

// ─── Prompt builders ───────────────────────────────────────────────────────

// How text is physically applied to each surface type
const TEXT_TECHNIQUES: Record<string, string> = {
  wall: `The quote is hand-painted directly onto the plaster wall surface with a wide flat brush — imperfect strokes, paint absorbed unevenly into the textured plaster. Slight bristle marks visible in the letterforms. Micro-drips at the base of two or three letters where paint pooled before drying. The letters have physical presence: subtle raised ridges catch raking light, casting tiny shadows on the wall below each letterform. One corner of a letter slightly bleeds into a crack in the plaster. This was painted here — it is part of the wall's history.`,
  concrete: `The text is spray-painted through a metal stencil onto the raw concrete surface — slight paint bleed under the stencil edges softens letter outlines, the concrete aggregate grain pushes visibly through the thinner parts of each letter. Two places where the stencil lifted early leaving a partial ghost stroke. Settled grime in the letter recesses has darkened them slightly compared to fresh paint around them. Age and city dust cling to the painted surface.`,
  wood: `The text is burned into the wood using pyrography — char lines follow the natural grain direction, letters slightly feathering where the burn spread along grain fibers. Darker, almost black at the thickest stroke centers, warming to amber where the heat barely touched. The burned surface is tactile: you can imagine running a fingertip along the grooved, slightly roughened channels. Surrounding wood is unaffected — the contrast between burned and natural grain is the visual drama.`,
  abstract: `The text is brush-painted into the abstract background while the surrounding paint was still wet — letter edges bleed and feather organically into the surrounding color field, the background color bleeds back into two letter strokes in return. Text and environment are genuinely fused, sharing pigment at their borders. Some letters are denser, some nearly translucent where the brush ran thin. This is not a layer on top — it is woven into the painting itself.`,
  city: `The text exists as faded hand-painted signage on the building wall — outdoor paint cracked and micro-flaking at letter edges, color sun-bleached and desaturated compared to the original dark outline still visible beneath. Layers of city weathering: moisture staining above the tallest letters, soot deposits at the bottom. Been here for years, watched by the street. The city has grown around and past it.`,
  nature: `The text is carved deep into the stone or bark surface — shadow fills the carved channels completely, making letters readable even without paint. Moss begins colonizing some letterforms at their edges, green threading into the grooves. Lichen spotted nearby. The carving looks weathered, as if done seasons or years ago, the stone around it undisturbed and unchanged. Nature has started to reclaim it.`,
}

// One surrealist element per visual style — the "vay be" moment
const SURREAL_ELEMENTS: Record<string, string> = {
  dark: `SURREALIST ELEMENT: Running through the center of one letter, a hairline crack — and from that crack, an impossible thread of warm golden light escapes, as if a completely different, sunlit world exists just centimeters behind the wall. The crack is the only warm light source in an otherwise cold dark frame. Physics is broken in exactly one place.`,
  minimal: `SURREALIST ELEMENT: The text casts a perfect, crisp shadow — but the shadow falls toward the light source, not away from it. Everything else in the image obeys correct physics: shadows, highlights, reflections all accurate. Only the text's shadow defies the world. Subtle enough to require a second look. Unsettling once noticed.`,
  vintage: `SURREALIST ELEMENT: One word in the quote is visibly newer than the rest — the paint there is fresh, still glistening wet, saturated compared to the faded aged letters around it. As if someone returned to this wall just moments ago to add that single word to a quote that has aged for decades. The hand is gone but the brush stroke feels immediate.`,
  grunge: `SURREALIST ELEMENT: One corner of the painted text is literally peeling away from the wall surface like old paint — curling back to reveal the underside of the paint layer. On that revealed underside, visible in mirror writing, the same quote written again in pencil, smaller, like a draft that came before. The public version and the private one, simultaneously visible.`,
  neon: `SURREALIST ELEMENT: In a rain puddle visible at the very bottom of frame, the text's neon reflection shows different words — not the same quote, but its unspoken opposite or complement. Both versions readable simultaneously. The surface world and its reflection carry different truths.`,
}

function buildTextPrompt(s: KState): string {
  const style = STYLES.find(x => x.id === s.style) || STYLES[1]
  const bg = BACKGROUNDS.find(x => x.id === s.background) || BACKGROUNDS[0]
  const fmt = FORMATS.find(x => x.id === s.format) || FORMATS[0]
  const tone = TONES.find(x => x.id === s.tone) || TONES[4]
  const motion = MOTIONS.find(x => x.id === s.motion) || MOTIONS[2]
  const q = s.quote.trim() || '[QUOTE TEXT HERE]'

  const technique = TEXT_TECHNIQUES[s.background] || TEXT_TECHNIQUES.wall
  const surreal = SURREAL_ELEMENTS[s.style] || SURREAL_ELEMENTS.dark

  if (s.outputType === 'image') {
    return `Award-winning fine art photography. Shot on medium format digital. Ultra-sharp. Photorealistic — every surface texture rendered at macro level.

SURFACE & ENVIRONMENT:
${bg.en} ${style.en}.

COLOR PALETTE: ${tone.palette}.
LIGHTING: ${style.lighting}. Raking light chosen to reveal maximum surface texture detail — individual grain, pores, imperfections all visible.

QUOTE TEXT IN THE IMAGE:
"${q}"

TEXT PHYSICAL INTEGRATION — THIS IS THE MOST IMPORTANT INSTRUCTION:
${technique}
CRITICAL: The text is NOT a digital text overlay. It is NOT a font rendered on top of the image. It physically exists on this surface, in this world. The camera is photographing it as part of the real scene. The AI must render text-surface interaction with complete physical fidelity: material absorption, gravity effects, age, texture bleed. If this looks like a font pasted over a background, the image has failed.

${surreal}

COMPOSITION:
- Text occupies the dominant visual zone — large, bold, fills the frame with intention
- Negative space gives letterforms room to breathe
- Camera angle chosen to maximize text-surface physical relationship
- No people, no logos, no watermarks, no UI elements

MICRO-DETAIL REQUIREMENTS (what makes it "vay be"):
- Surface texture at macro photography resolution — individual grain visible
- Text-to-surface interaction shows complete material physics
- Atmospheric micro-details: dust motes in light shafts, moisture where appropriate
- Depth of field: text razor-sharp, distant elements softly de-focused

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | Medium format quality | Ultra-sharp | Photorealistic | No digital post-processing feel | Award-winning composition`
  }

  return `Award-winning cinematography. Atmospheric short-form video. Every frame a still worth printing.

SURFACE & ENVIRONMENT:
${bg.en} ${style.en}.

COLOR PALETTE: ${tone.palette}.
LIGHTING: ${style.lighting}. Light reveals surface texture throughout.

MOTION: ${motion.en}. Camera movement serves the text — never obscures it.

QUOTE TEXT IN THE VIDEO:
"${q}"

TEXT PHYSICAL INTEGRATION — THIS IS THE MOST IMPORTANT INSTRUCTION:
${technique}
CRITICAL: The text physically exists on this surface. It is NOT a digital text overlay animated on top. The camera is filming a real location where this text has been written/burned/carved/painted. Material physics apply throughout all motion.

${surreal}

TEMPORAL REVEAL:
Camera opens already showing partial text — the motion slowly reveals the full quote over 3 seconds. Full text holds readable and dominant for 4 seconds. Environment continues subtle movement in the final second as if the world is still breathing after the words.

MICRO-DETAIL REQUIREMENTS:
- Surface texture at macro level throughout entire clip
- Physical text-surface interaction consistent across all frames
- Atmospheric elements (particles, mist, embers) move through space naturally

TECHNICAL SPECS:
Aspect ratio: ${fmt.ratio} | 8 seconds | Seamlessly loopable | No hard cuts | No voiceover
AUDIO: ${AUDIO_HINTS[s.motion] || 'minimal ambient texture, barely audible — silence preferred'}`
}

// Higgsfield voice prompt
function buildHighgsfieldVoicePrompt(s: KState): string {
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
SPOKEN DIALOGUE (Turkish, read naturally over 7 seconds):
"${q}"

ENDING: After the final word, 1 second of silent direct eye contact with camera — presence without words, powerful natural close.

TONE: Intimate and thoughtful. Spoken-word poetry feel. Not scripted — a genuine quiet moment.
VIDEO SPECS: 10 seconds | 9:16 vertical | Turkish spoken audio | No cuts | Single continuous take`
}

// Grok (Aurora) voice prompt — based on actual video analysis of proven output
function buildGrokVoicePrompt(s: KState): string {
  const hook = VOICE_HOOKS.find(x => x.id === s.voiceHook) || VOICE_HOOKS[0]
  const setting = VOICE_SETTINGS.find(x => x.id === s.voiceSetting) || VOICE_SETTINGS[0]
  const mic = VOICE_MICS.find(x => x.id === s.micType) || VOICE_MICS[0]
  const person = s.gender === 'male' ? 'Young man' : 'Young woman'
  const q = s.quote.trim() || '[QUOTE TEXT HERE]'

  const outdoorSettings = ['street', 'rooftop']
  const isOutdoor = outdoorSettings.includes(s.voiceSetting)

  const lighting = isOutdoor
    ? 'soft natural outdoor daylight with a hint of golden warmth. No studio lights, no ring light. Natural and unforced.'
    : 'warm ambient interior light — soft, intimate, no harsh shadows. Natural and lived-in feel.'

  return `Hyperrealistic cinematic 10-second vertical video. 4K ultra-detailed. Authentic outdoor quote reading.

SUBJECT: ${person} — natural appearance, no commercial gloss. Casual everyday clothing (simple knit sweater or basic tee), long natural hair, minimal or no visible makeup. Real person aesthetic, not a model.

SETTING: ${setting.en}.

HOOK (0–3s):
${hook.en}

SPEAKING SCENE (3–10s):
Person ${mic.en}. Speaks directly and calmly to camera. Lips move naturally with the spoken text. Very subtle, authentic body micro-movement — slight shift of weight, natural breath.

CAMERA: Near-imperceptible handheld micro-tremor — feels found not filmed. During the final 3 seconds, barely drifts 2–3mm closer. Natural, not mechanical.

LIGHTING: ${lighting}

COLOR GRADE: Slightly desaturated, warm cinematic tone, very subtle film grain. Not over-processed.

VOICEOVER LANGUAGE: Turkish
SPOKEN DIALOGUE (Turkish, read aloud naturally):
"${q}"

ENDING: After the last word, 1–2 seconds of silent direct eye contact with the camera. No expression change — just presence. Powerful, unhurried close.

TECHNICAL SPECS:
9:16 vertical | 10 seconds | 4K | Hyperrealistic | Film grain: very subtle | Single continuous take | No cuts

POST-PRODUCTION NOTE: Add the Turkish quote as a text overlay in CapCut, InShot, or similar editing app after generation. Use a clean white or off-white minimal font.`
}

function buildVoicePrompt(s: KState): string {
  return s.voicePlatform === 'grok'
    ? buildGrokVoicePrompt(s)
    : buildHighgsfieldVoicePrompt(s)
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

// ─── Hook Gallery component ────────────────────────────────────────────────

type GalleryFilter = 'all' | 'carpici' | 'yumusak'

function HookGallery({
  onSelect,
}: {
  onSelect: (t: HookTemplate) => void
}) {
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered =
    filter === 'all'
      ? HOOK_TEMPLATES
      : HOOK_TEMPLATES.filter(h => h.type === filter)

  const FILTERS: { id: GalleryFilter; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'carpici', label: 'Çarpıcı' },
    { id: 'yumusak', label: 'Yumuşak' },
  ]

  return (
    <div>
      <p className="text-sm text-gray-400 mb-5">
        İlk saniyede dikkat çeken açılış şablonu. Üzerine gelince önizle, tıkla ve uygula.
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map(hook => (
          <button
            key={hook.id}
            onClick={() => onSelect(hook)}
            onMouseEnter={() => setHovered(hook.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none ${
              hook.accentColor
            } hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40`}
          >
            {/* Thumbnail */}
            <div
              className="relative w-full aspect-[3/4]"
              style={{ background: hook.gradient }}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }} />

              {/* Center emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-5xl transition-all duration-300 ${
                    hovered === hook.id ? 'scale-110 drop-shadow-2xl' : 'scale-100'
                  }`}
                >
                  {hook.emoji}
                </span>
              </div>

              {/* Type badge */}
              <div className="absolute top-2.5 left-2.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    hook.type === 'carpici'
                      ? 'bg-violet-600/90 text-white'
                      : 'bg-emerald-700/90 text-white'
                  }`}
                >
                  {hook.type === 'carpici' ? 'çarpıcı' : 'yumuşak'}
                </span>
              </div>

              {/* Output type badge */}
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-gray-300 backdrop-blur-sm">
                  {hook.outputType === 'voice' ? '🎙 sesli' : hook.outputType === 'video' ? '🎬 video' : '🖼 görsel'}
                </span>
              </div>

              {/* Hover description overlay */}
              <div
                className={`absolute inset-0 flex items-end p-3 transition-opacity duration-200 ${
                  hovered === hook.id ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}
              >
                <p className="text-[11px] text-gray-200 leading-snug">{hook.description}</p>
              </div>
            </div>

            {/* Card footer */}
            <div className="px-3 py-2.5 bg-gray-900">
              <p className="text-sm font-semibold text-white truncate">{hook.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

const KapsamKafe: React.FC<PageProps> = () => {
  const [tab, setTab] = useState<KTab>('builder')
  const [state, setState] = useState<KState>({
    quote: '',
    outputType: 'image',
    style: 'dark',
    background: 'wall',
    motion: 'particles',
    format: 'reels',
    tone: 'moody',
    voicePlatform: 'grok',
    micType: 'handheld',
    voiceSetting: 'street',
    voiceHook: 'eyeopen',
    gender: 'female',
  })

  const set = <K extends keyof KState>(key: K) => (val: KState[K]) =>
    setState(prev => ({ ...prev, [key]: val }))

  const applyHook = (hook: HookTemplate) => {
    setState(prev => ({ ...prev, outputType: hook.outputType, ...hook.settings }))
    setTab('builder')
  }

  const prompt = getPrompt(state)
  const hasQuote = state.quote.trim().length > 0
  const isVoice = state.outputType === 'voice'

  const OUTPUT_TYPES = [
    { id: 'image' as OutputType, label: 'Görsel', icon: <ImageIcon size={16} />, desc: 'Statik fotoğraf' },
    { id: 'video' as OutputType, label: 'Video', icon: <Film size={16} />, desc: 'Atmosferik video' },
    { id: 'voice' as OutputType, label: 'Sesli Okuma', icon: <Mic size={16} />, desc: 'UGC tarzı konuşma' },
  ]

  const promptLabel = isVoice
    ? `Sesli Okuma Prompt (${state.voicePlatform === 'grok' ? 'Grok' : 'Higgsfield'})`
    : state.outputType === 'image' ? 'Görsel Prompt' : 'Video Prompt'

  const promptIcon = isVoice
    ? <Mic size={14} className="text-amber-400" />
    : state.outputType === 'image'
    ? <ImageIcon size={14} className="text-amber-400" />
    : <Film size={14} className="text-amber-400" />

  const voiceTips = state.voicePlatform === 'grok'
    ? ['Yazını gir, platform = Grok seç', 'Promptu kopyala', 'Grok → Aurora Video → yapıştır ve üret', 'Sonra CapCut\'ta Türkçe yazıyı overlay ekle', 'TikTok / Instagram\'a yükle']
    : ['Yazını gir, platform = Higgsfield seç', 'Promptu kopyala', 'Higgsfield → UGC sekmesi → yapıştır', 'Avatar seç ve üret', 'İndir → TikTok / Instagram\'a yükle']

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
          Estetik görsel, video veya sesli okuma — TikTok ve Instagram için hazır prompt.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 p-1 bg-gray-900 rounded-2xl border border-gray-800 mb-8 max-w-sm mx-auto">
        <button
          onClick={() => setTab('builder')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'builder'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          Prompt Üretici
        </button>
        <button
          onClick={() => setTab('gallery')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'gallery'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <LayoutGrid size={14} />
          Hook Galerisi
        </button>
      </div>

      {/* Hook Gallery tab */}
      {tab === 'gallery' && (
        <HookGallery onSelect={applyHook} />
      )}

      {/* Builder tab */}
      {tab === 'builder' && (
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
              {/* Platform selector */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-1">Platform</p>
                <p className="text-xs text-gray-500 mb-3">Grok = Aurora Video · Higgsfield = UGC preset</p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { id: 'grok' as VoicePlatform, label: 'Grok', sub: 'Aurora Video' },
                    { id: 'higgsfield' as VoicePlatform, label: 'Higgsfield', sub: 'UGC Preset' },
                  ]).map(p => (
                    <button
                      key={p.id}
                      onClick={() => set('voicePlatform')(p.id)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                        state.voicePlatform === p.id
                          ? 'border-amber-500 bg-amber-900/20 text-amber-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                      }`}
                    >
                      <span className="font-semibold text-sm">{p.label}</span>
                      <span className="text-[10px] opacity-60">{p.sub}</span>
                    </button>
                  ))}
                </div>

                {state.voicePlatform === 'grok' && (
                  <div className="mt-3 rounded-lg bg-violet-900/20 border border-violet-700/30 px-3 py-2">
                    <p className="text-xs text-violet-300 flex items-center gap-1.5">
                      <Zap size={11} />
                      Grok formatı — gerçek üretilen videodan optimize edildi
                    </p>
                  </div>
                )}
              </div>

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
                <p className="text-sm font-semibold text-white mb-1">Ortam</p>
                <p className="text-xs text-gray-500 mb-3">Sokak = en güçlü sonuç (test edildi)</p>
                <OptionGrid
                  options={VOICE_SETTINGS.map(s => ({ id: s.id, label: s.label }))}
                  selected={state.voiceSetting}
                  onSelect={val => set('voiceSetting')(val)}
                />
              </div>

              {/* Voice Hook */}
              <div className="card p-5">
                <p className="text-sm font-semibold text-white mb-1">Giriş (Hook)</p>
                <p className="text-xs text-gray-500 mb-3">İlk 0–3 saniyenin görsel açılışı · Göz Açılışı = en etkili</p>
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
              className={`text-xs font-mono whitespace-pre-wrap leading-relaxed rounded-xl p-4 border border-gray-800 max-h-[460px] overflow-y-auto ${
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

          {/* Grok specific tip */}
          {isVoice && state.voicePlatform === 'grok' && (
            <div className="rounded-xl border border-violet-700/30 bg-violet-900/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                <Zap size={12} />
                Grok Sonrası Adım
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Grok görsel üretir ama metin overlay eklemez. Videoyu indirdikten sonra <strong className="text-white">CapCut</strong> veya <strong className="text-white">InShot</strong>'a al — Türkçe sözü beyaz minimal fontla ekle. Bu sözü de kopyala:
              </p>
              {hasQuote && (
                <div className="bg-gray-900 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-200 font-medium truncate">"{state.quote}"</span>
                  <CopyBtn text={state.quote} />
                </div>
              )}
            </div>
          )}

          {/* Sesli okuma info */}
          {isVoice && state.voicePlatform === 'higgsfield' && (
            <div className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-4">
              <p className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <Mic size={12} />
                Higgsfield Kullanımı
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Higgsfield → <strong className="text-white">UGC</strong> sekmesi. Avatar seç, promptu yapıştır. Avatar seçtiğin Türkçe sözü doğal şekilde okuyacak.
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
      )}
    </div>
  )
}

export default KapsamKafe
