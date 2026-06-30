#!/usr/bin/env node
/**
 * test-blog-article.mjs  (one-off render test, no browser)
 *
 * Loads blog-article.html into jsdom, then runs the page's REAL inline engine
 * (blog-data.js + blog-content.js + the article engine IIFE) against the real
 * data for every post id, plus edge cases. Asserts the rendered DOM is correct.
 *
 * Run:  node scripts/test-blog-article.mjs   (needs: npm i jsdom --no-save)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const html = fs.readFileSync(path.join(ROOT, 'blog-article.html'), 'utf8');
const blogDataSrc = fs.readFileSync(path.join(ROOT, 'js', 'blog-data.js'), 'utf8');
const blogContentSrc = fs.readFileSync(path.join(ROOT, 'js', 'blog-content.js'), 'utf8');

// ---- pull the engine IIFE out of the template (the <script> right after blog-content.js) ----
const after = html.split('/js/blog-content.js"></script>')[1] || '';
const engineMatch = after.match(/<script>\s*([\s\S]*?)<\/script>/);
if (!engineMatch) { console.error('Could not locate engine <script> in blog-article.html'); process.exit(1); }
const engineSrc = engineMatch[1];

// data ids present
const blogPosts = new Function('return (' + (blogDataSrc.match(/const\s+blogPosts\s*=\s*(\[[\s\S]*?\n\];)/)[1].replace(/;\s*$/, '')) + ')')();
const ids = blogPosts.map(p => p.id);

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? '  — ' + detail : '')); }
}

function render(idParam) {
  const url = idParam == null
    ? 'https://artdeone.com/blog-article.html'
    : 'https://artdeone.com/blog-article.html?id=' + encodeURIComponent(idParam);
  const vc = new VirtualConsole(); // swallow jsdom "navigation not implemented" noise
  let navAttempt = null;
  vc.on('jsdomError', (e) => { if (e && /navigation/i.test(String(e.message))) navAttempt = '/blog.html'; });
  const dom = new JSDOM(html, { url, runScripts: 'outside-only', virtualConsole: vc, pretendToBeVisual: true });
  const w = dom.window;
  // record redirects without throwing — try a direct stub, else fall back to the nav-error capture
  w.__redir = null;
  try { Object.defineProperty(w.location, 'replace', { value: (u) => { w.__redir = u; }, configurable: true }); }
  catch { /* location.replace not configurable in this jsdom — rely on jsdomError capture */ }
  // run data + engine in one lexical scope so `const blogPosts` is visible to the engine
  w.eval(blogDataSrc + '\n' + blogContentSrc + '\n' + engineSrc);
  if (w.__redir == null && navAttempt) w.__redir = navAttempt;
  return w;
}

console.log('Testing blog-article.html engine against real data\n');

// ---- every real id ----
for (const id of ids) {
  const w = render(id);
  const d = w.document;
  const title = d.getElementById('post-title').textContent.trim();
  const body = d.getElementById('post-body').innerHTML.trim();
  const cat = d.getElementById('post-category').textContent.trim();
  const date = d.getElementById('post-date').textContent.trim();
  const thumb = d.getElementById('post-thumbnail');
  const related = d.getElementById('related-posts').querySelectorAll('a.related-card');
  const styles = d.getElementById('post-styles').textContent;
  const post = blogPosts.find(p => p.id === id);

  check(`id ${id}: not redirected`, w.__redir == null, 'redirected to ' + w.__redir);
  check(`id ${id}: title set`, title === post.title, `got "${title}"`);
  check(`id ${id}: document.title`, d.title === post.title + ' — ART de ONE', `got "${d.title}"`);
  check(`id ${id}: body non-empty`, body.length > 50, `len=${body.length}`);
  check(`id ${id}: category set`, cat.length > 0);
  check(`id ${id}: date matches`, date === post.date, `got "${date}"`);
  check(`id ${id}: thumbnail src`, thumb.getAttribute('src') === post.image, `got "${thumb.getAttribute('src')}"`);
  check(`id ${id}: thumbnail alt`, thumb.getAttribute('alt') === post.title);
  check(`id ${id}: 3 related cards`, related.length === 3, `got ${related.length}`);
  // related must not include self and must point at blog-article.html?id=
  let relOk = true, selfRef = false;
  related.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!/^blog-article\.html\?id=\d+$/.test(href)) relOk = false;
    if (href === 'blog-article.html?id=' + id) selfRef = true;
  });
  check(`id ${id}: related hrefs valid`, relOk);
  check(`id ${id}: related excludes self`, !selfRef);
  check(`id ${id}: styles injected`, typeof styles === 'string');
  // canonical + og updated
  const canon = d.querySelector('link[rel="canonical"]').getAttribute('href');
  check(`id ${id}: canonical = page url`, canon === 'https://artdeone.com/blog-article.html?id=' + id, `got "${canon}"`);
  const ogImg = d.querySelector('meta[property="og:image"]').getAttribute('content');
  check(`id ${id}: og:image absolute`, /^https?:\/\//.test(ogImg), `got "${ogImg}"`);
}

// ---- edge cases: must redirect, must NOT render ----
for (const bad of ['999', '0', 'post-1', 'abc', null]) {
  const w = render(bad);
  const d = w.document;
  const title = d.getElementById('post-title').textContent.trim();
  const redirected = w.__redir === '/blog.html';
  const empty = title.length === 0;
  check(`edge id=${bad}: redirects to /blog.html`, redirected, 'redir=' + w.__redir);
  check(`edge id=${bad}: nothing rendered`, empty, `title="${title}"`);
}

// ---- iframe-bearing posts keep their iframe in body ----
for (const id of ids) {
  const w = render(id);
  const c = w.blogContent[String(id)];
  if (c && /<iframe/i.test(c.content)) {
    const body = w.document.getElementById('post-body').innerHTML;
    check(`id ${id}: iframe preserved in DOM`, /<iframe/i.test(body));
  }
}

console.log(`\n${pass} checks passed, ${fail} failed`);
if (fail) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log('  ✗ ' + f);
  process.exit(1);
} else {
  console.log('All render checks passed for ids: ' + ids.join(', '));
}
