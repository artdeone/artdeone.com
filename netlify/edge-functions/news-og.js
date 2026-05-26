// netlify/edge-functions/news-og.js
// Injects article-specific Open Graph meta tags into news-article.html
// so Facebook / Twitter / LinkedIn crawlers (which don't run JS) see the
// correct title, description, and thumbnail for each article.

export default async (request, context) => {
  const url = new URL(request.url);
  const articleId = url.searchParams.get("id");

  // Strip Range / If-Range headers before passing to the origin so we get
  // a complete 200 OK response, not a 206 Partial Content. Facebook's
  // scraper sends Range: bytes=0-... which made the origin return 206;
  // that partial-content status confused FB's share composer.
  const cleanHeaders = new Headers(request.headers);
  cleanHeaders.delete("range");
  cleanHeaders.delete("if-range");
  const cleanRequest = new Request(request.url, {
    method: request.method,
    headers: cleanHeaders,
    redirect: "manual",
  });

  const response = await context.next(cleanRequest);

  if (!articleId) return response;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  // Fetch the news data file (it's a same-origin static asset).
  // Uses JSON (not the JS source) because Deno Deploy blocks `new Function()`
  // and `eval()`. The JSON is generated at build time by
  // scripts/generate-news-json.js.
  let article;
  try {
    const dataRes = await fetch(new URL("/js/news-data.json", url.origin), {
      headers: { Accept: "application/json" },
    });
    if (!dataRes.ok) return response;

    const newsData = JSON.parse(await dataRes.text());
    article = Array.isArray(newsData)
      ? newsData.find((a) => a && a.id === articleId)
      : null;
  } catch (_err) {
    return response;
  }

  if (!article) return response;

  const escapeAttr = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // For Cloudinary images, request a Facebook-friendly 1200x630 crop so
  // the OG preview is rendered at the optimal aspect ratio.
  const buildOgImage = (src) => {
    if (!src) return "";
    if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
      return src.replace(
        "/image/upload/",
        "/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/"
      );
    }
    return src;
  };

  const fullTitle = escapeAttr(article.title + " — ART de ONE");
  const desc = escapeAttr(article.subtitle || "");
  const image = escapeAttr(buildOgImage(article.thumbnail || ""));
  const pageUrl = escapeAttr(url.toString());

  let html = await response.text();

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${fullTitle}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${desc}">`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${fullTitle}">`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${desc}">`
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${image}">\n    <meta property="og:image:secure_url" content="${image}">\n    <meta property="og:image:type" content="image/jpeg">\n    <meta property="og:image:width" content="1200">\n    <meta property="og:image:height" content="630">\n    <meta property="og:image:alt" content="${escapeAttr(article.thumbnailAlt || article.title)}">`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${pageUrl}">\n    <meta property="fb:app_id" content="0">`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${fullTitle}">`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${desc}">`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${image}">`
    );

  // Build new headers, drop any stale length / etag / range so Netlify
  // recomputes them. Range-related headers are stripped because we're
  // returning the full rewritten document, not a partial response.
  const newHeaders = new Headers(response.headers);
  newHeaders.delete("content-length");
  newHeaders.delete("etag");
  newHeaders.delete("content-range");
  newHeaders.delete("accept-ranges");
  // Do not let intermediaries cache user-specific or stale variants too long
  newHeaders.set("Cache-Control", "public, max-age=300, must-revalidate");

  return new Response(html, {
    status: 200,
    statusText: "OK",
    headers: newHeaders,
  });
};

export const config = {
  path: "/news-article.html",
};
