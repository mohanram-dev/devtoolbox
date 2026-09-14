/**
 * Writes public/ads.txt from the AdSense publisher ID in src/config.ts.
 * AdSense requires this file at the site root; it tells buyers who may sell your inventory.
 */
import { writeFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ADS } from '../src/config.ts';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'ads.txt');
if (ADS.adsenseClient) {
  const pub = ADS.adsenseClient.replace(/^ca-/, '');
  writeFileSync(file, `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
  console.log(`[ads.txt] written for ${pub}`);
} else if (existsSync(file)) {
  rmSync(file);
  console.log('[ads.txt] no publisher ID configured — removed');
} else {
  console.log('[ads.txt] no publisher ID configured — skipped');
}
