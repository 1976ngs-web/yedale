// The round door in the tree: closed under 400 Hebrew-island stars, opens by itself at 400 with the big effect,
// leads to the second courtyard and stays open. Number-planet stars don't count for this door.
const { test, expect, noProblems } = require('../support/fixtures');

async function toYard(site, store) {
  await site.boot({ level: 'a', seed: 9, store });
  await site.skipIntro();
  await site.enterIsland('heb');
  await site.run(4000);
}

test('הדלת נשארת סגורה מתחת ל-400 כוכבים של האי', async ({ site, problems }) => {
  await toYard(site, { 'learn-world': JSON.stringify({ coins: 399 }) });
  await site.run(8000);
  expect(await site.lsJSON('lw-door')).toBeNull();
  expect(await site.ev(() => document.getElementById('isDoor').classList.contains('open'))).toBe(false);
  await site.tapSel('#isDoor .dHit'); await site.run(1500);
  expect(await site.ev(() => YTEST.games.isle.state().mode)).toBe('hub');
  await noProblems(problems, site);
});

test('כוכבים מכוכב המספרים לא פותחים את הדלת', async ({ site, problems }) => {
  await toYard(site, { 'learn-world': JSON.stringify({ coins: 420 }), 'lw-num-stars': '40' });
  await site.run(8000);
  expect(await site.lsJSON('lw-door')).toBeNull();
  await noProblems(problems, site);
});

test('ב-400 כוכבים הדלת נפתחת, מובילה לחצר השנייה ונשארת פתוחה', async ({ site, problems, page }) => {
  await toYard(site, { 'learn-world': JSON.stringify({ coins: 400 }) });
  await site.until(() => { try { return JSON.parse(localStorage.getItem('lw-door') || '{}').open; } catch (e) { return false; } }, null, { max: 60000, what: 'door opened' });
  await site.run(15000);
  await site.shot('door-open');
  // after the big effect the child flies straight into the second courtyard
  await site.until(() => { const st = [...document.querySelectorAll('.isS')].map(e => e.dataset.g); return st.length === 1 && st[0] === 'owl'; }, null, { max: 30000, what: 'second courtyard after the effect' });
  await site.shot('yard2');
  await site.tapSel('#isDoor .dHit'); await site.run(4000);
  expect(await site.ev(() => !!document.querySelector('.isS[data-g="ff"]')), 'the door leads back to the first courtyard').toBe(true);
  expect(await site.ev(() => document.getElementById('isDoor').classList.contains('open')), 'and is drawn open there').toBe(true);
  await site.tapSel('#isDoor .dHit'); await site.run(4000);
  expect(await site.ev(() => !document.querySelector('.isS[data-g="ff"]') && !!document.querySelector('.isS[data-g="owl"]')), 'and again into the second').toBe(true);
  await page.reload(); await site.run(1500); await site.skipIntro(); await site.enterIsland('heb'); await site.run(3000);
  expect(await site.ev(() => document.getElementById('isDoor').classList.contains('open')), 'still open after reload').toBe(true);
  await noProblems(problems, site);
});
