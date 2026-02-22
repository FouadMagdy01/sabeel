#!/usr/bin/env node
/**
 * Generates quran_data.db from quran_data_by_page.json
 *
 * Usage: node scripts/generate-quran-db.mjs [path-to-json]
 *
 * Default JSON path: ~/Downloads/quran_data_by_page.json
 * Output: assets/quran/quran_data.db
 */

import { readFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const jsonPath =
  process.argv[2] ||
  resolve(process.env.HOME, 'Downloads', 'quran_data_by_page.json');

const outputDir = resolve(projectRoot, 'assets', 'quran');
const outputPath = resolve(outputDir, 'quran_data.db');

if (!existsSync(jsonPath)) {
  console.error(`JSON file not found: ${jsonPath}`);
  process.exit(1);
}

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log(`Reading JSON from: ${jsonPath}`);
const raw = readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

// Remove existing DB if present
try {
  unlinkSync(outputPath);
} catch {
  // ignore
}

const db = new Database(outputPath);

// Enable WAL for faster writes
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE verses (
    id INTEGER PRIMARY KEY,
    surah_id INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    verse_key TEXT NOT NULL UNIQUE,
    text_uthmani TEXT NOT NULL,
    juz_number INTEGER NOT NULL,
    page_number INTEGER NOT NULL
  );

  CREATE TABLE tafseer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verse_id INTEGER NOT NULL REFERENCES verses(id),
    tafseer_name TEXT NOT NULL,
    text TEXT NOT NULL
  );

  CREATE INDEX idx_verses_surah ON verses(surah_id, ayah_number);
  CREATE INDEX idx_verses_page ON verses(page_number);
  CREATE INDEX idx_verses_juz ON verses(juz_number);
  CREATE INDEX idx_tafseer_verse ON tafseer(verse_id);
`);

const insertVerse = db.prepare(`
  INSERT INTO verses (id, surah_id, ayah_number, verse_key, text_uthmani, juz_number, page_number)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertTafseer = db.prepare(`
  INSERT INTO tafseer (verse_id, tafseer_name, text)
  VALUES (?, ?, ?)
`);

let verseCount = 0;
let tafseerCount = 0;

const insertAll = db.transaction(() => {
  const pages = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  for (const pageNumber of pages) {
    const verses = data[String(pageNumber)];
    for (const v of verses) {
      // Parse surah_id and ayah_number from verse_key "2:141"
      const [surahStr, ayahStr] = v.verse_key.split(':');
      const surahId = Number(surahStr);
      const ayahNumber = Number(ayahStr);

      insertVerse.run(
        v.id,
        surahId,
        ayahNumber,
        v.verse_key,
        v.text_uthmani,
        v.juz_number,
        pageNumber
      );
      verseCount++;

      if (v.tafseer && Array.isArray(v.tafseer)) {
        for (const t of v.tafseer) {
          insertTafseer.run(v.id, t.tafseer_name, t.text);
          tafseerCount++;
        }
      }
    }
  }
});

insertAll();

// Switch back to DELETE journal mode for distribution
db.pragma('journal_mode = DELETE');

db.close();

console.log(`\nDatabase generated: ${outputPath}`);
console.log(`  Verses:  ${verseCount}`);
console.log(`  Tafseer: ${tafseerCount}`);
console.log(`  Pages:   ${Object.keys(data).length}`);
