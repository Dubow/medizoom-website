const assert = require('node:assert/strict');
const { PAGES, dependency, withPage } = require('./support.cjs');

module.exports = async function accessibility(browser) {
  const axePath = dependency('axe-core/axe.min.js', true);
  let scans = 0;
  async function scan(page, label) {
    const violations = await page.evaluate(async () => (await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] }
    })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, message: n.failureSummary })) })));
    assert.deepEqual(violations, [], `${label}: axe violations`);
    scans++;
  }
  for (const file of PAGES) {
    for (const width of [320, 768, 1440]) {
      await withPage(browser, file, { width, height: 900 }, async page => {
        assert.equal(await page.locator('h1').count(), 1, `${file}: one main heading`);
        // Test-only injection; axe is never part of the published website.
        await page.addScriptTag({ path: axePath });
        await scan(page, `${file} ${width}`);
        if (file === 'index.html' && width === 320) {
          await page.locator('.menu-toggle').click();
          await scan(page, 'Open mobile menu');
        }
      });
    }
  }
  return { scans, violations: 0, limitation: 'Automated rules do not replace screen-reader and device testing' };
};
