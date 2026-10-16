// Number planet: fly there from the map, Lilo's yard, game 1 in every level, stars counted for this island only.
const { test, expect, noProblems, LEVELS } = require('../support/fixtures');

for (const lv of LEVELS) {
  test(`כוכב המספרים: אתגר המספרים — רמה ${lv}`, async ({ site, problems }) => {
    await site.boot({ level: lv, seed: 5 });
    await site.skipIntro();
    await site.enterIsland('num');
    await site.until(() => window.YTEST.games.planet.state().yard, null, { what: 'Lilo yard open' });
    await site.run(1500);
    await site.tapSel('.plS[data-n="1"]'); await site.run(1500);
    await site.until(() => window.YTEST.games.planet.state().game, null, { what: 'game 1 open' });
    const wallet0 = await site.stars();
    await site.play('planet', { stepMs: 200, maxSteps: 3000 });
    await site.run(4000);
    expect(+(await site.ls('lw-num-stars')), 'number-planet stars').toBe(20);
    expect(await site.stars() - wallet0, 'shared wallet also grows (for the shop)').toBe(20);
    const prog = await site.lsJSON('lw-progress-' + lv + '-num1');
    expect(prog && prog.rounds, 'rounds saved').toBeGreaterThanOrEqual(1);
    await site.shot('end');
    await noProblems(problems, site);
  });
}
