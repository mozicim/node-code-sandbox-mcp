import React, { useState } from 'react'
import {
  TrendingUp,
  Copy,
  CheckCheck,
  Zap,
  Clapperboard,
  FileText,
  Bookmark,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { PageProps } from '../types'

type ContentType = 'kapsamkafe' | 'ugc' | 'genel'
type Emotion = 'ilham' | 'nostalji' | 'anlayan' | 'provokasyon' | 'hayranlik'
type Platform = 'tiktok' | 'instagram' | 'both'

interface ViralState {
  brief: string
  quote: string
  contentType: ContentType
  emotion: Emotion
  platform: Platform
}

const CONTENT_TYPES: { id: ContentType; label: string; desc: string }[] = [
  { id: 'kapsamkafe', label: '☕ KapsamKafe', desc: 'Duvar yazısı / alıntı içerikleri' },
  { id: 'ugc', label: '📦 UGC Ürün', desc: 'Ürün tanıtım videoları' },
  { id: 'genel', label: '🌐 Genel İçerik', desc: 'Her türlü içerik' },
]

const EMOTIONS: { id: Emotion; label: string; emoji: string; desc: string }[] = [
  { id: 'ilham', label: 'İlham', emoji: '✨', desc: 'Umut, yeni başlangıç, enerji' },
  { id: 'nostalji', label: 'Nostalji', emoji: '🌅', desc: 'Geçmiş, özlem, sıcaklık' },
  { id: 'anlayan', label: 'Anlayan', emoji: '🤝', desc: 'Empati, "beni anlıyor" hissi' },
  { id: 'provokasyon', label: 'Provokasyon', emoji: '⚡', desc: 'Tartışma, yorum, düşündürme' },
  { id: 'hayranlik', label: 'Hayranlık', emoji: '🎬', desc: 'Estetik, güzellik, wow etkisi' },
]

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'both', label: 'Her İkisi' },
]

function buildVideoPrompt(s: ViralState): string {
  const emotionVisuals: Record<Emotion, string> = {
    ilham: `warm golden hour light, 4K vertical cinematic. Subject: young woman, 20s, casual oversized beige sweater, minimal jewelry, standing by a sunlit window or open rooftop. Eyes start closed, slow exhale, then open to camera with a quiet conviction — as if realizing something for the first time. Micro-tremor in hands and shoulders (barely perceptible, 1-2mm). Camera holds tight on face, slightly drifts closer over 8 seconds. Light crescendos warmly. Final 1-2 seconds: direct eye contact, absolute stillness, slight smile forming. No music cue, let silence carry weight.`,
    nostalji: `vintage warm tones with subtle film grain overlay, 4K vertical. Subject: woman, late 20s, soft cotton turtleneck, natural hair, holding a ceramic mug with both hands. Location: quiet corner of a home, diffused morning light, slightly out-of-focus background objects. Wistful, inward expression — as if mid-memory. Camera barely moves (0.5-1mm drift only). Occasional slow blink. Ends with subject looking slightly down then back to lens — recognition, not performance. Film grain present throughout.`,
    anlayan: `available light only, no setup feel, 4K vertical ultra-casual. Subject: person, 20s-30s, plain oversized tee, hair natural/unstyled, sitting on floor or couch corner. Phone-held feel but ultra sharp. Real micro-tremor throughout (2-3mm). Starts mid-thought — no dramatic intro. Direct, unhurried eye contact, slight nod partway through, gentle pause. Feels like a voice message that someone accidentally left recording. Ends with a quiet exhale and small "yeah" expression.`,
    provokasyon: `high contrast stark lighting, 4K vertical. Subject: confident figure, 25-35, clean dark minimal outfit. Location: plain white or dark wall, no distractions. Camera: completely locked, zero drift, zero tremor — deliberate stillness that demands attention. Expression: composed, unhurried, pauses with intention. Holds eye contact through entire clip without blinking unnecessarily. Ends with raised brow or micro-smirk — punctuation, not punchline.`,
    hayranlik: `cinematic wide opening revealing environment, then slow push to subject, 4K vertical. Subject: person or composition with genuine visual wonder — golden light catching detail, texture visible. Environment: somewhere beautiful or unexpected (rooftop city view, forest path, coastal cliff). Camera: smooth slow reveal, no shake. Subject's eyes wide then settle into quiet awe. Final frame: tight on subject or detail that earned the hayranlık. Soundtrack implied by visual rhythm alone.`,
  }

  const quoteBlock = s.quote
    ? `\n\nTURKISH DIALOGUE TO EMBED IN VIDEO (spoken naturally, not announced):\n"${s.quote}"\n— Delivery: unhurried, conversational, as if thinking aloud.`
    : ''

  const ugcBlock =
    s.contentType === 'ugc' && s.brief
      ? `\n\nPRODUCT CONTEXT: ${s.brief}\nUGC FORMAT: 0-2s visual hook | 2-8s casual Turkish product mention | 8-10s natural CTA.`
      : ''

  return `Hyperrealistic cinematic 10-second vertical video. ${emotionVisuals[s.emotion]}${quoteBlock}${ugcBlock}\n\nSPECS: 9:16 ratio, no subtitles rendered, no artificial studio feel. Authenticity over polish.`
}

function buildCaption(s: ViralState): string {
  const hooks: Record<Emotion, string> = {
    ilham: 'Bu cümleyi oku, sonra bir dakika sessizce otur.',
    nostalji: 'Bunu gören belli bir anı hatırlar.',
    anlayan: 'Peki ya gerçekten iyi misin?',
    provokasyon: 'Katılmıyorsan yorumla, dinliyorum.',
    hayranlik: 'Bu an yakalanabildi çünkü:',
  }

  const bodies: Record<Emotion, string> = {
    ilham:
      s.quote
        ? `"${s.quote}"\n\nBazen bir cümle, uzun zamandır aradığın izni verir.\nKendine bunu hatırlat.`
        : `Bazen bir şey görürsün — ve bir şeylerin yerli yerine oturduğunu hissedersin.\nBu o an.`,
    nostalji:
      s.quote
        ? `"${s.quote}"\n\nBazı şeyler geçmişte kalır ama his gitmez.\nBu da öyle bir his.`
        : `Bazı anlar geçip gitmez — sadece biraz daha uzaklaşır.\nAma hep orada kalır.`,
    anlayan:
      s.quote
        ? `"${s.quote}"\n\nHerkes nasılsın sorusuna "iyiyim" der.\nAma sen gerçekten iyim, değil mi?`
        : `Hepimiz bir şeyleri idare ediyoruz.\nBunu söylemek yeterliydi bazen.`,
    provokasyon:
      s.quote
        ? `"${s.quote}"\n\nBunu duymak istemeyenler olacak.\nAma doğru olan söylenmeli.`
        : `Herkes hemfikir olduğunda kimse büyümez.\nBunu düşün.`,
    hayranlik:
      s.quote
        ? `"${s.quote}"\n\nBazı anlar kamera olmadan da güzeldi.\nAma iyi ki kaydedildi.`
        : `Bu kadar şey varken —\nbu an yeterliydi.`,
  }

  const ctas: Record<Platform, string> = {
    tiktok: '⬇️ Kaydet, gerektiğinde aç.',
    instagram: '🔖 Kaydet — ileride işine yarar.',
    both: '🔖 Kaydet ve ihtiyacın olduğunda aç.',
  }

  return `${hooks[s.emotion]}\n\n${bodies[s.emotion]}\n\n${ctas[s.platform]}`
}

function buildSaveTrigger(s: ViralState): { overlay: string; placement: string; timing: string } {
  const triggers: Record<Emotion, { overlay: string; placement: string; timing: string }> = {
    ilham: {
      overlay: '📌 Bu sözü kaydet',
      placement: 'Ekranın alt ortası — %75 zaman noktasında belir',
      timing: 'Saniye 7-8 arası, fade-in ile gelsin',
    },
    nostalji: {
      overlay: 'Kaydet, gece tekrar aç ↩',
      placement: 'Ekran alt sol — hafif transparan',
      timing: 'Saniye 6-9 arası görünür kalır',
    },
    anlayan: {
      overlay: 'Bu senin için 🤍',
      placement: 'Ekran ortası alt — minimal font',
      timing: 'Saniye 5\'te girer, sona kadar kalır',
    },
    provokasyon: {
      overlay: 'Bunu kim görmeli? ↩',
      placement: 'Ekran üst sağ — bold, dikkat çekici',
      timing: 'Son 3 saniye, baskın gözükür',
    },
    hayranlik: {
      overlay: '↩ İlk saniyeye dön',
      placement: 'Ekran alt ortası',
      timing: 'Saniye 8\'de belirir',
    },
  }
  return triggers[s.emotion]
}

function buildHashtags(s: ViralState): { niche: string[]; medium: string[]; broad: string[] } {
  const maps: Record<ContentType, Record<Platform, { niche: string[]; medium: string[]; broad: string[] }>> = {
    kapsamkafe: {
      tiktok: {
        niche: ['#duvarYazısı', '#türkçeSözler'],
        medium: ['#hayatSözleri', '#sözler'],
        broad: ['#keşfet', '#fyp'],
      },
      instagram: {
        niche: ['#türkçeAlıntı', '#sözKütüphanesi'],
        medium: ['#motivasyonSözleri', '#günlükSözler'],
        broad: ['#keşfetteyiz', '#türkiye'],
      },
      both: {
        niche: ['#duvarYazısı', '#türkçeAlıntı'],
        medium: ['#sözler', '#hayatSözleri'],
        broad: ['#keşfet', '#keşfetteyiz'],
      },
    },
    ugc: {
      tiktok: {
        niche: ['#ürünİnceleme', s.brief ? `#${s.brief.split(' ')[0].toLowerCase()}` : '#yeniÜrün'],
        medium: ['#türkiyeAlışveriş', '#tiktokShop'],
        broad: ['#keşfet', '#fyp'],
      },
      instagram: {
        niche: ['#ürünTanıtım', '#ugcTürkiye'],
        medium: ['#alışveriş', '#önerilenÜrün'],
        broad: ['#keşfetteyiz', '#türkiye'],
      },
      both: {
        niche: ['#ürünİnceleme', '#ugcTürkiye'],
        medium: ['#türkiyeAlışveriş', '#önerilenÜrün'],
        broad: ['#keşfet', '#keşfetteyiz'],
      },
    },
    genel: {
      tiktok: {
        niche: ['#türkçeİçerik', '#türkTiktok'],
        medium: ['#türkiye', '#gündem'],
        broad: ['#keşfet', '#fyp'],
      },
      instagram: {
        niche: ['#türkçeReels', '#türkiyeInstagram'],
        medium: ['#türkiye', '#içerikÜreticisi'],
        broad: ['#keşfetteyiz', '#reels'],
      },
      both: {
        niche: ['#türkçeİçerik', '#türkTiktok'],
        medium: ['#türkiye', '#gündem'],
        broad: ['#keşfet', '#keşfetteyiz'],
      },
    },
  }
  return maps[s.contentType][s.platform]
}

function buildPostingStrategy(s: ViralState): { time: string; reasoning: string; bonus: string } {
  const strategies: Record<Emotion, { time: string; reasoning: string; bonus: string }> = {
    ilham: {
      time: '07:00–09:00 veya 21:00–22:30',
      reasoning:
        'İlham içerikleri sabah rutini başlangıcında ("güne güzel başlamak") veya gece uyumadan önceki yansıma anında zirveye çıkar. Türk kullanıcısı bu saatlerde duygusal açıdan en duyarlı.',
      bonus: 'Salı ve Perşembe günleri bu içerik tipinde en yüksek kaydetme oranları görülür.',
    },
    nostalji: {
      time: '22:00–00:00',
      reasoning:
        'Nostalji içeriği gece geç kaydırma davranışında patlar. Türkiye\'de yatmadan önceki "duygusal scroll" genellikle 22:00 sonrasıdır. Hafıza tetikleyiciler bu saatte en güçlü.',
      bonus: 'Cuma ve Cumartesi geceleri %30\'a kadar daha yüksek erişim.',
    },
    anlayan: {
      time: '21:00–23:30',
      reasoning:
        '"Beni anlayan" içerikler yalnız scroll zamanında rezonans kurar. Günlük işler bittikten, yalnız kalındıktan sonra — bu saatte empati içeriği izlenme süresini 3-4x artırır.',
      bonus: 'Pazar geceleri bu duygu için güçlü performans gösterir.',
    },
    provokasyon: {
      time: '18:00–20:00',
      reasoning:
        'İş/okul sonrası enerji hâlâ yüksek, insanlar tartışmaya açık. Bu saatte provokatif içerik yorum oranını artırır — yorum = algoritma sinyali.',
      bonus: 'Pazartesi ve Salı güçlü — hafta yorgunluğu gelmeden önce.',
    },
    hayranlik: {
      time: '19:00–21:00 veya Cumartesi 10:00–12:00',
      reasoning:
        'Estetik ve hayranlık içerikleri vizüel keşif modunda öne çıkar. Hafta içi akşamı dinlenme başlangıcı ve hafta sonu sabahı en yüksek "wow" etkileşimini getirir.',
      bonus: 'Instagram Reels için Cumartesi sabahı özellikle güçlü.',
    },
  }
  return strategies[s.emotion]
}

function buildFullPackage(s: ViralState): string {
  const video = buildVideoPrompt(s)
  const caption = buildCaption(s)
  const trigger = buildSaveTrigger(s)
  const hashtags = buildHashtags(s)
  const posting = buildPostingStrategy(s)
  const allHashtags = [...hashtags.niche, ...hashtags.medium, ...hashtags.broad].join(' ')

  return `═══════════════════════════════
🎬 VİRAL PAKET
═══════════════════════════════

📹 VIDEO PROMPT
───────────────────────────────
${video}

───────────────────────────────
📝 CAPTION ŞABLONU
───────────────────────────────
${caption}

───────────────────────────────
💾 KAYDET & REWATCH TETİKLEYİCİ
───────────────────────────────
Overlay Metni: ${trigger.overlay}
Yerleşim: ${trigger.placement}
Zamanlama: ${trigger.timing}

───────────────────────────────
#️⃣ HASHTAG PİRAMİDİ
───────────────────────────────
Niş (2): ${hashtags.niche.join(' ')}
Orta (2): ${hashtags.medium.join(' ')}
Geniş (2): ${hashtags.broad.join(' ')}

Tümü: ${allHashtags}

───────────────────────────────
⏰ PAYLAŞIM STRATEJİSİ
───────────────────────────────
Zaman: ${posting.time}
Neden: ${posting.reasoning}
İpucu: ${posting.bonus}

═══════════════════════════════`
}

const SectionCard: React.FC<{
  icon: React.ReactNode
  title: string
  color: string
  children: React.ReactNode
  copyText?: string
  defaultOpen?: boolean
}> = ({ icon, title, color, children, copyText, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!copyText) return
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-lg ${color}`}>{icon}</span>
          <span className="font-semibold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {copyText && open && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy() }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          )}
          {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}

const ViralPaket: React.FC<PageProps> = () => {
  const [state, setState] = useState<ViralState>({
    brief: '',
    quote: '',
    contentType: 'kapsamkafe',
    emotion: 'ilham',
    platform: 'both',
  })
  const [generated, setGenerated] = useState(false)
  const [fullCopied, setFullCopied] = useState(false)

  const update = <K extends keyof ViralState>(k: K, v: ViralState[K]) =>
    setState((prev) => ({ ...prev, [k]: v }))

  const handleGenerate = () => setGenerated(true)

  const handleFullCopy = () => {
    navigator.clipboard.writeText(buildFullPackage(state))
    setFullCopied(true)
    setTimeout(() => setFullCopied(false), 2500)
  }

  const videoPrompt = buildVideoPrompt(state)
  const caption = buildCaption(state)
  const trigger = buildSaveTrigger(state)
  const hashtags = buildHashtags(state)
  const posting = buildPostingStrategy(state)
  const allHashtags = [...hashtags.niche, ...hashtags.medium, ...hashtags.broad].join(' ')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/40">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Viral Paket</h1>
              <p className="text-sm text-gray-400">Keşfet algoritması için tam paket üret</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Input Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">İçerik Tipi</label>
            <div className="grid grid-cols-3 gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => update('contentType', ct.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    state.contentType === ct.id
                      ? 'border-violet-500 bg-violet-900/30 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{ct.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{ct.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Duygusal Hedef</label>
            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map((em) => (
                <button
                  key={em.id}
                  onClick={() => update('emotion', em.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    state.emotion === em.id
                      ? 'border-pink-500 bg-pink-900/30 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{em.emoji}</div>
                  <div className="text-xs font-medium">{em.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Seçili: <span className="text-pink-400">{EMOTIONS.find((e) => e.id === state.emotion)?.desc}</span>
            </p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Platform</label>
            <div className="flex gap-2">
              {PLATFORMS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => update('platform', pl.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    state.platform === pl.id
                      ? 'border-violet-500 bg-violet-900/30 text-violet-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                  }`}
                >
                  {pl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quote / Brief */}
          {state.contentType === 'kapsamkafe' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Türkçe Alıntı / Söz
                <span className="text-gray-500 font-normal ml-2">(opsiyonel — videoya ve caption'a yansır)</span>
              </label>
              <textarea
                value={state.quote}
                onChange={(e) => update('quote', e.target.value)}
                placeholder="Örn: Bazı şeyler söylenmeden de anlaşılır, ama söylenince daha güzel olur."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>
          ) : state.contentType === 'ugc' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ürün / Brief
                <span className="text-gray-500 font-normal ml-2">(ne tanıtıyorsun?)</span>
              </label>
              <textarea
                value={state.brief}
                onChange={(e) => update('brief', e.target.value)}
                placeholder="Örn: Doğal içerikli saç bakım yağı, ısıya karşı koruma, hızlı emilim"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                İçerik Brief
                <span className="text-gray-500 font-normal ml-2">(ne hakkında?)</span>
              </label>
              <textarea
                value={state.brief}
                onChange={(e) => update('brief', e.target.value)}
                placeholder="Örn: İstanbul'da yeni açılan mekan, gece hayatı, arkadaşlık"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Viral Paket Üret
          </button>
        </div>

        {/* Output Sections */}
        {generated && (
          <>
            <div className="space-y-4">
              {/* Video Prompt */}
              <SectionCard
                icon={<Clapperboard size={18} />}
                title="Video Prompt"
                color="text-violet-400"
                copyText={videoPrompt}
              >
                <div className="bg-gray-800/60 rounded-xl p-4 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap border border-gray-700/50">
                  {videoPrompt}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Grok veya Higgsfield'a direkt yapıştır
                </p>
              </SectionCard>

              {/* Caption */}
              <SectionCard
                icon={<FileText size={18} />}
                title="Caption Şablonu"
                color="text-pink-400"
                copyText={caption}
              >
                <div className="bg-gray-800/60 rounded-xl p-4 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap border border-gray-700/50">
                  {caption}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Caption'ın ilk satırı scroll-stopper hook — değiştirme
                </p>
              </SectionCard>

              {/* Save Trigger */}
              <SectionCard
                icon={<Bookmark size={18} />}
                title="Kaydet & Rewatch Tetikleyici"
                color="text-amber-400"
                copyText={`${trigger.overlay}\n${trigger.placement}\n${trigger.timing}`}
              >
                <div className="space-y-3">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-amber-900/40">
                    <div className="text-xs text-amber-400 font-medium mb-1 uppercase tracking-wide">Overlay Metni</div>
                    <div className="text-white font-semibold text-base">{trigger.overlay}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                      <div className="text-xs text-gray-500 mb-1">Yerleşim</div>
                      <div className="text-sm text-gray-300">{trigger.placement}</div>
                    </div>
                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                      <div className="text-xs text-gray-500 mb-1">Zamanlama</div>
                      <div className="text-sm text-gray-300">{trigger.timing}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    CapCut'ta metin katmanı olarak ekle — videonun üstüne bindirmeli kullan
                  </p>
                </div>
              </SectionCard>

              {/* Hashtags */}
              <SectionCard
                icon={<Hash size={18} />}
                title="Hashtag Piramidi"
                color="text-cyan-400"
                copyText={allHashtags}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Niş (2)</div>
                      <div className="space-y-1">
                        {hashtags.niche.map((h) => (
                          <div key={h} className="text-xs text-cyan-400 font-mono">{h}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Orta (2)</div>
                      <div className="space-y-1">
                        {hashtags.medium.map((h) => (
                          <div key={h} className="text-xs text-violet-400 font-mono">{h}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Geniş (2)</div>
                      <div className="space-y-1">
                        {hashtags.broad.map((h) => (
                          <div key={h} className="text-xs text-pink-400 font-mono">{h}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-1">Tümü (kopyala & yapıştır)</div>
                    <div className="text-xs text-gray-300 font-mono">{allHashtags}</div>
                  </div>
                  <p className="text-xs text-gray-500">
                    6 hashtag = optimize sayı. Niş hashtaglar keşfet'e düşmeyi kolaylaştırır
                  </p>
                </div>
              </SectionCard>

              {/* Posting Strategy */}
              <SectionCard
                icon={<Clock size={18} />}
                title="Paylaşım Stratejisi"
                color="text-green-400"
                copyText={`${posting.time}\n${posting.reasoning}\n${posting.bonus}`}
              >
                <div className="space-y-3">
                  <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-4">
                    <div className="text-xs text-green-400 font-medium uppercase tracking-wide mb-1">Optimal Zaman</div>
                    <div className="text-white font-bold text-lg">{posting.time}</div>
                  </div>
                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-2">Neden bu saat?</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{posting.reasoning}</p>
                  </div>
                  <div className="bg-violet-900/20 border border-violet-800/40 rounded-xl p-3">
                    <div className="text-xs text-violet-400 font-medium mb-1">Bonus İpucu</div>
                    <p className="text-sm text-gray-300">{posting.bonus}</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Full Copy Button */}
            <div className="flex justify-center pt-2 pb-6">
              <button
                onClick={handleFullCopy}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                  fullCopied
                    ? 'bg-green-600 text-white shadow-green-900/30'
                    : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-violet-900/30'
                }`}
              >
                {fullCopied ? (
                  <>
                    <CheckCheck size={16} />
                    Tüm Paket Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Tüm Paketi Kopyala
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Empty state hint */}
        {!generated && (
          <div className="text-center py-12 text-gray-600">
            <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">İçerik tipi, duygu ve platformu seç — viral paketi üret</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViralPaket
