const base = 'http://localhost:3001';
const id = 603;

async function getMovie(cookie) {
  const headers = cookie ? { Cookie: cookie } : {};
  const res = await fetch(`${base}/api/movies/${id}`, { headers });
  return await res.json();
}

(async () => {
  try {
    const before = await getMovie();
    console.log('BEFORE', JSON.stringify({ title: before.title, original_language: before.original_language, overview: before.overview, genres: before.genres?.map(g => g.name) }, null, 2));

    const localeRes = await fetch(`${base}/api/locale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'ar' }),
    });
    const setCookie = localeRes.headers.get('set-cookie') || localeRes.headers.get('Set-Cookie');
    console.log('SET_COOKIE', setCookie);
    const cookieHeader = setCookie ? setCookie.split(';')[0] : '';

    const after = await getMovie(cookieHeader);
    console.log('AFTER', JSON.stringify({ title: after.title, original_language: after.original_language, overview: after.overview, genres: after.genres?.map(g => g.name) }, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
