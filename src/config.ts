/**
 * Site-wide configuration. Edit this file when you deploy.
 */
export const SITE = {
  name: 'DevToolbox',
  tagline: 'Free online developer tools',
  description:
    'Fast, free, privacy-friendly developer tools that run entirely in your browser: JSON formatter, Base64, JWT decoder, regex tester, cron parser, hash generator and more.',
  // Set to your production domain (no trailing slash). Used for canonical URLs, sitemap and OG tags.
  url: 'https://devtools.9blog.in',
  author: 'DevToolbox',
  twitter: '@devtoolbox',
  contactEmail: 'hello@devtoolbox.example.com',
  // Google Search Console HTML-tag verification token (content attribute only).
  googleSiteVerification: 'LPXpnqUJDSq5ntAtroq0e03hDfOL3iTk4O_iMeiiamg',
  // Cloudflare Web Analytics beacon token (empty string disables it).
  cloudflareAnalyticsToken: 'c448272b534540d1a3e4f1253fc49b78',
};

/**
 * Ad configuration.
 *
 * Lifecycle:
 *  1. Apply to AdSense → set `adsenseClient`. The AdSense script is then loaded on every
 *     page (needed for site verification and for Auto ads), and public/ads.txt is generated.
 *  2. Approved → create ad units in the AdSense dashboard and paste their IDs into `slots`.
 *     Each slot renders as soon as it has an ID. Slots without an ID render nothing in
 *     production (a labelled placeholder is shown in `pnpm dev` only).
 *  3. Optionally set `autoAds: true` to let Google place additional units automatically.
 */
export const ADS = {
  // e.g. 'ca-pub-1234567890123456' — leave empty until you have applied.
  adsenseClient: '',
  // Let AdSense insert ads automatically in addition to the fixed slots below.
  autoAds: false,
  // Named slots → AdSense ad-unit IDs (the data-ad-slot value, e.g. '1234567890').
  slots: {
    headerBanner: '',
    inToolTop: '',
    inToolBottom: '',
    sidebar: '',
  } as Record<string, string>,
};
