// The magic shop (buy, wear, take off, not enough stars) and the parents' area (lock, settings, progress, resets).
const { test, expect, noProblems } = require('../support/fixtures');
const { hebrewNumber } = require('../support/hebrew-number');

test('חנות הקסמים: קונים, מפעילים, מורידים, ואין מספיק כוכבים', async ({ site, problems, page }) => {
  await site.boot({ level: 'a', store: { 'learn-world': JSON.stringify({ coins: 100 }) } });
  await site.skipIntro(); await site.enterIsland('heb'); await site.run(2000);
  await site.tapSel('#xgShopBtn'); await site.run(600);
  await expect(page.locator('#xgShop')).toBeVisible();
  await site.tapSel('#xgShop .xgItem[data-id="pink"]'); await site.run(800);
  expect(await site.stars()).toBe(70);
  let shop = await site.lsJSON('lw-shop');
  expect(shop.own.pink).toBe(1); expect(shop.aura).toBe('pink');
  await site.tapSel('#xgShop .xgItem[data-id="pink"]'); await site.run(400);   // take it off
  shop = await site.lsJSON('lw-shop'); expect(shop.aura).toBeFalsy(); expect(await site.stars()).toBe(70);
  await site.tapSel('#xgShop .xgItem[data-id="crown"]'); await site.run(400);  // 80 > 70
  await expect(page.locator('#xgMsg')).toContainText('10');
  expect(await site.stars()).toBe(70);
  await site.tapSel('#xgShop .xgX'); await site.run(300);
  await expect(page.locator('#xgShop')).toHaveCount(0);
  await noProblems(problems, site);
});

async function openSettings(site, page) {
  await site.tapSel('#lwGear'); await site.run(300);
  const num = await site.ev(() => document.querySelector('.lwnum').textContent);
  await page.locator('#lwIn').fill(String(hebrewNumber(num))); await site.tapSel('#lwOk'); await site.run(300);
  await expect(page.locator('#lwSave')).toBeVisible();
}

test('אזור ההורים: נעילה, שינוי רמה, דוח התקדמות, איפוס', async ({ site, problems, page }) => {
  await site.boot({ level: 'a', store: { 'learn-world': JSON.stringify({ coins: 55 }), 'lw-progress-a-cave': JSON.stringify({ err: { 'מִי': 2 }, ok: 5, done: 1 }) } });
  await site.skipIntro(); await site.run(1000);
  // cancel keeps everything as it was
  await site.tapSel('#lwGear'); await site.run(300); await site.tapSel('#lwLater'); await site.run(200);
  expect(await site.ev(() => getComputedStyle(document.getElementById('lwModal')).display)).toBe('none');
  // change level to prep
  await openSettings(site, page);
  await site.tapSel('.lwseg button[data-l="prep"]'); await site.tapSel('#lwSave'); await site.run(400);
  expect((await site.lsJSON('lw-profile')).level).toBe('prep');
  // progress report opens and shows grade-1 activity
  await openSettings(site, page);
  await site.tapSel('#lwProg'); await site.run(500);
  await expect(page.locator('.xgModal')).toContainText('כיתה א');
  await site.ev(() => document.querySelectorAll('.xgModal').forEach(m => m.remove()));
  // reset progress: needs two taps
  await openSettings(site, page);
  await site.tapSel('#lwReset'); await site.run(200);
  expect(await site.ls('lw-progress-a-cave')).not.toBeNull();
  await site.tapSel('#lwReset'); await site.run(200);
  expect(await site.ls('lw-progress-a-cave')).toBeNull();
  expect(await site.stars()).toBe(0);
  await noProblems(problems, site);
});
