/**
 * Central tool registry. Every entry becomes a statically generated page at /tools/<slug>.
 * The copy here (description, howTo, faq) is what search engines index — keep it
 * specific and useful, not generic filler.
 */
export type Category = 'Formatters' | 'Encoders' | 'Generators' | 'Converters' | 'Testing';

export interface Faq {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  /** Short tagline shown on cards and under the heading. */
  tagline: string;
  /** Meta description (aim for 120–155 chars). */
  description: string;
  category: Category;
  keywords: string[];
  /** Ordered steps rendered as "How to use". */
  howTo: string[];
  /** A few paragraphs of genuinely useful context. */
  about: string[];
  faq: Faq[];
  related: string[];
}

export const CATEGORIES: { name: Category; blurb: string }[] = [
  { name: 'Formatters', blurb: 'Pretty-print, minify and validate structured data.' },
  { name: 'Encoders', blurb: 'Encode, decode and inspect tokens and strings.' },
  { name: 'Generators', blurb: 'Generate IDs, hashes, passwords and placeholder data.' },
  { name: 'Converters', blurb: 'Convert between formats, units and representations.' },
  { name: 'Testing', blurb: 'Test patterns, expressions and compare text.' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    tagline: 'Beautify, minify and validate JSON with instant error reporting.',
    description:
      'Free online JSON formatter and validator. Pretty-print or minify JSON, find syntax errors with their exact position, and copy the result. Runs 100% in your browser.',
    category: 'Formatters',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minify', 'pretty print json', 'json lint'],
    howTo: [
      'Paste or type your JSON into the input box.',
      'Choose an indent size (2 or 4 spaces, or tabs) and click Format — or click Minify to strip whitespace.',
      'If the JSON is invalid, the error message tells you the exact position of the problem.',
      'Click Copy to copy the formatted output to your clipboard.',
    ],
    about: [
      'JSON (JavaScript Object Notation) is the most common data format for APIs and configuration files. Minified JSON is compact but hard to read; this formatter re-indents it so nested objects and arrays are easy to scan.',
      'The validator uses the same strict parser browsers use (JSON.parse), so anything that passes here will be accepted by every standards-compliant JSON library. Common mistakes it catches include trailing commas, single-quoted strings, unquoted keys and comments — none of which are allowed in JSON.',
      'Your data never leaves your device. Formatting happens in your browser with no server round-trip, which makes it safe for API responses containing tokens or personal data.',
    ],
    faq: [
      { q: 'Is my JSON uploaded anywhere?', a: 'No. Everything runs locally in your browser using JavaScript; nothing is sent to a server.' },
      { q: 'Why does it say "Unexpected token" for my JSON?', a: 'Usually a trailing comma, a single-quoted string, an unquoted key, or a comment. JSON is stricter than JavaScript object literals.' },
      { q: 'Does it support large files?', a: 'Yes — files of several megabytes format in well under a second on a modern machine, limited only by your browser memory.' },
      { q: 'Can it sort keys alphabetically?', a: 'Yes, enable "Sort keys" before formatting to produce a canonical, diff-friendly output.' },
    ],
    related: ['base64-encode-decode', 'jwt-decoder', 'text-diff', 'url-encode-decode'],
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    tagline: 'Convert text to Base64 and back, with full Unicode and URL-safe support.',
    description:
      'Encode text to Base64 or decode Base64 to text online. Supports UTF-8 Unicode and URL-safe Base64. Fast, free, and runs entirely in your browser.',
    category: 'Encoders',
    keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'base64 online', 'base64 to text', 'url safe base64'],
    howTo: [
      'Select Encode or Decode.',
      'Paste your text (or Base64 string) into the input.',
      'Toggle "URL-safe" if you need the RFC 4648 §5 variant (uses - and _ instead of + and /).',
      'The result appears instantly; click Copy to grab it.',
    ],
    about: [
      'Base64 represents binary data as ASCII text using 64 characters (A–Z, a–z, 0–9, + and /). It is used everywhere from email attachments (MIME) to data: URLs, JWTs and basic HTTP authentication headers.',
      'Naive browser implementations (btoa/atob) choke on non-ASCII characters such as emoji or accented letters. This tool encodes text as UTF-8 bytes first, so any Unicode string round-trips correctly.',
      'The URL-safe variant replaces + with - and / with _ and typically drops the = padding, which makes the output safe to embed in URLs and filenames without percent-encoding.',
    ],
    faq: [
      { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption — anyone can decode it. Never use it to hide secrets.' },
      { q: 'Why is the Base64 output longer than my text?', a: 'Base64 uses 4 characters to represent every 3 bytes, so the output is roughly 33% larger than the input.' },
      { q: 'What does the = at the end mean?', a: 'Padding. It makes the output length a multiple of 4. URL-safe Base64 often omits it.' },
    ],
    related: ['url-encode-decode', 'jwt-decoder', 'hash-generator', 'json-formatter'],
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    tagline: 'Percent-encode strings for URLs or decode them back to readable text.',
    description:
      'Free URL encoder and decoder. Percent-encode query strings and path segments (encodeURIComponent) or decode %20 and other escapes back to plain text instantly.',
    category: 'Encoders',
    keywords: ['url encode', 'url decode', 'percent encoding', 'encodeuricomponent', 'url encoder online', 'decode url'],
    howTo: [
      'Choose Encode or Decode.',
      'Paste the text or URL into the input box.',
      'Pick the encoding mode: Component (encodes everything except unreserved characters) or Full URL (leaves :/?#& intact).',
      'Copy the result.',
    ],
    about: [
      'URLs can only contain a limited set of ASCII characters. Percent-encoding replaces every other byte with a % followed by two hex digits — so a space becomes %20 and an ampersand becomes %26.',
      'Component mode (encodeURIComponent) is what you want when inserting a value into a query string. Full URL mode (encodeURI) is for cleaning up an entire URL while preserving its structure.',
      'Decoding also handles + as a space, which is how HTML forms (application/x-www-form-urlencoded) encode spaces.',
    ],
    faq: [
      { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURIComponent encodes reserved characters like /, ?, & and = too. Use it for individual query parameter values. encodeURI leaves those intact so the URL stays valid.' },
      { q: 'Why did decoding fail with "URI malformed"?', a: 'A % sign not followed by two valid hex digits. Check for a literal % that should have been encoded as %25.' },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'case-converter'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    tagline: 'Decode and inspect JSON Web Tokens — header, payload and expiry at a glance.',
    description:
      'Decode JWT tokens online. View the header, payload claims and signature, and check expiry (exp/iat/nbf) in human-readable time. Client-side only — your token is never sent anywhere.',
    category: 'Encoders',
    keywords: ['jwt decoder', 'decode jwt', 'jwt debugger', 'jwt viewer', 'json web token decode', 'jwt.io alternative'],
    howTo: [
      'Paste a JWT (three Base64URL parts separated by dots) into the input.',
      'The header and payload are decoded and pretty-printed instantly.',
      'Timestamp claims (exp, iat, nbf) are converted to local dates, and you see whether the token is expired.',
    ],
    about: [
      'A JSON Web Token has three parts: a header describing the algorithm, a payload of claims, and a signature. The first two are just Base64URL-encoded JSON — which is why anyone holding a token can read its contents.',
      'This decoder is useful when debugging authentication: confirm which user a token belongs to, which scopes it carries, and whether it has expired. It does not verify the signature, because doing so would require your secret or public key.',
      'Because tokens often grant access to real accounts, this tool runs entirely in your browser. Nothing is logged or transmitted.',
    ],
    faq: [
      { q: 'Does this verify the JWT signature?', a: 'No. Decoding only reads the header and payload. Signature verification needs the signing secret or public key and should happen on your server.' },
      { q: 'Is it safe to paste production tokens here?', a: 'The token never leaves your browser, but treat any token as a credential: revoke it if you are unsure.' },
      { q: 'Why is my token "invalid"?', a: 'A JWT must have exactly three dot-separated Base64URL segments. Check for whitespace, a "Bearer " prefix, or a truncated copy.' },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'timestamp-converter', 'hash-generator'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    tagline: 'Test regular expressions live with match highlighting and capture groups.',
    description:
      'Online regex tester for JavaScript regular expressions. See matches highlighted in real time, inspect capture groups, and toggle flags (g, i, m, s, u). Free and private.',
    category: 'Testing',
    keywords: ['regex tester', 'regular expression tester', 'regex online', 'javascript regex', 'regex101 alternative', 'test regex'],
    howTo: [
      'Enter your pattern (without the surrounding slashes) and choose flags.',
      'Paste the test text below. Matches are highlighted as you type.',
      'Check the match list to see each match, its index, and named/numbered capture groups.',
    ],
    about: [
      'Regular expressions are a compact language for matching text. This tester uses the JavaScript RegExp engine, so results are identical to what you will get in Node.js, browsers and most modern tooling.',
      'Flags change behaviour: g finds all matches instead of the first; i ignores case; m makes ^ and $ match at line boundaries; s lets . match newlines; u enables full Unicode.',
      'Named groups — (?<year>\\d{4}) — make patterns self-documenting and are shown by name in the match table.',
    ],
    faq: [
      { q: 'Which regex flavour is this?', a: 'JavaScript (ECMAScript). Most syntax is shared with PCRE, but lookbehind, named groups and Unicode property escapes require a modern engine.' },
      { q: 'Why does my pattern only match once?', a: 'Enable the g (global) flag to find every match.' },
      { q: 'Why does the page freeze on some patterns?', a: 'Catastrophic backtracking — nested quantifiers like (a+)+ can take exponential time. Simplify the pattern or use atomic constructs.' },
    ],
    related: ['text-diff', 'case-converter', 'json-formatter'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    tagline: 'Generate random v4 UUIDs in bulk, with your choice of formatting.',
    description:
      'Generate UUID v4 (GUID) values online — one or hundreds at once. Options for uppercase, no hyphens and braces. Cryptographically random, generated in your browser.',
    category: 'Generators',
    keywords: ['uuid generator', 'guid generator', 'generate uuid', 'uuid v4', 'random uuid', 'bulk uuid generator'],
    howTo: [
      'Choose how many UUIDs you need (1–1000).',
      'Pick formatting options: uppercase, remove hyphens, or wrap in braces.',
      'Click Generate, then Copy all.',
    ],
    about: [
      'A UUID (universally unique identifier, also called GUID on Windows) is a 128-bit value written as 32 hexadecimal digits in the form 8-4-4-4-12. Version 4 UUIDs are generated from random numbers, and the chance of two colliding is negligible for any practical purpose.',
      "This generator uses the browser's crypto.randomUUID() API, which draws from a cryptographically secure random source — suitable for database keys, correlation IDs and API keys.",
    ],
    faq: [
      { q: 'What is the difference between UUID and GUID?', a: "None in practice. GUID is Microsoft's name for the same 128-bit format." },
      { q: 'Are these UUIDs truly unique?', a: 'With 122 random bits, you would need to generate billions per second for decades before a collision becomes likely.' },
      { q: 'Can you generate v1 or v7 UUIDs?', a: 'Currently only v4. Time-ordered v7 support is planned.' },
    ],
    related: ['password-generator', 'hash-generator', 'timestamp-converter'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator (MD5, SHA-1, SHA-256, SHA-512)',
    tagline: 'Compute MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text.',
    description:
      'Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes online. Hash any text instantly and copy the hex digest. Computed locally in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: ['sha256 generator', 'md5 hash generator', 'sha1 hash', 'sha512 online', 'hash calculator', 'checksum generator'],
    howTo: [
      'Type or paste the text you want to hash.',
      'All supported digests are computed at once as you type.',
      'Click Copy next to the algorithm you need.',
    ],
    about: [
      'A cryptographic hash turns input of any length into a fixed-size fingerprint. The same input always yields the same hash, and even a one-character change produces a completely different result. Hashes are used for checksums, content addressing, deduplication and password storage.',
      'MD5 and SHA-1 are fast but broken for security purposes — collisions can be manufactured — so use them only for non-adversarial checksums. SHA-256 and SHA-512 (the SHA-2 family) remain secure and are the default choice for new systems.',
      'SHA hashes are computed with the Web Crypto API; MD5 uses a small pure-JavaScript implementation since browsers do not ship it natively.',
    ],
    faq: [
      { q: 'Can I reverse a hash to get the original text?', a: 'No. Hashes are one-way functions. "Reversing" only works by guessing inputs (rainbow tables), which is why passwords should be salted and hashed with a slow algorithm like bcrypt or Argon2.' },
      { q: 'Is the text hashed as UTF-8?', a: 'Yes. The input is encoded as UTF-8 bytes before hashing, matching the behaviour of most command-line tools.' },
      { q: 'Does a trailing newline change the hash?', a: 'Yes — echo "text" | sha256sum includes a newline; echo -n does not. This tool hashes exactly what you type.' },
    ],
    related: ['base64-encode-decode', 'uuid-generator', 'password-generator', 'jwt-decoder'],
  },
  {
    slug: 'cron-parser',
    name: 'Cron Expression Parser',
    tagline: 'Translate cron schedules into plain English and preview the next run times.',
    description:
      'Cron expression parser and explainer. Paste any crontab schedule to see a human-readable description and the next 10 execution times. Supports 5-field and 6-field cron.',
    category: 'Converters',
    keywords: ['cron parser', 'cron expression', 'crontab generator', 'cron schedule explained', 'cron next run', 'crontab guru alternative'],
    howTo: [
      'Enter a cron expression such as */15 * * * * (five fields: minute, hour, day of month, month, day of week).',
      'Read the plain-English description and the list of upcoming run times in your local timezone.',
      'Use the quick presets to start from common schedules.',
    ],
    about: [
      'Cron is the standard scheduler on Unix-like systems, and its syntax is reused by Kubernetes CronJobs, GitHub Actions, AWS EventBridge and most CI tools. The five fields are minute (0–59), hour (0–23), day of month (1–31), month (1–12) and day of week (0–6, Sunday = 0).',
      'Special characters: * means every value, */n means every nth value, a-b is a range and a,b,c is a list. Some systems (Quartz, Spring) add a leading seconds field; this tool handles both forms.',
      "The next-run preview uses your browser's local timezone; production servers often run in UTC, so double-check where your job actually executes.",
    ],
    faq: [
      { q: 'What does */5 * * * * mean?', a: '"Every 5 minutes" — at minute 0, 5, 10, … of every hour.' },
      { q: 'How do I run a job at midnight every Monday?', a: '0 0 * * 1 — minute 0, hour 0, any day of month, any month, weekday 1 (Monday).' },
      { q: 'Is day-of-week 7 the same as 0?', a: 'On most implementations yes — both mean Sunday — but it is safest to use 0.' },
    ],
    related: ['timestamp-converter', 'regex-tester', 'uuid-generator'],
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    tagline: 'Convert Unix epoch timestamps to human dates and back.',
    description:
      'Convert Unix timestamps (seconds or milliseconds) to readable dates and ISO 8601, or turn a date into an epoch value. Shows current epoch time live. Free online tool.',
    category: 'Converters',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp', 'epoch time', 'unix time'],
    howTo: [
      'Paste a timestamp (seconds or milliseconds are detected automatically) to see the date in UTC, your local timezone and ISO 8601.',
      'Or pick a date and time to get the corresponding epoch value.',
      'The live clock at the top shows the current Unix time; click Copy to grab it.',
    ],
    about: [
      'Unix time counts the number of seconds since 00:00:00 UTC on 1 January 1970, ignoring leap seconds. It is the lingua franca of timestamps in databases, logs, JWT claims and APIs because it is timezone-independent and easy to compare.',
      'JavaScript and Java use milliseconds rather than seconds, so a 13-digit number is almost always a millisecond timestamp and a 10-digit number is seconds. This tool detects which you pasted.',
      'The year-2038 problem: 32-bit signed integers overflow on 19 January 2038. Modern systems use 64-bit values, but legacy embedded systems and some file formats are still affected.',
    ],
    faq: [
      { q: 'Is Unix time affected by timezones?', a: 'No. The epoch value is the same everywhere; only its human-readable rendering depends on the timezone.' },
      { q: 'How do I get the current timestamp in JavaScript?', a: 'Date.now() returns milliseconds; Math.floor(Date.now() / 1000) gives seconds.' },
    ],
    related: ['cron-parser', 'jwt-decoder', 'uuid-generator'],
  },
  {
    slug: 'color-converter',
    name: 'Color Converter (HEX, RGB, HSL)',
    tagline: 'Convert colors between HEX, RGB and HSL with a live preview and contrast check.',
    description:
      'Convert HEX to RGB, RGB to HSL and back. Live color preview, CSS-ready output and a WCAG contrast checker against black and white. Free online color converter.',
    category: 'Converters',
    keywords: ['hex to rgb', 'rgb to hex', 'color converter', 'hsl to hex', 'css color converter', 'color picker online'],
    howTo: [
      'Enter a color in any format: #1e90ff, rgb(30, 144, 255) or hsl(210, 100%, 56%).',
      'All other formats update instantly, together with a preview swatch.',
      'Copy the CSS value you need, and check the contrast ratio for accessible text.',
    ],
    about: [
      'HEX and RGB describe the same thing — how much red, green and blue light to mix — while HSL (hue, saturation, lightness) is closer to how people think about color, which makes it handy for generating tints and shades in CSS.',
      'The contrast checker computes the WCAG 2 contrast ratio against black and white text. Aim for at least 4.5:1 for normal text and 3:1 for large text to meet AA.',
    ],
    faq: [
      { q: 'What is the alpha channel?', a: 'Opacity. 8-digit hex (#RRGGBBAA), rgba() and hsla() add a fourth value from 0 (transparent) to 1 or FF (opaque).' },
      { q: 'Can I convert to OKLCH?', a: 'Not yet — support for modern CSS color spaces is planned.' },
    ],
    related: ['case-converter', 'json-formatter', 'password-generator'],
  },
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    tagline: 'Compare two texts and highlight every added, removed or changed line.',
    description:
      'Compare two blocks of text or code online and see the differences highlighted line by line. Free diff checker that runs in your browser — nothing is uploaded.',
    category: 'Testing',
    keywords: ['diff checker', 'text compare', 'compare two texts', 'online diff tool', 'code diff', 'text difference'],
    howTo: [
      'Paste the original text on the left and the modified text on the right.',
      'Click Compare. Added lines are green, removed lines are red.',
      'Toggle "Ignore whitespace" or switch to word-level diff for prose.',
    ],
    about: [
      'A diff shows the minimal set of changes needed to turn one text into another. This tool uses the same Myers algorithm as git, so the output matches what you would see in a pull request.',
      'Line mode is best for code and config files. Word mode is better for documents and copy, where a single edited sentence would otherwise mark the whole paragraph as changed.',
    ],
    faq: [
      { q: 'Is there a size limit?', a: 'Files of a few thousand lines compare instantly. Very large inputs may take a couple of seconds.' },
      { q: 'Does it store my text?', a: 'No. Comparison runs in your browser and nothing is saved or transmitted.' },
    ],
    related: ['json-formatter', 'regex-tester', 'case-converter'],
  },
  {
    slug: 'case-converter',
    name: 'Case Converter & Slugify',
    tagline: 'Convert text to camelCase, snake_case, kebab-case, Title Case, slugs and more.',
    description:
      'Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, sentence case and URL slugs. Instant, free, browser-based.',
    category: 'Converters',
    keywords: ['case converter', 'camelcase converter', 'snake case to camel case', 'kebab case', 'slugify', 'title case converter'],
    howTo: [
      'Paste your text — a sentence, a variable name, or a whole list, one item per line.',
      'Every case variant is shown below, updated as you type.',
      'Click Copy on the one you need.',
    ],
    about: [
      'Different languages and tools expect different naming conventions: camelCase for JavaScript variables, PascalCase for classes, snake_case in Python and SQL, kebab-case for CSS and URLs, CONSTANT_CASE for environment variables.',
      'The converter first splits the input into words (handling existing camelCase boundaries, underscores, hyphens and spaces) and then reassembles them, so you can convert directly between any two styles.',
      'Slugify additionally strips accents and punctuation, producing clean lowercase-hyphenated strings suitable for URLs.',
    ],
    faq: [
      { q: 'How are acronyms handled?', a: 'Sequences of capitals such as "HTTPServer" are split as "HTTP Server", following the convention used by most linters.' },
      { q: 'Does it work on multiple lines?', a: 'Yes — each line is converted independently, which is handy for renaming a list of identifiers.' },
    ],
    related: ['url-encode-decode', 'text-diff', 'regex-tester'],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    tagline: 'Create strong random passwords with the exact length and character set you need.',
    description:
      'Generate strong, random passwords online. Choose length, include symbols, numbers and mixed case, exclude ambiguous characters. Cryptographically secure and never sent to a server.',
    category: 'Generators',
    keywords: ['password generator', 'strong password generator', 'random password', 'secure password generator', 'generate password online'],
    howTo: [
      'Set the length (8–128 characters).',
      'Choose which character classes to include and whether to avoid look-alike characters such as O/0 and l/1.',
      'Click Generate, check the strength estimate, then Copy.',
    ],
    about: [
      'Password strength is mostly about length and unpredictability. A 16-character password drawn from letters, numbers and symbols has roughly 100 bits of entropy — far beyond what any brute-force attack can crack.',
      "This generator uses crypto.getRandomValues(), the browser's cryptographically secure random source, with rejection sampling to avoid modulo bias. Passwords are generated on your device and never transmitted.",
      'Use a password manager to store the result; reusing even a strong password across sites defeats its purpose.',
    ],
    faq: [
      { q: 'How long should a password be?', a: 'At least 12 characters for everyday accounts, 16+ for anything important. Length matters more than complexity rules.' },
      { q: 'Are the generated passwords stored anywhere?', a: 'No. They exist only in your browser tab until you close or refresh it.' },
    ],
    related: ['uuid-generator', 'hash-generator', 'base64-encode-decode'],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolsInCategory = (c: Category) => TOOLS.filter((t) => t.category === c);
