import { z } from 'zod';
import { type McpResponse, textContent } from '../types.ts';

// Turkey WOEID for X/Twitter trends API
const TURKEY_WOEID = 23424969;

export const argSchema = {
  platform: z
    .enum(['x', 'instagram', 'tiktok', 'all'])
    .describe('Trend takibi yapılacak platform: "x", "instagram", "tiktok" veya "all" (hepsi)'),
  count: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .default(10)
    .describe('Her platform için döndürülecek trend sayısı (varsayılan: 10, max: 50)'),
};

async function fetchXTrends(count: number): Promise<string> {
  const token = process.env.X_BEARER_TOKEN;

  if (!token) {
    return [
      '🐦 X/Twitter — ❌ X_BEARER_TOKEN ayarlanmamış',
      'Kurulum adımları:',
      '  1. https://developer.twitter.com adresine git',
      '  2. Uygulama oluştur → Bearer Token al',
      '  3. export X_BEARER_TOKEN="token_buraya"',
    ].join('\n');
  }

  const response = await fetch(
    `https://api.twitter.com/1.1/trends/place.json?id=${TURKEY_WOEID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    return `🐦 X/Twitter — ❌ API hatası: ${response.status} ${response.statusText}`;
  }

  const data = (await response.json()) as {
    as_of: string;
    trends: { name: string; tweet_volume: number | null }[];
  }[];

  const trends = data[0]?.trends?.slice(0, count) ?? [];
  const asOf = data[0]?.as_of
    ? new Date(data[0].as_of).toLocaleString('tr-TR')
    : 'bilinmiyor';

  const list = trends
    .map((t, i) => {
      const vol = t.tweet_volume
        ? ` — ${t.tweet_volume.toLocaleString('tr-TR')} tweet`
        : '';
      return `  ${i + 1}. ${t.name}${vol}`;
    })
    .join('\n');

  return `🐦 X/Twitter Türkiye Trendleri (${asOf}):\n${list}`;
}

async function fetchTikTokTrends(count: number): Promise<string> {
  // TikTok Creative Center public hashtag trends API
  try {
    const url = new URL(
      'https://ads.tiktok.com/creative_radar_api/v1/popular_trend/hashtag/list'
    );
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', String(Math.min(count, 50)));
    url.searchParams.set('period', '7');
    url.searchParams.set('country_code', 'TR');
    url.searchParams.set('sort_by', 'popular');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer:
          'https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/tr',
        'Accept-Language': 'tr-TR,tr;q=0.9',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as {
        code: number;
        data: { list: { hashtag_name: string; publish_cnt: number }[] };
      };

      const hashtags = data?.data?.list ?? [];
      if (hashtags.length > 0) {
        const list = hashtags
          .slice(0, count)
          .map((h, i) => {
            const videos = h.publish_cnt
              ? ` — ${(h.publish_cnt / 1e6).toFixed(1)}M video`
              : '';
            return `  ${i + 1}. #${h.hashtag_name}${videos}`;
          })
          .join('\n');
        return `🎵 TikTok Türkiye Trend Hashtag'ler (son 7 gün):\n${list}`;
      }
    }
  } catch {
    // Creative Center API başarısız, aşağıya düşer
  }

  // Yedek: RapidAPI TikTok
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (rapidKey) {
    try {
      const response = await fetch(
        'https://tiktok-api23.p.rapidapi.com/api/trending/feed?region=TR',
        {
          headers: {
            'x-rapidapi-key': rapidKey,
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
          },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as {
          itemList?: { desc: string; stats: { playCount: number } }[];
        };
        const items = data?.itemList ?? [];
        const list = items
          .slice(0, count)
          .map((item, i) => {
            const plays = item.stats?.playCount
              ? ` — ${(item.stats.playCount / 1e6).toFixed(1)}M oynatma`
              : '';
            const desc = item.desc?.substring(0, 60) || 'İsimsiz';
            return `  ${i + 1}. ${desc}${plays}`;
          })
          .join('\n');
        return `🎵 TikTok Türkiye Trendleri:\n${list}`;
      }
    } catch {
      // RapidAPI de başarısız
    }
  }

  return [
    '🎵 TikTok — ❌ Veri alınamadı',
    'Seçenekler:',
    '  • RAPIDAPI_KEY ortam değişkeni ayarlayarak RapidAPI kullan',
    '    (https://rapidapi.com/search/tiktok)',
    '  • TikTok Creative Center: https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/tr',
  ].join('\n');
}

async function fetchInstagramTrends(count: number): Promise<string> {
  const sessionId = process.env.INSTAGRAM_SESSION_ID;

  if (!sessionId) {
    return [
      '📷 Instagram — ❌ INSTAGRAM_SESSION_ID ayarlanmamış',
      'Kurulum adımları:',
      '  1. Instagram.com\'a tarayıcıdan giriş yap',
      '  2. Geliştirici Araçları → Application → Cookies → instagram.com',
      '  3. "sessionid" değerini kopyala',
      '  4. export INSTAGRAM_SESSION_ID="session_id_buraya"',
    ].join('\n');
  }

  try {
    // Instagram Explore trending hashtags
    const response = await fetch(
      'https://www.instagram.com/api/v1/discover/topical_explore/?is_prefetch=false&omit_cover_media=false&reels_configuration=allowed_and_eager&timezone_offset=10800&count=30&tab_index=0',
      {
        headers: {
          Cookie: `sessionid=${sessionId}; ds_user_id=0`,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'X-IG-App-ID': '936619743392459',
          'X-ASBD-ID': '129477',
          Accept: '*/*',
          'Accept-Language': 'tr-TR,tr;q=0.9',
        },
      }
    );

    if (!response.ok) {
      return `📷 Instagram — ❌ API hatası: ${response.status}. Session geçersiz ya da süresi dolmuş olabilir.`;
    }

    const data = (await response.json()) as {
      sectional_items?: {
        layout_content?: {
          medias?: { media?: { caption?: { text?: string } } }[];
        };
      }[];
    };

    const sections = data?.sectional_items ?? [];
    const tagCount: Record<string, number> = {};

    for (const section of sections) {
      const medias = section?.layout_content?.medias ?? [];
      for (const item of medias) {
        const caption = item?.media?.caption?.text ?? '';
        const tags = caption.match(/#[\wÀ-ÿğüşöçıĞÜŞÖÇİ]+/g) ?? [];
        for (const tag of tags) {
          tagCount[tag] = (tagCount[tag] ?? 0) + 1;
        }
      }
    }

    const sortedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count);

    if (sortedTags.length === 0) {
      return '📷 Instagram — ⚠️ Trend hashtag bulunamadı. Explore sayfası boş döndü.';
    }

    const list = sortedTags
      .map(([tag, cnt], i) => `  ${i + 1}. ${tag} (${cnt} gönderi)`)
      .join('\n');

    return `📷 Instagram Türkiye Trend Hashtag'ler:\n${list}`;
  } catch (error) {
    return `📷 Instagram — ❌ Hata: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export default async function getTurkeyTrends({
  platform,
  count = 10,
}: {
  platform: 'x' | 'instagram' | 'tiktok' | 'all';
  count?: number;
}): Promise<McpResponse> {
  const parts: string[] = [];

  if (platform === 'x' || platform === 'all') {
    parts.push(await fetchXTrends(count));
  }

  if (platform === 'tiktok' || platform === 'all') {
    parts.push(await fetchTikTokTrends(count));
  }

  if (platform === 'instagram' || platform === 'all') {
    parts.push(await fetchInstagramTrends(count));
  }

  const divider = '\n\n' + '─'.repeat(50) + '\n\n';
  return {
    content: [textContent(parts.join(divider))],
  };
}
