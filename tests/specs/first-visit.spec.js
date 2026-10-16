// A brand-new family: the whole opening — magic book, bottle, parent lock, settings, Zaharit's letter — then the map.
const { test, expect, noProblems } = require('../support/fixtures');
const { hebrewNumber } = require('../support/hebrew-number');

test('ביקור ראשון: ספר, בקבוק, נעילה, הגדרות, מכתב, מפה', async ({ site, problems, page }) => {
  await site.boot({ fresh: true, seed: 11 });
  expect(await site.ev(() => document.body.classList.contains('introOn')), 'book shows on first visit').toBe(true);
  // the book: every page, with real taps where a child would tap
  await site.play('book', { stepMs: 250, maxSteps: 3000 });
  await site.until(() => !document.body.classList.contains('introOn'), null, { what: 'map after the book' });
  expect(await site.ls('lw-intro-seen')).toBe('1');
  // the bottle floats in the middle; tapping it opens the adult lock
  await site.until(() => { const b = document.getElementById('lwBig'); return b && getComputedStyle(b).display !== 'none' && b.getBoundingClientRect().width > 0; }, null, { what: 'bottle' });
  await site.tapSel('#lwBig'); await site.run(400);
  await expect(page.locator('#lwIn')).toBeVisible();
  // wrong number first: stays locked and says so
  await page.locator('#lwIn').fill('1234'); await site.tapSel('#lwOk'); await site.run(200);
  await expect(page.locator('#lwErr')).not.toBeEmpty();
  const num = await site.ev(() => document.querySelector('.lwnum').textContent);
  expect(num.length).toBeGreaterThan(3);
  await page.locator('#lwIn').fill(String(hebrewNumber(num))); await site.tapSel('#lwOk'); await site.run(300);
  // settings: choose grade 2, give a name, save
  await expect(page.locator('#lwSave')).toBeVisible();
  await site.tapSel('.lwseg button[data-l="b"]'); await page.locator('#lwName').fill('נועה'); await site.tapSel('#lwSave'); await site.run(800);
  const prof = await site.lsJSON('lw-profile');
  expect(prof.level).toBe('b'); expect(prof.name).toBe('נועה'); expect(prof.setupDone).toBe(true);
  // the letter: read aloud, then a tap sends the magic to the plane
  await site.until(() => { const p = document.getElementById('lwPaper'); return p && p.classList.contains('ready'); }, null, { what: 'letter ready' });
  await site.tapSel('#lwPaper'); await site.run(6000);
  expect((await site.lsJSON('lw-profile')).letterRead).toBe(true);
  expect(await site.ev(() => getComputedStyle(document.getElementById('lwModal')).display)).toBe('none');
  await site.shot('map-after-letter');
  // second visit: the book has a skip button and the bottle does not come back
  await page.reload(); await site.run(1500);
  await site.skipIntro();
  expect(await site.ev(() => { const b = document.getElementById('lwBig'); return getComputedStyle(b).display; })).toBe('none');
  await noProblems(problems, site);
});
