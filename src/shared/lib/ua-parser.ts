/**
 * Lightweight user-agent parser — pure regex, no dependencies.
 * Extracts device type, browser, and OS from a UA string.
 */

export interface ParsedUA {
  device: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string | null | undefined): ParsedUA {
  if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  return {
    device: detectDevice(ua),
    browser: detectBrowser(ua),
    os: detectOS(ua),
  };
}

// ─── Device ──────────────────────────────────────────────────────────────────

function detectDevice(ua: string): ParsedUA['device'] {
  // Tablets first (iPad, Android tablet without "Mobile", Kindle, Silk)
  if (/iPad|tablet/i.test(ua)) return 'Tablet';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'Tablet';
  if (/Kindle|Silk/i.test(ua)) return 'Tablet';

  // Mobile
  if (/Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini|Opera Mobi/i.test(ua)) {
    return 'Mobile';
  }

  // Everything else → Desktop
  return 'Desktop';
}

// ─── Browser ─────────────────────────────────────────────────────────────────

function detectBrowser(ua: string): string {
  // Order matters — check more specific UA patterns first

  // Samsung Internet
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  // UC Browser
  if (/UCBrowser|UCWEB/i.test(ua)) return 'UC Browser';
  // Opera / Opera GX
  if (/OPR|Opera/i.test(ua)) return 'Opera';
  // Edge (Chromium-based)
  if (/Edg\//i.test(ua)) return 'Edge';
  // Brave (identifies as Chrome but with Brave in UA)
  if (/Brave/i.test(ua)) return 'Brave';
  // Vivaldi
  if (/Vivaldi/i.test(ua)) return 'Vivaldi';
  // Yandex
  if (/YaBrowser/i.test(ua)) return 'Yandex';
  // Firefox
  if (/Firefox|FxiOS/i.test(ua)) return 'Firefox';
  // Chrome (must be after Edge/Opera/Samsung/Brave since they include "Chrome")
  if (/Chrome|CriOS/i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  // Chromium
  if (/Chromium/i.test(ua)) return 'Chromium';
  // Safari (must be after Chrome since Chrome UA includes "Safari")
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  // IE
  if (/MSIE|Trident/i.test(ua)) return 'IE';

  return 'Other';
}

// ─── OS ──────────────────────────────────────────────────────────────────────

function detectOS(ua: string): string {
  // iOS (check before macOS since iPad can spoof macOS UA)
  if (/iPhone|iPod/i.test(ua)) return 'iOS';
  if (/iPad/i.test(ua)) return 'iPadOS';
  // Android
  if (/Android/i.test(ua)) return 'Android';
  // Windows
  if (/Windows NT/i.test(ua)) return 'Windows';
  // Chrome OS
  if (/CrOS/i.test(ua)) return 'Chrome OS';
  // macOS
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  // Linux (after Android & Chrome OS since they also run on Linux kernel)
  if (/Linux/i.test(ua)) return 'Linux';

  return 'Other';
}
