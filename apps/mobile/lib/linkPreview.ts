/**
 * Link preview / metadata fetcher.
 * Extracts title, description and detects platform from a URL.
 */

type Platform = 'instagram' | 'youtube' | 'x' | 'tiktok' | 'reddit' | 'spotify' | 'web';

export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
  platform: Platform;
}

const PLATFORM_MAP: Record<string, Platform> = {
  'instagram.com': 'instagram',
  'www.instagram.com': 'instagram',
  'youtube.com': 'youtube',
  'www.youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'm.youtube.com': 'youtube',
  'twitter.com': 'x',
  'www.twitter.com': 'x',
  'x.com': 'x',
  'www.x.com': 'x',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'vm.tiktok.com': 'tiktok',
  'reddit.com': 'reddit',
  'www.reddit.com': 'reddit',
  'old.reddit.com': 'reddit',
  'open.spotify.com': 'spotify',
  'spotify.com': 'spotify',
};

/**
 * Detect which platform a URL belongs to based on hostname.
 */
export function detectPlatform(url: string): Platform {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return PLATFORM_MAP[hostname] || 'web';
  } catch {
    return 'web';
  }
}

/**
 * Extract a readable title from the URL path.
 * Used as fallback when HTML fetch fails.
 */
function titleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      return decodeURIComponent(last)
        .replace(/[-_]/g, ' ')
        .replace(/\.\w+$/, '')
        .slice(0, 80);
    }
    return u.hostname;
  } catch {
    return url.slice(0, 60);
  }
}

/**
 * Fetch link metadata from a URL.
 * Tries to get OG tags / title from the page HTML.
 */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const platform = detectPlatform(url);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NookMeBot/1.0; +https://nookme.xyz)',
      },
    });
    clearTimeout(timeout);

    const html = await res.text();

    // Extract og:title or <title>
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title =
      ogTitleMatch?.[1] || titleMatch?.[1] || titleFromUrl(url);

    // Extract og:description or meta description
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const description = ogDescMatch?.[1] || descMatch?.[1] || '';

    return {
      url,
      title: title.trim().slice(0, 120),
      description: description.trim().slice(0, 200),
      platform,
    };
  } catch {
    // Network error or timeout -- use URL-based fallback
    return {
      url,
      title: titleFromUrl(url),
      description: '',
      platform,
    };
  }
}
