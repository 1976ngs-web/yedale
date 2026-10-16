// Every Hebrew-island game, in every level: enter from the courtyard, play to the end with real taps/drags,
// and check stars were awarded and progress was saved — with zero page errors or missing files.
const { test, expect, noProblems, LEVELS } = require('../support/fixtures');

const GAMES = [
  { g: 'ff', hook: 'isle', key: 'ff', min: 60, what: 'הפנסים (לילה שלם, 6 פנסים)' },
  { g: 'lib', hook: 'isle', key: 'lib', min: 10, what: 'הספרייה', until: () => { const s = window.YTEST.games.isle.state(); return s.lib && s.lib.r >= 1; } },
  { g: 'cave', hook: 'xg', key: 'cave', min: 10, what: 'מערת הקריסטלים' },
  { g: 'bridge', hook: 'xg', key: 'bridge', min: 10, what: 'גשר הצלילים' },
  { g: 'wheel', hook: 'xg', key: 'wheel', min: 10, what: 'גלגל המים' },
  { g: 'cat', hook: 'xg', key: 'cat', min: 20, what: 'הזחל הרעב' },
  { g: 'race', hook: 'xg', key: 'race', min: 20, what: 'מרוץ הינשוף' }
];

for (const lv of LEVELS) {
  for (const G of GAMES) {
    test(`${G.what} — רמה ${lv}`, async ({ site, problems }) => {
      await site.boot({ level: lv, seed: 7 });
      await site.skipIntro();
      await site.enterIsland('heb');
      await site.station(G.g);
      const before = await site.stars();
      await site.play(G.hook, { until: G.until });
      await site.run(3000);
      const after = await site.stars();
      expect(after - before, 'stars earned').toBeGreaterThanOrEqual(G.min);
      const prog = await site.lsJSON('lw-progress-' + lv + '-' + G.key);
      expect(prog, 'progress saved for this level').not.toBeNull();
      await site.shot('end');
      await noProblems(problems, site);
    });
  }
}
