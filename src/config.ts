/**
 * Site-wide configuration. Edit this file when you deploy.
 */
export const SITE = {
  name: '9Blog Tools',
  tagline: 'Free developer & AI tools, right in your browser',
  description:
    'Fast, free, privacy-friendly developer tools that run entirely in your browser: JSON formatter, Base64, JWT decoder, regex tester, cron parser, hash generator and more.',
  // Set to your production domain (no trailing slash). Used for canonical URLs, sitemap and OG tags.
  url: 'https://9blog.in',
  author: '9Blog',
  twitter: '',
  contactEmail: '',
  // Google Search Console HTML-tag verification token (content attribute only).
  googleSiteVerification: 'LPXpnqUJDSq5ntAtroq0e03hDfOL3iTk4O_iMeiiamg',
  // Cloudflare Web Analytics beacon token (empty string disables it).
  cloudflareAnalyticsToken: '',
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

/** Links back into the WordPress blog (root of the same domain). */
export const BLOG = {
  home: 'https://9blog.in/',
  about: 'https://9blog.in/about-us/',
  contact: 'https://9blog.in/contact-us/',
  privacy: 'https://9blog.in/privacy-policy/',
  terms: 'https://9blog.in/terms-and-disclaimer/',
};

/** "Support this site" links shown in the footer of every tools page. */
export const SUPPORT = {
  sponsors: 'https://github.com/sponsors/mohanram-dev',
  repo: 'https://github.com/mohanram-dev/devtoolbox',
};
