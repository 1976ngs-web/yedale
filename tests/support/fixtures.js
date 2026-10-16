// Shared test setup: test-mode bootstrap, fake clock, problem collection, and a game driver.
const base = require('@playwright/test');
const fs = require('fs'), path = require('path');
const INIT = fs.readFileSync(path.join(__dirname, 'ytest-init.js'), 'utf8');
const LEVELS = ['prep', 'a', 'b'];

const test = base.test.extend({
  problems: async ({}, use) => { await use([]); },
  site: async ({ page, problems }, use, info) => {
    page.on('pageerror', e => problems.push('page error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console error: ' + m.text()); });
    page.on('response', r => { if (r.status() >= 400) problems.push(r.status() + ' ' + r.url().replace(/^https?:\/\/[^/]+/, '')); });
    page.on('requestfailed', r => { const f = r.failure(); if (f && !/ERR_ABORTED/.test(f.errorText)) problems.push('request failed: ' + r.url() + ' ' + f.errorText); });
    // Google Fonts: answered locally with empty CSS so runs are offline and deterministic.
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    const site = {
      page,
      /** Boot the site with a given saved state. opts: {level, fresh, seed, store:{key:value}} */
      async boot(opts = {}) {
        const cfg = { seed: opts.seed || 1 };
        const store = {};
        if (!opts.fresh) {
          store['lw-intro-seen'] = '1';
          store['lw-profile'] = JSON.stringify({ level: opts.level || 'a', setupDone: true, letterRead: true, name: '', vol: { music: 1, voice: 1, fx: 1 } });
        }
        Object.assign(store, opts.store || {});
        await page.addInitScript(([c, st]) => {
          window.__YT_CFG = c;
          if (!sessionStorage.getItem('yt-seeded')) { sessionStorage.setItem('yt-seeded', '1'); localStorage.clear(); for (const k in st) localStorage.setItem(k, st[k]); }
        }, [cfg, store]);
        await page.addInitScript(INIT);
        await page.clock.install({ time: new Date('2026-10-16T09:00:00+03:00') });
        await page.goto('/');
        await site.run(1500);
      },
      async run(ms) { await page.clock.runFor(ms); },
      async center(sel) { return page.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null; return [r.left + r.width / 2, r.top + r.height / 2]; }, sel); },
      async tapSel(sel) { const c = await site.center(sel); if (!c) throw new Error('nothing to tap: ' + sel); await site.tap(c[0], c[1]); },
      /** Wait (in page time) until fn() is truthy. */
      async until(fn, arg, { max = 30000, step = 200, what = 'condition' } = {}) {
        for (let t = 0; t <= max; t += step) { if (await page.evaluate(fn, arg)) return; await site.run(step); }
        throw new Error('timed out waiting for ' + what);
      },
      /** Opening book → skip button (shown from the second visit on). */
      async skipIntro() { await site.until(() => { const s = document.getElementById('skip'); return s && getComputedStyle(s).display !== 'none'; }, null, { what: 'skip button' }); await site.tapSel('#skip'); await site.until(() => !document.body.classList.contains('introOn'), null, { what: 'map after intro' }); await site.run(2500); },
      /** On the map: fly to an island (heb/num/eng) and enter it, with real taps. */
      async enterIsland(id) {
        await site.tapSel('#i-' + id); await site.until(i => window.__atIsl === i, id, { what: 'plane at island ' + id });
        await site.run(800); await site.tapSel('#i-' + id); await site.run(2500);
      },
      async station(g) { await site.until(q => { const e = document.querySelector(q); return e && e.getBoundingClientRect().width > 0; }, '.isS[data-g="' + g + '"]', { what: 'station ' + g }); await site.tapSel('.isS[data-g="' + g + '"]'); await site.run(1500); },
      async ls(key) { return page.evaluate(k => localStorage.getItem(k), key); },
      async lsJSON(key) { return page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'BAD JSON'; } }, key); },
      async stars() { return page.evaluate(() => { try { return (JSON.parse(localStorage.getItem('learn-world') || '{}').coins) || 0; } catch (e) { return -1; } }); },
      async ev(fn, arg) { return page.evaluate(fn, arg); },
      /** Real input at viewport coordinates (touch on phones, mouse on desktop). */
      async tap(x, y) {
        if (info.project.use.hasTouch) await page.touchscreen.tap(x, y);
        else await page.mouse.click(x, y);
      },
      async drag(from, to) {
        await page.mouse.move(from[0], from[1]); await page.mouse.down();
        const n = 8; for (let i = 1; i <= n; i++) { await page.mouse.move(from[0] + (to[0] - from[0]) * i / n, from[1] + (to[1] - from[1]) * i / n); await site.run(16); }
        await page.mouse.up();
      },
      /** Drive a registered game until it reports done. */
      async play(name, { maxSteps = 4000, stepMs = 300, untilDone = true, until = null } = {}) {
        let steps = 0, acts = 0, last = null;
        for (; steps < maxSteps; steps++) {
          const a = await page.evaluate(n => (window.YTEST.games[n] ? window.YTEST.games[n].next() : { kind: 'missing' }), name);
          last = a.kind;
          if (process.env.YT_DEBUG && steps % 40 === 0) console.log(name, steps, JSON.stringify(a), JSON.stringify(await page.evaluate(n => window.YTEST.games[n].state(), name)));
          if (a.kind === 'missing') throw new Error('game hook not registered: ' + name);
          if (a.kind === 'done') return { steps, acts };
          if (until && await page.evaluate(until)) return { steps, acts };
          if (a.kind === 'none' && !untilDone) return { steps, acts };
          if (a.kind === 'click') { await site.tap(a.x, a.y); acts++; }
          else if (a.kind === 'drag') { await site.drag(a.from, a.to); acts++; }
          await site.run(stepMs);
        }
        throw new Error(name + ' did not finish after ' + steps + ' steps (last: ' + last + ', actions: ' + acts + ')');
      },
      async shot(name) { return page.screenshot({ path: info.outputPath(name + '.png') }); }
    };
    await use(site);
  }
});

/** Fail with a readable list if anything went wrong in the page (errors, missing files, and any line of
 *  narration that had no recording or failed to play — read from the site's own voice log). */
async function noProblems(problems, allow = [], site = null) {
  if (allow && allow.page) { site = allow; allow = []; }
  if (site) {
    const vlog = await site.page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lw-vo-log') || '[]'); } catch (e) { return []; } });
    vlog.forEach(r => { if (!/^retry/.test(r[1])) problems.push('voice ' + r[1] + ': ' + r[2]); });
  }
  const real = problems.filter(p => !allow.some(a => (a instanceof RegExp ? a.test(p) : p.includes(a))));
  base.expect(real, 'problems in the page').toEqual([]);
}

module.exports = { test, expect: base.expect, noProblems, LEVELS };
