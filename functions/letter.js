export async function onRequest(context) {
  const url = new URL(context.request.url);
  const asset = await context.env.ASSETS.fetch(new URL('/letter.html', url.origin));
  if (!asset.ok) return asset;
  const symbol = url.searchParams.get('symbol');
  const category = url.searchParams.get('category');
  const letter = url.searchParams.get('letter');
  let query = '';
  if (symbol) query = '?symbol=' + encodeURIComponent(symbol);
  else if (category) query = '?category=' + encodeURIComponent(category);
  else if (letter) query = '?letter=' + encodeURIComponent(letter);
  if (!query) return asset;
  const canonical = 'https://www.tafseerahlam.store/letter' + query;
  let html = await asset.text();
  html = html.replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + canonical + '">');
  html = html.replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + canonical + '">');
  const headers = new Headers(asset.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(html, { status: 200, headers });
}
