#!/usr/bin/env node
/**
 * extract-post-content.mjs  (one-off, idempotent)
 *
 * Reads every post referenced by js/blog-data.js, extracts:
 *   - the article body (inner HTML of `.post-content`, with the trailing
 *     "Share this …" block removed — the template renders its own share row),
 *   - the post's page-specific <style> (so the body renders pixel-faithfully),
 *     normalizing `.dark-mode` selectors to `html[data-theme="dark"]` so dark
 *     mode works under the template's theme system,
 *   - the eyebrow category label (used as the tag).
 *
 * Writes js/blog-content.js:  const blogContent = { "<id>": {category, tags, styles, content}, ... }
 *
 * blog-data.js is left UNTOUCHED. Run:  node scripts/extract-post-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DATA = path.join(ROOT, 'js', 'blog-data.js');
const OUT = path.join(ROOT, 'js', 'blog-content.js');

// Fallback category map (mirrors getCategory() in blog-data.js)
const CATEGORY_FALLBACK = {
  1:'RESOURCE',2:'THEORY',3:'THEORY',4:'DESIGN',5:'DESIGN',6:'DESIGN',7:'HISTORY',
  8:'TUTORIAL',9:'AI',10:'DESIGN',11:'AI',20:'AI',21:'FREELANCE',22:'AI',23:'DESIGN',
  24:'AI',25:'FREELANCE',26:'FREELANCE',27:'BRANDING',28:'BRANDING',29:'BRANDING',
  30:'BRANDING',31:'DESIGN',
};

// ---- load blogPosts array from blog-data.js without executing the whole file ----
function loadBlogPosts() {
  const src = fs.readFileSync(BLOG_DATA, 'utf8');
  const m = src.match(/const\s+blogPosts\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!m) throw new Error('Could not locate `const blogPosts = [ ... ];` in blog-data.js');
  const literal = m[1].replace(/;\s*$/, '');
  // eslint-disable-next-line no-new-func
  return new Function('return ' + literal)();
}

// ---- find inner HTML of the first <div class="...post-content..."> via <div> depth ----
function extractPostContentInner(html) {
  const open = /<div[^>]*\bclass="[^"]*\bpost-content\b[^"]*"[^>]*>/i.exec(html);
  if (!open) return null;
  const bodyStart = open.index + open[0].length;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = bodyStart;
  let depth = 1, mt, end = -1;
  while ((mt = tagRe.exec(html))) {
    if (mt[0][1] === '/') { if (--depth === 0) { end = mt.index; break; } }
    else depth++;
  }
  if (end < 0) return null;
  return html.slice(bodyStart, end);
}

// ---- capture media (iframe/video) that sits in the content section BEFORE .post-content ----
// (e.g. post-9's main YouTube embed is a sibling above .post-content). Plain cover <img>
// elements are intentionally ignored — the template renders post.image as the hero.
function extractPreMedia(html) {
  const pc = html.search(/<div[^>]*\bclass="[^"]*\bpost-content\b[^"]*"[^>]*>/i);
  if (pc < 0) return '';
  const secIdx = html.lastIndexOf('<section', pc);
  const region = html.slice(secIdx < 0 ? 0 : secIdx, pc);
  const wrappers = [];
  const seen = new Set();
  const mediaRe = /<(?:iframe|video)\b/gi;
  let m;
  while ((m = mediaRe.exec(region))) {
    const start = region.lastIndexOf('<div', m.index);
    if (start < 0 || seen.has(start)) continue;
    const openTag = /<div\b[^>]*>/y;
    openTag.lastIndex = start;
    const om = openTag.exec(region);
    if (!om) continue;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = start + om[0].length;
    let depth = 1, end = -1, t;
    while ((t = tagRe.exec(region))) {
      if (t[0][1] === '/') { if (--depth === 0) { end = t.index + t[0].length; break; } }
      else depth++;
    }
    if (end < 0) continue;
    seen.add(start);
    wrappers.push(region.slice(start, end));
  }
  return wrappers.join('\n');
}

// ---- remove the trailing share block (wrapper <div> that holds .share-btn / "Share this…") ----
function stripShareBlock(inner) {
  let anchor = -1;
  const btn = /class="[^"]*\bshare-btn\b/i.exec(inner);
  if (btn) {
    const label = inner.lastIndexOf('Share this', btn.index);
    anchor = label >= 0 ? label : btn.index;
  } else {
    const label = inner.search(/Share this/i);
    if (label >= 0) anchor = label;
  }
  if (anchor >= 0) {
    const cut = inner.lastIndexOf('<div', anchor);
    if (cut >= 0) inner = inner.slice(0, cut);
  }
  // drop a SINGLE dangling trailing HTML comment + whitespace (e.g. "<!-- Share -->").
  // The inner negative-lookahead prevents spanning across earlier body comments.
  return inner.replace(/\s*<!--(?:(?!-->)[\s\S])*-->\s*$/, '').trim();
}

// ---- collect + normalize page-specific styles ----
function extractStyles(html) {
  const blocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  let css = blocks.join('\n');
  // normalize dark-mode selectors to the template's theme contract
  css = css.replace(/body\.dark-mode\b/g, 'html[data-theme="dark"]')
           .replace(/\.dark-mode\b/g, 'html[data-theme="dark"]');
  return css.trim();
}

function extractCategory(html, id) {
  const m = /<span[^>]*\btext-accent\b[^>]*>([\s\S]*?)<\/span>/i.exec(html);
  if (m) {
    const t = m[1].replace(/<[^>]*>/g, '').trim();
    if (t) return t;
  }
  return CATEGORY_FALLBACK[id] || 'ARTICLE';
}

// ---- rewrite relative src/href/srcset to root-absolute ----
// The content is rendered from /blog-article.html at the SITE ROOT, not from
// /posts/post-N/, so relative paths like "images/foo.jpg" (which worked in the
// original post) would resolve to /images/foo.jpg and 404. Resolve them against
// the post's own directory so they become /posts/post-N/images/foo.jpg.
function absolutizeUrls(html, baseDir) {
  const fix = (raw) => {
    const url = raw.trim();
    if (!url || /^(https?:)?\/\//i.test(url) || url[0] === '/' ||
        url.startsWith('data:') || url[0] === '#' ||
        url.startsWith('mailto:') || url.startsWith('tel:')) return raw;
    return path.posix.normalize(path.posix.join(baseDir, url));
  };
  return html
    .replace(/\b(src|href)="([^"]*)"/gi, (_m, attr, val) => `${attr}="${fix(val)}"`)
    .replace(/\bsrcset="([^"]*)"/gi, (_m, val) =>
      'srcset="' + val.split(',').map((part) => {
        const seg = part.trim().split(/\s+/);
        if (seg[0]) seg[0] = fix(seg[0]);
        return seg.join(' ');
      }).join(', ') + '"');
}

// ---- escape for safe embedding inside a JS template literal ----
function escTpl(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
    .replace(/<\/script>/gi, '<\\/script>');
}

function main() {
  const posts = loadBlogPosts();
  const out = {};
  const report = [];
  const problems = [];

  for (const p of posts) {
    const abs = path.join(ROOT, p.file.replace(/^\//, ''));
    let html;
    try { html = fs.readFileSync(abs, 'utf8'); }
    catch { problems.push(`id ${p.id}: cannot read ${p.file}`); continue; }

    const rawInner = extractPostContentInner(html);
    if (rawInner == null) { problems.push(`id ${p.id}: .post-content not found in ${p.file}`); continue; }

    const body = stripShareBlock(rawInner);
    const preMedia = extractPreMedia(html);
    const baseDir = path.posix.dirname('/' + p.file.replace(/^\/+/, ''));
    const content = absolutizeUrls((preMedia ? preMedia + '\n\n' : '') + body, baseDir);
    const styles = extractStyles(html);
    const category = extractCategory(html, p.id);

    out[String(p.id)] = { category, tags: [category], styles, content };
    report.push({
      id: p.id,
      file: p.file.replace(/^\/posts\//, ''),
      category,
      contentLen: content.length,
      styleLen: styles.length,
      iframe: /<iframe/i.test(content),
      shareRemoved: /Share this/i.test(rawInner),
    });
  }

  // ---- write js/blog-content.js ----
  let js = '// AUTO-GENERATED by scripts/extract-post-content.mjs — DO NOT EDIT BY HAND.\n';
  js += '// Per-post article body + page-specific styles, keyed by blog post id.\n';
  js += '// Regenerate with:  node scripts/extract-post-content.mjs\n';
  js += 'const blogContent = {\n';
  for (const id of Object.keys(out)) {
    const e = out[id];
    js += `  ${JSON.stringify(id)}: {\n`;
    js += `    category: ${JSON.stringify(e.category)},\n`;
    js += `    tags: ${JSON.stringify(e.tags)},\n`;
    js += `    styles: \`${escTpl(e.styles)}\`,\n`;
    js += `    content: \`${escTpl(e.content)}\`\n`;
    js += `  },\n`;
  }
  js += '};\n';
  js += "if (typeof window !== 'undefined') { window.blogContent = blogContent; }\n";
  fs.writeFileSync(OUT, js, 'utf8');

  // ---- report ----
  console.log(`\nExtracted ${report.length}/${posts.length} posts -> ${path.relative(ROOT, OUT)}\n`);
  console.log('id   file                               category            bodyLen  styleLen  iframe  share');
  console.log('---  ---------------------------------  ------------------  -------  --------  ------  -----');
  for (const r of report) {
    console.log(
      String(r.id).padEnd(3),
      ' ',
      r.file.padEnd(33),
      String(r.category).slice(0, 18).padEnd(18),
      String(r.contentLen).padStart(7),
      String(r.styleLen).padStart(9),
      String(r.iframe).padStart(7),
      String(r.shareRemoved).padStart(6),
    );
  }
  if (problems.length) {
    console.log('\n PROBLEMS:');
    for (const pr of problems) console.log('  - ' + pr);
    process.exitCode = 1;
  } else {
    console.log('\n No problems. All posts extracted cleanly.');
  }
}

main();
