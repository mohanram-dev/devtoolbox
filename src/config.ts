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
 * Ad configuration. Ads stay as visible placeholders until `enabled` is true,
 * so you can see the layout while the AdSense application is pending.
 */
export const ADS = {
  enabled: false,
  // e.g. 'ca-pub-1234567890123456'
  adsenseClient: '',
  // Named slots → AdSense slot IDs. Create these in the AdSense dashboard.
  slots: {
    headerBanner: '',
    inToolTop: '',
    inToolBottom: '',
    sidebar: '',
  } as Record<string, string>,
};
