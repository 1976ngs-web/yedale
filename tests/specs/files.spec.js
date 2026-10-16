// Every recording, picture and file the site refers to really exists (no silent fallbacks to a robot voice or a blank picture).
const { test, expect } = require('../support/fixtures');
const fs = require('fs'), path = require('path');
const PUB = path.resolve(__dirname, '..', '..', 'public');

test('כל הקבצים שהאתר מזכיר קיימים', async () => {
  const html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
  const refs = new Set();
  for (const m of html.matchAll(/(?:audio|pics)\/[A-Za-z0-9_\-\/.]+\.(?:mp3|webp|png|jpg)/g)) refs.add(m[0]);
  const missing = [...refs].filter(r => !fs.existsSync(path.join(PUB, r)));
  expect(missing, 'files referenced by the code but missing').toEqual([]);
});

test('לכל משפט ברשימת הקולות יש הקלטה', async ({ site }) => {
  await site.boot({ level: 'a' });
  const list = await site.ev(() => VO.list());
  expect(list.length).toBeGreaterThan(300);
  const missing = list.filter(([f]) => !fs.existsSync(path.join(PUB, 'audio', f + '.mp3'))).map(([f, t]) => f + ' — ' + t);
  expect(missing, 'voice lines without a recording').toEqual([]);
  const texts = {}; const dup = [];
  list.forEach(([f, t]) => { if (texts[t] && texts[t] !== f) dup.push(t + ' : ' + texts[t] + ' / ' + f); texts[t] = f; });
  test.info().annotations.push({ type: 'same text, two recordings (later wins)', description: String(dup.length) });
});
