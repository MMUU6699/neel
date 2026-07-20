const base = 'http://localhost:3001';
const id = 603;

async function fetchRaw(cookie) {
  const headers = cookie ? { Cookie: cookie } : {};
  const res = await fetch(`${base}/api/movies/${id}`, { headers });
  const text = await res.text();
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text };
}

(async () => {
  try {
    const before = await fetchRaw();
    console.log('BEFORE STATUS', before.status);
    console.log('BEFORE HEADERS', JSON.stringify(before.headers, null, 2));
    console.log('BEFORE BODY', before.text);

    const localeRes = await fetch(`${base}/api/locale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'ar' }),
    });
    const setCookie = localeRes.headers.get('set-cookie') || localeRes.headers.get('Set-Cookie');
    console.log('SET_COOKIE', setCookie);
    const cookieHeader = setCookie ? setCookie.split(';')[0] : '';

    const after = await fetchRaw(cookieHeader);
    console.log('AFTER STATUS', after.status);
    console.log('AFTER HEADERS', JSON.stringify(after.headers, null, 2));
    console.log('AFTER BODY', after.text);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
