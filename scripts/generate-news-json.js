#!/usr/bin/env node
// Reads js/news-data.js (a `const newsData = [...]` declaration) and writes
// js/news-data.json. Consumed by netlify/edge-functions/news-og.js, which
// runs on Deno Deploy where `new Function()` is blocked.

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcPath = path.join(repoRoot, 'js', 'news-data.js');
const outPath = path.join(repoRoot, 'js', 'news-data.json');

const src = fs.readFileSync(srcPath, 'utf8');
const newsData = new Function(src + '\n; return newsData;')();

if (!Array.isArray(newsData)) {
  console.error('generate-news-json: newsData is not an array');
  process.exit(1);
}

fs.writeFileSync(outPath, JSON.stringify(newsData, null, 2) + '\n');
console.log(`generate-news-json: wrote ${newsData.length} articles to js/news-data.json`);
