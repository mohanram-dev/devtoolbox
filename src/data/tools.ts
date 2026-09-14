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
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV / CSV to JSON',
    tagline: 'Convert between JSON arrays and CSV spreadsheets in either direction.',
    description:
      'Convert JSON to CSV or CSV to JSON online. Handles quoted fields, custom delimiters and nested values. Paste data, copy the result — runs in your browser.',
    category: 'Converters',
    keywords: ['json to csv', 'csv to json', 'json csv converter', 'convert csv to json online', 'json array to csv', 'csv to json array'],
    howTo: [
      'Choose the direction: CSV → JSON or JSON → CSV.',
      'Paste your data. For CSV, the first row is treated as the column headers. For JSON, paste an array of objects.',
      'Pick a delimiter if your file uses semicolons, tabs or pipes instead of commas.',
      'Copy the converted output.',
    ],
    about: [
      'CSV is the universal spreadsheet exchange format; JSON is what APIs and JavaScript speak. Moving data between them is one of the most common chores in data work — exporting an API response to Excel, or importing a spreadsheet into a script.',
      'The parser follows RFC 4180: fields containing commas, quotes or line breaks are wrapped in double quotes, and embedded quotes are doubled. Many quick converters get this wrong and corrupt names like "Smith, John".',
      'When converting JSON to CSV, the column headers are the union of every key found across all objects, so ragged data still produces a valid table. Nested objects and arrays are serialised as JSON strings inside the cell.',
    ],
    faq: [
      { q: 'Are numbers and booleans preserved?', a: 'CSV has no types — everything becomes a string. When converting CSV → JSON, values stay as strings so no data is misinterpreted; cast them in your code if needed.' },
      { q: 'How do I convert an Excel file?', a: 'In Excel or Google Sheets, use File → Download → CSV, then paste the CSV here.' },
      { q: 'Is there a size limit?', a: 'Tens of thousands of rows convert in under a second. Very large files are limited only by your browser memory.' },
    ],
    related: ['json-formatter', 'yaml-to-json', 'text-diff', 'case-converter'],
  },
  {
    slug: 'yaml-to-json',
    name: 'YAML to JSON / JSON to YAML',
    tagline: 'Convert YAML config files to JSON and back, with validation.',
    description:
      'Convert YAML to JSON or JSON to YAML online. Validates syntax, preserves nesting and types, and shows errors with line numbers. Free, private, browser-based.',
    category: 'Converters',
    keywords: ['yaml to json', 'json to yaml', 'yaml converter', 'yaml validator', 'convert yaml online', 'yml to json'],
    howTo: [
      'Choose YAML → JSON or JSON → YAML.',
      'Paste your document. Errors (bad indentation, unclosed quotes) are reported with the line number.',
      'Copy the converted result.',
    ],
    about: [
      'YAML is the configuration language of Kubernetes, Docker Compose, GitHub Actions and CI systems; JSON is what those tools ultimately consume. Converting between them lets you validate a config, feed it to an API, or reformat a JSON payload into something readable.',
      'This converter uses the YAML 1.2 specification, so it handles anchors, multi-line strings, comments (dropped on conversion) and the tricky cases — like the string "no" that YAML 1.1 would silently turn into false.',
      'Output YAML uses two-space indentation with no line wrapping, matching the style most linters expect.',
    ],
    faq: [
      { q: 'Why did my comments disappear?', a: 'JSON has no comment syntax, so comments cannot survive a YAML → JSON conversion.' },
      { q: 'Does it support multiple documents (---)?', a: 'Only the first document is converted. Split multi-document files before pasting.' },
      { q: 'Are tabs allowed in YAML?', a: 'No — YAML requires spaces for indentation. The validator will flag tabs.' },
    ],
    related: ['json-formatter', 'json-to-csv', 'base64-encode-decode'],
  },
  {
    slug: 'markdown-preview',
    name: 'Markdown Preview & Editor',
    tagline: 'Write Markdown and see the rendered result live, or grab the HTML.',
    description:
      'Free online Markdown editor with live preview. Supports GitHub-flavoured Markdown: tables, task lists, code blocks and strikethrough. Copy the generated HTML.',
    category: 'Formatters',
    keywords: ['markdown preview', 'markdown editor online', 'markdown to html', 'md preview', 'github markdown preview', 'markdown viewer'],
    howTo: [
      'Type or paste Markdown on the left; the rendered preview updates as you type.',
      'Switch to the HTML tab to see the generated markup.',
      'Click Copy HTML to use it in a page or CMS.',
    ],
    about: [
      'Markdown is the lightweight markup used in README files, GitHub issues, documentation sites and note-taking apps. Because every renderer differs slightly, a live preview is the quickest way to check that tables, nested lists and code fences look the way you intend.',
      'This editor follows GitHub-flavoured Markdown (GFM), which adds tables, task lists, strikethrough and automatic links to the original CommonMark spec.',
      'Rendering happens in your browser. Script tags and inline event handlers are stripped from the output as a precaution.',
    ],
    faq: [
      { q: 'Which Markdown flavour is this?', a: 'GitHub-flavoured Markdown (GFM), the most widely used dialect.' },
      { q: 'Can I export to PDF?', a: 'Use your browser: switch to Preview, then Print → Save as PDF.' },
      { q: 'Does it save my document?', a: 'No — nothing leaves your tab. Copy the text before closing.' },
    ],
    related: ['html-entities', 'json-formatter', 'text-diff'],
  },
  {
    slug: 'html-entities',
    name: 'HTML Entity Encoder / Decoder',
    tagline: 'Escape special characters for HTML, or decode &amp; &lt; &#39; back to text.',
    description:
      'Encode text to HTML entities (&amp;, &lt;, &quot;, &copy;) or decode entities back to plain text. Safe for displaying code and user input on web pages. Free online tool.',
    category: 'Encoders',
    keywords: ['html entity encoder', 'html entities decoder', 'html escape', 'html unescape', 'encode html special characters', 'decode html entities'],
    howTo: [
      'Choose Encode or Decode.',
      'Paste your text. Encoding escapes &, <, >, quotes and common symbols; enable "Encode all non-ASCII" to convert every accented or Unicode character to a numeric entity.',
      'Copy the result.',
    ],
    about: [
      'Characters like < and & have special meaning in HTML. To display them literally — for example, when showing a code sample — they must be written as entities: &lt; and &amp;. Forgetting to escape user input is also the root cause of cross-site scripting (XSS) bugs.',
      'Named entities (&copy;, &mdash;) are readable; numeric entities (&#169;, &#8212;) work for any Unicode character. Both are decoded identically by browsers.',
      "Decoding uses the browser's own HTML parser, so every one of the 2,000+ named entities is recognised, not just a hand-picked list.",
    ],
    faq: [
      { q: 'Should I encode every character on my page?', a: "No. Modern pages are UTF-8, so only &, <, >, \" and ' need escaping. Encode everything only for legacy ASCII-only systems." },
      { q: 'What is the difference between &#39; and &apos;?', a: 'Both mean an apostrophe. &#39; works in every browser; &apos; is XML/HTML5 only.' },
    ],
    related: ['url-encode-decode', 'base64-encode-decode', 'markdown-preview'],
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    tagline: 'Generate placeholder paragraphs, sentences or words for mockups.',
    description:
      'Generate Lorem Ipsum placeholder text online — choose paragraphs, sentences or word count, optionally wrapped in <p> tags. Instant, free, no sign-up.',
    category: 'Generators',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text generator', 'lorem ipsum paragraphs', 'filler text', 'lipsum'],
    howTo: [
      'Choose how much text you need and whether to count paragraphs, sentences or words.',
      'Toggle "Wrap in <p>" for HTML-ready output, or turn off the classic opening line for fully random text.',
      'Click Copy.',
    ],
    about: [
      'Lorem Ipsum is scrambled Latin derived from a passage by Cicero, used since the 1500s as filler so that layouts can be judged without the distraction of meaningful content. Its letter distribution resembles English, which is why it still looks natural in a design.',
      'Designers use it to test typography and spacing; developers use it to fill templates and seed test databases. The generator produces varied sentence lengths so the result looks like real prose rather than a repeated block.',
    ],
    faq: [
      { q: 'Does the text mean anything?', a: 'No. It is intentionally nonsensical so that reviewers focus on the design rather than the words.' },
      { q: 'Can I get a specific number of characters?', a: 'Generate by words and adjust the count — the character total is shown under the output.' },
    ],
    related: ['password-generator', 'uuid-generator', 'markdown-preview'],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    tagline: 'Create QR codes for URLs, text or Wi-Fi and download as PNG or SVG.',
    description:
      'Free QR code generator. Turn any URL or text into a QR code, pick size, colours and error-correction level, and download as PNG or SVG. No watermark, no sign-up.',
    category: 'Generators',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code', 'qr code svg', 'url to qr code'],
    howTo: [
      'Paste the URL or text you want to encode.',
      'Adjust the size, colours and error-correction level; the preview updates live.',
      'Download as PNG (for print or slides) or SVG (scales to any size).',
    ],
    about: [
      'A QR code stores text in a grid of black and white modules that phone cameras can read instantly. URLs are the most common payload, but any text works — including Wi-Fi credentials (WIFI:T:WPA;S:name;P:password;;), contact cards (vCard) and plain messages.',
      'Error correction lets the code remain scannable even when part of it is damaged or covered: L tolerates 7% loss, H tolerates 30%. Higher levels make the code denser, so use L or M for long URLs and H if you plan to overlay a logo.',
      'Codes are generated in your browser and never sent to a server, so the link stays private and there is no tracking redirect — unlike many "free" QR services that route scans through their own domain.',
    ],
    faq: [
      { q: 'Do these QR codes expire?', a: 'No. The data is encoded directly in the image, so it works forever without depending on this site.' },
      { q: 'PNG or SVG?', a: 'SVG for print and anything that will be resized; PNG for quick sharing, slides and chat apps.' },
      { q: "Why won't my code scan?", a: 'Make sure there is contrast between foreground and background, keep the quiet zone (margin) intact, and avoid very long text at small sizes.' },
    ],
    related: ['url-encode-decode', 'image-to-base64', 'uuid-generator'],
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64 Converter',
    tagline: 'Turn images into Base64 data URLs for CSS and HTML, or decode Base64 back to an image.',
    description:
      'Convert an image to a Base64 data URL for inline use in HTML, CSS or JSON — or decode a Base64 string back to an image. Drag and drop, up to 10 MB, never uploaded.',
    category: 'Encoders',
    keywords: ['image to base64', 'base64 to image', 'png to base64', 'base64 image encoder', 'data url generator', 'convert image to base64 online'],
    howTo: [
      'Drop an image onto the box or click to pick one.',
      'Copy the data URL, or the ready-made CSS background-image / HTML img snippet.',
      'To go the other way, switch to Base64 → Image, paste the string and download the preview.',
    ],
    about: [
      'A data URL embeds a file directly in a page: data:image/png;base64,iVBOR… Browsers render it like any image, with no extra HTTP request. That makes it useful for small icons, email templates, single-file HTML reports and quick prototypes.',
      'The trade-off is size — Base64 is about 33% larger than the binary file and cannot be cached separately. It is a good fit for images under a few kilobytes and a poor fit for photos.',
      'Encoding uses the FileReader API in your browser; the image is never uploaded, so this is safe for private screenshots and unreleased assets.',
    ],
    faq: [
      { q: 'What formats are supported?', a: 'Anything your browser can open: PNG, JPEG, GIF, WebP, SVG, BMP, AVIF.' },
      { q: 'Does converting reduce image quality?', a: 'No. Base64 is a lossless re-encoding of the exact same bytes.' },
      { q: 'How do I use the result in CSS?', a: 'Copy the CSS row — it gives you a complete background-image: url("data:…") declaration.' },
    ],
    related: ['base64-encode-decode', 'qr-code-generator', 'color-converter'],
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript Interfaces',
    tagline: 'Generate TypeScript interfaces from any JSON payload, nested types included.',
    description:
      'Convert JSON to TypeScript interfaces online. Infers nested objects, arrays, unions and optional properties from sample data. Paste an API response, copy the types.',
    category: 'Converters',
    keywords: ['json to typescript', 'json to ts interface', 'generate typescript types from json', 'json to interface', 'typescript type generator', 'quicktype alternative'],
    howTo: [
      'Paste a JSON object or array — for example an API response.',
      'Optionally rename the root interface.',
      'Copy the generated interfaces into your project.',
    ],
    about: [
      'Hand-writing types for a large API response is tedious and error-prone. This tool infers them from real data: every nested object becomes its own interface, arrays of objects are merged so keys that appear only sometimes are marked optional, and mixed values become union types.',
      'Interface names are derived from the property names (users → User, orderItems → OrderItem), so the output reads naturally and rarely needs renaming.',
      'Because inference works from one sample, a null value is typed as null and an empty array as unknown[]. Paste a representative response — or several merged into an array — for the most accurate result.',
    ],
    faq: [
      { q: 'Why is a property typed as null?', a: 'The sample only contained null for it. Include a record with a real value and the tool will produce string | null (or similar).' },
      { q: 'Can I generate a type instead of an interface?', a: 'Interfaces are generated for objects; for arrays and primitives at the root, a type alias is emitted. Search-and-replace "interface" with "type ... =" if you prefer.' },
      { q: 'Does it support JSON Schema?', a: 'No — this tool works from sample data. For schemas, use the JSON Schema Validator tool.' },
    ],
    related: ['json-formatter', 'json-schema-validator', 'json-to-csv', 'yaml-to-json'],
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    tagline: 'Beautify SQL queries for MySQL, PostgreSQL, SQL Server, Oracle and more.',
    description:
      'Format and beautify SQL online. Supports MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, BigQuery and Snowflake, with keyword casing and indent options. Minify too.',
    category: 'Formatters',
    keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print', 'mysql formatter', 'postgresql formatter'],
    howTo: [
      'Paste your query.',
      'Pick the dialect so vendor-specific syntax is understood, then choose keyword casing and indent size.',
      'Copy the formatted SQL — or click Minify to collapse it onto one line for logs and URLs.',
    ],
    about: [
      'Long queries written on one line, or generated by an ORM, are almost impossible to review. A formatter puts each clause on its own line, indents subqueries and aligns joins so the logic becomes visible.',
      'SQL dialects differ in small but important ways — backtick quoting in MySQL, bracket quoting in SQL Server, :: casts in PostgreSQL. Selecting the right dialect ensures those constructs are parsed correctly rather than mangled.',
      'Uppercase keywords are the most common convention in shared codebases; lowercase is popular in PostgreSQL circles. Either way, consistent casing makes keywords stand out from identifiers.',
    ],
    faq: [
      { q: 'Does formatting change what the query does?', a: 'No. Only whitespace and keyword casing change; identifiers, strings and logic are untouched.' },
      { q: 'Which dialect should I choose if unsure?', a: 'Standard SQL handles most queries. Switch dialect only if you see a parsing error.' },
      { q: 'Is my query sent anywhere?', a: 'No — formatting runs in your browser, so it is safe to paste queries containing table names or data.' },
    ],
    related: ['json-formatter', 'code-beautifier', 'text-diff'],
  },
  {
    slug: 'code-beautifier',
    name: 'HTML, CSS & JavaScript Beautifier / Minifier',
    tagline: 'Format messy HTML, CSS or JavaScript, or strip it down to a minified version.',
    description:
      'Beautify or minify HTML, CSS and JavaScript online. Re-indent minified code for readability, or remove comments and whitespace to shrink files. Free and browser-based.',
    category: 'Formatters',
    keywords: ['html beautifier', 'css minifier', 'javascript beautifier', 'html formatter', 'css beautifier', 'js minifier online', 'unminify'],
    howTo: [
      'Pick the language: HTML, CSS or JavaScript.',
      'Choose Beautify to re-indent, or Minify to strip comments and whitespace.',
      'Paste your code and copy the result.',
    ],
    about: [
      'Minified production code is unreadable by design. Beautifying it restores indentation and line breaks so you can inspect a third-party script, debug a stylesheet from a live site, or clean up generated HTML.',
      'Minifying does the reverse for small assets you hand-maintain — inline styles, email templates, snippets pasted into a CMS — where a build step would be overkill.',
      'The JavaScript minifier is deliberately conservative: it removes comments and indentation but never renames variables or rewrites expressions, so the output always behaves identically to the input. For production bundles, use esbuild or terser.',
    ],
    faq: [
      { q: 'Does the beautifier fix syntax errors?', a: 'No. It reformats whatever you give it; invalid code stays invalid, just easier to read.' },
      { q: 'Why is the JS minifier output bigger than terser\u2019s?', a: 'Because it only removes whitespace and comments. Safe by design — it cannot break your code.' },
      { q: 'Can it format JSX or TypeScript?', a: 'Plain JavaScript works best. JSX and TypeScript syntax may be indented imperfectly.' },
    ],
    related: ['sql-formatter', 'json-formatter', 'html-entities', 'markdown-preview'],
  },
  {
    slug: 'chmod-calculator',
    name: 'Chmod Calculator',
    tagline: 'Build Linux file permissions visually and get the octal and symbolic chmod commands.',
    description:
      'Chmod permissions calculator. Tick read/write/execute for owner, group and others to get the octal value (755, 644…), symbolic notation and the exact chmod command.',
    category: 'Converters',
    keywords: ['chmod calculator', 'linux permissions calculator', 'chmod 755', 'chmod 644', 'file permissions calculator', 'octal permissions', 'unix permissions'],
    howTo: [
      'Tick the read, write and execute boxes for Owner, Group and Others.',
      'Or type an octal value like 755 into the box to see what it means.',
      'Copy the chmod command. Enable setuid, setgid or sticky bit if you need a four-digit mode.',
    ],
    about: [
      'Every file on Linux, macOS and Unix has three permission sets — owner, group and everyone else — each with read (4), write (2) and execute (1). Adding the numbers gives one octal digit per set: rwx = 7, r-x = 5, r-- = 4. That is why 755 means "owner can do everything, others can read and execute".',
      'Execute on a directory means "can enter it", so directories usually need 755 or 750 where files need 644 or 640. Secrets such as private keys should be 600 — SSH refuses keys that are readable by others.',
      'The special bits — setuid, setgid and sticky — appear as a fourth leading digit. setgid on a shared directory makes new files inherit its group; the sticky bit on /tmp stops users deleting each other\u2019s files.',
    ],
    faq: [
      { q: 'What does chmod 777 do?', a: 'Grants every permission to everyone. It is almost never the right fix — it hides ownership problems and is a security risk on servers.' },
      { q: 'What is the difference between 755 and 644?', a: '755 adds execute for everyone; use it for directories and scripts. 644 is for ordinary files that should not be executable.' },
      { q: 'How do I apply permissions recursively?', a: 'chmod -R 755 directory/ — but be careful: it sets execute on every file too. Use find with -type f / -type d to treat files and directories differently.' },
    ],
    related: ['subnet-calculator', 'cron-parser', 'hash-generator'],
  },
  {
    slug: 'subnet-calculator',
    name: 'IP Subnet / CIDR Calculator',
    tagline: 'Work out network address, broadcast, host range and mask for any IPv4 CIDR.',
    description:
      'IPv4 subnet calculator. Enter an IP with CIDR prefix or netmask to get the network, broadcast, first/last host, usable host count, wildcard mask and binary breakdown.',
    category: 'Converters',
    keywords: ['subnet calculator', 'cidr calculator', 'ip calculator', 'netmask calculator', 'ipv4 subnet', 'cidr to netmask', 'subnet mask calculator'],
    howTo: [
      'Enter an address with a prefix, e.g. 10.0.0.0/8 or 192.168.1.10/24 — or with a netmask, e.g. 192.168.1.10 255.255.255.0.',
      'Read off the network, broadcast, host range and mask.',
      'Click any prefix in the reference table to see how the same address divides at that size.',
    ],
    about: [
      'CIDR notation writes a network as address/prefix, where the prefix is the number of leading bits that identify the network. A /24 has 24 network bits and 8 host bits, so 256 addresses; a /16 has 65,536. Every extra prefix bit halves the block.',
      'Two addresses in each block are reserved: the lowest is the network address and the highest is broadcast, which is why a /24 has 254 usable hosts. The exceptions are /31 (point-to-point links, both addresses usable) and /32 (a single host).',
      'The calculator also flags whether an address is private (10/8, 172.16/12, 192.168/16), loopback, link-local or public — handy when checking cloud VPC ranges or firewall rules.',
    ],
    faq: [
      { q: 'How many hosts are in a /24?', a: '256 addresses, 254 usable (network and broadcast are reserved).' },
      { q: 'What is a wildcard mask?', a: 'The inverse of the netmask, used by Cisco ACLs: 0.0.0.255 for a /24.' },
      { q: 'Does it support IPv6?', a: 'Not yet — IPv4 only for now.' },
    ],
    related: ['chmod-calculator', 'timestamp-converter', 'hash-generator'],
  },
  {
    slug: 'json-schema-validator',
    name: 'JSON Schema Validator',
    tagline: 'Validate JSON data against a JSON Schema and see every error with its path.',
    description:
      'Validate JSON against a JSON Schema online (draft-07 and 2019-09/2020-12 keywords). Lists every violation with its JSON path and reason. Runs entirely in your browser.',
    category: 'Testing',
    keywords: ['json schema validator', 'validate json schema', 'json schema online', 'json validator schema', 'ajv online', 'json schema checker'],
    howTo: [
      'Paste your JSON Schema on the left and the data to check on the right.',
      'Validation runs as you type. Every failed rule is listed with the path of the offending value.',
      'Fix the data (or the schema) until the green "Valid" banner appears.',
    ],
    about: [
      'JSON Schema is the standard way to describe the shape of JSON: which properties are required, their types, allowed values, string formats and numeric ranges. APIs publish schemas so clients can validate requests before sending them, and config files use them for editor autocomplete.',
      'This validator uses Ajv, the same engine behind most JavaScript tooling, with allErrors enabled so you see every problem at once rather than just the first.',
      'Common string formats — email, uri, date, date-time, uuid — are supported. Custom formats in your schema are ignored rather than causing an error.',
    ],
    faq: [
      { q: 'Which JSON Schema draft is supported?', a: 'Draft-07 fully, plus the common keywords from 2019-09 and 2020-12. Very new keywords may be ignored.' },
      { q: 'What does "must NOT have additional properties" mean?', a: 'The schema sets additionalProperties: false, and the data contains a key the schema does not list.' },
      { q: 'Can I generate a schema from JSON?', a: 'Not here yet. Use the JSON to TypeScript tool if you need types rather than a schema.' },
    ],
    related: ['json-formatter', 'json-to-typescript', 'yaml-to-json', 'regex-tester'],
  },
  {
    slug: 'unicode-escape',
    name: 'Unicode Escape / Unescape',
    tagline: 'Convert text to \\uXXXX, &#x…; or CSS escapes and back, with a code-point table.',
    description:
      'Escape Unicode characters to \\uXXXX (JavaScript, Python, Java), CSS or HTML numeric entities, or decode escapes back to text. Shows code points and UTF-8 bytes for each character.',
    category: 'Encoders',
    keywords: ['unicode escape', 'unicode unescape', 'unicode to ascii', 'unicode converter', '\\u escape', 'unicode code point', 'utf-8 bytes'],
    howTo: [
      'Choose Escape or Unescape.',
      'For escaping, pick the target syntax (JavaScript, Python, Java, CSS or HTML) and whether to escape plain ASCII too.',
      'Paste text and copy the result. The table below shows each character\u2019s code point and UTF-8 bytes.',
    ],
    about: [
      'Escape sequences let you write any Unicode character using only ASCII — useful in source files that must stay ASCII-safe, in JSON that will pass through legacy systems, or when a character is invisible and you need to see exactly what it is.',
      'Languages differ: JavaScript and Python use \\u00e9 and add \\u{1F680} / \\U0001F680 for characters beyond the Basic Multilingual Plane; Java and C# use UTF-16 surrogate pairs; CSS uses \\e9 with a trailing space; HTML uses &#xE9;.',
      'The code-point table is a quick way to debug "weird" characters — non-breaking spaces, zero-width joiners, look-alike letters — by showing the exact code point and byte sequence.',
    ],
    faq: [
      { q: 'What is the difference between \\u and \\x?', a: '\\xHH covers only the first 256 code points; \\uHHHH covers the Basic Multilingual Plane; \\u{…} or \\UHHHHHHHH covers everything, including emoji.' },
      { q: 'Why does an emoji become two \\u escapes in Java style?', a: 'Java and C# strings are UTF-16, so characters above U+FFFF are stored as a surrogate pair — two 16-bit units.' },
    ],
    related: ['html-entities', 'url-encode-decode', 'base64-encode-decode'],
  },
  {
    slug: 'number-base-converter',
    name: 'Number Base Converter (Binary, Hex, Octal, Decimal)',
    tagline: 'Convert numbers between binary, octal, decimal, hexadecimal and base 36.',
    description:
      'Convert between binary, decimal, hexadecimal and octal online. Arbitrary-precision, accepts 0x/0b prefixes, shows bit count and grouped output. Free and instant.',
    category: 'Converters',
    keywords: ['binary to decimal', 'hex to decimal', 'decimal to binary', 'decimal to hex', 'hex to binary', 'number base converter', 'octal converter'],
    howTo: [
      'Type a number and pick which base it is in — or use a prefix (0x for hex, 0b for binary, 0o for octal) and it is detected automatically.',
      'Read the value in every other base below. Binary and hex are grouped in fours for readability.',
      'Click Copy on the row you need.',
    ],
    about: [
      'Programmers meet four bases constantly: binary for bit flags and masks, hexadecimal for colours, memory addresses and hashes, octal for Unix permissions, and decimal for everything else. Converting between them by hand is slow and error-prone above a few digits.',
      'This converter uses arbitrary-precision integers, so 64-bit values, 256-bit hashes and anything larger convert exactly — there is no rounding at 2^53 the way ordinary JavaScript numbers do.',
      'The bit-count row tells you how many bits are needed to store the number, which is useful when sizing integer columns or packing flags.',
    ],
    faq: [
      { q: 'How do I convert a negative number?', a: 'Prefix it with a minus sign. Output uses sign-magnitude form; two\u2019s complement depends on a fixed bit width and is not shown.' },
      { q: 'Why are the binary digits grouped in fours?', a: 'Each group of four bits corresponds to exactly one hex digit, which makes the two easy to read side by side.' },
      { q: 'What is base 36?', a: 'Digits 0-9 plus letters a-z. It is used for short IDs and URL slugs because it packs the most information into alphanumeric characters.' },
    ],
    related: ['color-converter', 'unicode-escape', 'hash-generator', 'subnet-calculator'],
  },
  {
    slug: 'word-counter',
    name: 'Word & Character Counter',
    tagline: 'Count words, characters, sentences and paragraphs with reading time and keyword density.',
    description:
      'Free online word counter. Counts words, characters (with and without spaces), sentences, paragraphs, reading and speaking time, plus top keywords. Checks tweet and meta-description limits.',
    category: 'Testing',
    keywords: ['word counter', 'character counter', 'word count online', 'letter counter', 'count characters', 'reading time calculator', 'sentence counter'],
    howTo: [
      'Paste or type your text. Counts update as you type.',
      'Check the limits panel for tweet (280) and meta-description (155) character budgets.',
      'Use the keyword panel to spot over-used words.',
    ],
    about: [
      'Word and character limits are everywhere: essays, tweets, meta descriptions, ad headlines, App Store copy. This counter shows every common metric at once so you can hit a target without counting by hand.',
      'Reading time assumes 225 words per minute, the average for adults reading English on screen; speaking time uses 150 words per minute, typical for presentations and voice-over.',
      'Characters are counted as Unicode code points, so an emoji counts as one character — the same way Twitter/X and most modern platforms count.',
    ],
    faq: [
      { q: 'Does it count hyphenated words as one?', a: 'Yes. "well-known" is one word, matching Microsoft Word and Google Docs.' },
      { q: 'Are numbers counted as words?', a: 'Yes — "2026" counts as a word, again matching mainstream word processors.' },
      { q: 'Is my text stored?', a: 'No. Counting happens in your browser; nothing is transmitted or saved.' },
    ],
    related: ['case-converter', 'line-sorter', 'lorem-ipsum', 'text-diff'],
  },
  {
    slug: 'url-parser',
    name: 'URL Parser & Query String Splitter',
    tagline: 'Break a URL into scheme, host, path, port, hash and a decoded table of query parameters.',
    description:
      'Parse any URL online into its components — protocol, subdomain, domain, port, path segments, hash — and see every query-string parameter decoded in a table. Copy params as JSON.',
    category: 'Testing',
    keywords: ['url parser', 'parse url', 'query string parser', 'url decoder', 'url components', 'split url', 'query parameters'],
    howTo: [
      'Paste a full URL including the scheme (https://).',
      'Each component is listed with its own copy button; the query string is expanded into a key/value table with values already decoded.',
      'Click Copy as JSON to grab the parameters as an object.',
    ],
    about: [
      'A URL packs a lot into one line: scheme, credentials, host, port, path, query and fragment. When a link misbehaves — a tracking parameter lost, an encoded slash, the wrong port — pulling it apart is the fastest way to see what is actually being sent.',
      'The parser uses the browser\u2019s WHATWG URL implementation, so its interpretation matches what Chrome, Firefox and Node.js will do with the same string, including normalisation of the host and default ports.',
      'Repeated parameters (tag=a&tag=b) are listed separately, and values are percent-decoded so you can read UTF-8 text and spaces directly.',
    ],
    faq: [
      { q: 'Why does it say the URL is invalid?', a: 'The scheme is probably missing. Relative URLs and bare domains (example.com/page) are not absolute URLs — add https://.' },
      { q: 'What is the difference between host and domain?', a: 'Host is the full hostname (www.blog.example.com); domain is the registrable part (example.com); subdomain is what precedes it.' },
    ],
    related: ['url-encode-decode', 'json-formatter', 'base64-encode-decode', 'meta-tag-generator'],
  },
  {
    slug: 'http-status-codes',
    name: 'HTTP Status Codes Reference',
    tagline: 'Every HTTP status code with a plain-English explanation — searchable, filterable by class.',
    description:
      'Complete list of HTTP status codes (1xx–5xx) with clear explanations of what each means and when it is used: 200, 301 vs 302, 401 vs 403, 404, 429, 500, 502, 503 and more.',
    category: 'Testing',
    keywords: ['http status codes', 'http response codes', 'status code list', '401 vs 403', '301 vs 302', '502 bad gateway meaning', 'http error codes'],
    howTo: [
      'Type a code or a word (e.g. "redirect", "timeout") into the search box.',
      'Or filter by class — 2xx success, 3xx redirection, 4xx client error, 5xx server error.',
      'Read the description to see what the server is telling you and how to respond.',
    ],
    about: [
      'Every HTTP response starts with a three-digit status code. The first digit gives the class: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error. Learning the handful you meet daily — 200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 429, 500, 502, 503 — covers most debugging.',
      'The confusing pairs matter: 401 means "not authenticated" while 403 means "authenticated but not allowed"; 301 is cached permanently by browsers while 302 is not; 502 means the proxy could not reach your app while 503 means the app said it was busy.',
      'For APIs, 422 is the conventional code for validation errors and 429 for rate limiting; both should carry a body or header explaining what to fix.',
    ],
    faq: [
      { q: 'What is the difference between 401 and 403?', a: '401: the request has no valid credentials — log in. 403: credentials are fine but this user is not allowed — logging in again will not help.' },
      { q: 'Should I use 301 or 302 for a redirect?', a: '301 (or 308) when the move is permanent and search engines should update their index; 302 (or 307) for temporary redirects such as A/B tests or maintenance pages.' },
      { q: 'What causes a 502 Bad Gateway?', a: 'A reverse proxy or load balancer (nginx, Cloudflare, an ALB) could not get a valid response from the application server — it crashed, is restarting, or is listening on the wrong port.' },
    ],
    related: ['url-parser', 'jwt-decoder', 'json-formatter', 'cron-parser'],
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator (SEO, Open Graph, Twitter)',
    tagline: 'Generate title, description, Open Graph and Twitter Card tags with a live search preview.',
    description:
      'Generate HTML meta tags for SEO and social sharing: title, description, canonical, robots, Open Graph and Twitter Card. Live Google-style preview with length warnings. Copy and paste into <head>.',
    category: 'Generators',
    keywords: ['meta tag generator', 'open graph generator', 'twitter card generator', 'seo meta tags', 'og tags generator', 'meta description generator', 'html meta tags'],
    howTo: [
      'Fill in the title, description, URL and image. Length counters warn when Google will truncate.',
      'Check the search-result preview on the right.',
      'Click Copy HTML and paste the block into the <head> of your page.',
    ],
    about: [
      'Meta tags tell search engines and social networks what a page is about and how to display it. The title and description drive your search snippet; Open Graph tags control the card shown when the link is shared on Facebook, LinkedIn, WhatsApp and Slack; Twitter Card tags do the same for X.',
      'Google typically shows about 60 characters of a title and 155 of a description before truncating. The generator counts them live and colours the field when you are close to or over the limit.',
      'For the image, use a 1200×630 JPG or PNG under 1 MB with the key content centred — that ratio renders correctly on every major platform.',
    ],
    faq: [
      { q: 'Do meta keywords still matter?', a: 'No. Google has ignored the keywords tag since 2009. It is included only for the few engines and internal tools that still read it; leave it blank otherwise.' },
      { q: 'Why is my shared link showing the old image?', a: 'Platforms cache OG data. Use the Facebook Sharing Debugger or LinkedIn Post Inspector to refresh.' },
      { q: 'Should the canonical URL include a trailing slash?', a: 'It should match exactly the URL that your server serves without redirecting — pick one form and use it everywhere.' },
    ],
    related: ['robots-txt-generator', 'url-parser', 'html-entities', 'word-counter'],
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    tagline: 'Build a valid robots.txt with per-crawler rules, sitemap links and an AI-bot block list.',
    description:
      'Generate a robots.txt file online. Add allow/disallow rules per user-agent, crawl-delay, sitemap URLs, and optionally block AI training crawlers (GPTBot, ClaudeBot, CCBot). Presets for WordPress and staging.',
    category: 'Generators',
    keywords: ['robots.txt generator', 'create robots.txt', 'robots txt example', 'block gptbot', 'robots.txt wordpress', 'disallow all robots'],
    howTo: [
      'Start from a preset or edit the default block: set the user-agent and list the paths to disallow or allow, one per line.',
      'Add more blocks for specific crawlers, enter your sitemap URL, and tick the AI-crawler option if you want to opt out of model training.',
      'Copy the output and save it as robots.txt in your site root.',
    ],
    about: [
      'robots.txt is a plain-text file at the root of a site that tells well-behaved crawlers which paths they may fetch. It is the first thing Googlebot requests. It is not a security mechanism — anything listed is still publicly reachable — but it keeps crawlers out of admin areas, search-result pages and infinite calendar URLs that waste crawl budget.',
      'Rules are grouped by User-agent; the first matching group applies, and a more specific path wins over a shorter one. An empty Disallow means "allow everything". Sitemap lines can appear anywhere and apply to all crawlers.',
      'Blocking AI crawlers is a policy choice: it stops your content being used for model training by vendors that honour robots.txt, but it may also remove you from AI-powered search answers that could send traffic.',
    ],
    faq: [
      { q: 'Does Disallow remove pages from Google?', a: 'Not reliably — Google can still index a blocked URL from external links, just without content. Use a noindex meta tag (and allow crawling) to keep a page out of results.' },
      { q: 'Is Crawl-delay supported?', a: 'Bing and Yandex honour it; Google ignores it — set crawl rate in Search Console instead.' },
      { q: 'Where does the file go?', a: 'The site root only: https://example.com/robots.txt. Subdirectory copies are ignored.' },
    ],
    related: ['meta-tag-generator', 'url-parser', 'http-status-codes', 'cron-parser'],
  },
  {
    slug: 'line-sorter',
    name: 'Sort Lines & Remove Duplicates',
    tagline: 'Sort text lines alphabetically or numerically, dedupe, trim, reverse or shuffle.',
    description:
      'Sort lines of text online — A-Z, Z-A, numeric, by length, reverse or shuffle — and remove duplicate lines, trim whitespace and drop blanks. Free, instant, browser-based.',
    category: 'Converters',
    keywords: ['sort lines', 'remove duplicate lines', 'sort alphabetically online', 'dedupe list', 'sort text', 'shuffle lines', 'unique lines'],
    howTo: [
      'Paste a list with one item per line.',
      'Choose a sort order and tick the clean-up options you want — remove duplicates, ignore case, trim whitespace, drop empty lines.',
      'Copy the result. The counter shows how many lines were removed.',
    ],
    about: [
      'Lists arrive messy: exported from spreadsheets, copied from logs, pasted from chat. Cleaning them usually means the same handful of steps — trim, dedupe, sort — which this tool does in one pass.',
      'Numeric sort parses the leading number of each line, so "10" sorts after "2" instead of before it. Alphabetical sort is locale-aware, so accented characters land where a dictionary would put them.',
      'Duplicate detection can ignore case, treating "Apple" and "apple" as the same entry — useful for email lists and tags.',
    ],
    faq: [
      { q: 'Does sorting keep the first or last duplicate?', a: 'The first occurrence is kept; later duplicates are removed.' },
      { q: 'Can I sort CSV rows?', a: 'Yes — each row is a line. Sorting is by the whole line, so it effectively sorts by the first column.' },
      { q: 'Is there a line limit?', a: 'Hundreds of thousands of lines sort in well under a second.' },
    ],
    related: ['text-diff', 'case-converter', 'word-counter', 'json-to-csv'],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolsInCategory = (c: Category) => TOOLS.filter((t) => t.category === c);
