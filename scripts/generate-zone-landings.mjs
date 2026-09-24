#!/usr/bin/env node
/**
 * Zone landings retired. Removes any leftover osteopata-*-milano.html
 * so prebuild never resurrects doorway pages.
 */
import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RETIRED_ZONE_SLUGS } from "../src/seo-urls.js";
import { ZONE_LANDINGS } from "../src/zone-landings.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

if (ZONE_LANDINGS.length > 0) {
  console.error(
    "ZONE_LANDINGS must stay empty — geographic pages are consolidated on /milano-forlanini/",
  );
  process.exit(1);
}

const toRemove = new Set(
  RETIRED_ZONE_SLUGS.map((slug) => `${slug}.html`),
);

let removed = 0;
for (const name of readdirSync(root)) {
  if (!name.startsWith("osteopata-") || !name.endsWith("-milano.html")) continue;
  toRemove.add(name);
}

for (const name of toRemove) {
  const path = join(root, name);
  if (existsSync(path)) {
    unlinkSync(path);
    removed += 1;
    console.log(`removed ${name}`);
  }
}

console.log(
  `Zone landings: none generated (removed ${removed} leftover file(s) if any)`,
);
