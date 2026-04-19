const routes = ['/', '/week', '/archief', '/overzicht/kalender', '/overzicht/trainingskalender', '/trainingen/2026-04-18-techniek-alle-slagen', '/robots.txt'];
const base = 'http://localhost:3100';
const extractMeta = (html, name) => {
  const re1 = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
};
(async () => {
  const results = [];
  for (const route of routes) {
    try {
      const res = await fetch(base + route, { headers: { 'cache-control': 'no-cache' } });
      const body = await res.text();
      results.push({
        route,
        status: res.status,
        contentType: res.headers.get('content-type'),
        robots: extractMeta(body, 'robots'),
        googlebot: extractMeta(body, 'googlebot')
      });
    } catch (error) {
      results.push({ route, status: 'REQUEST_FAILED', contentType: null, robots: null, googlebot: null, error: String(error) });
    }
  }
  console.log(JSON.stringify(results, null, 2));
})();
