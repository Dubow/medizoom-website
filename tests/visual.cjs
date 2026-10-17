const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { QA, PAGES, VIEWPORTS, withPage } = require('./support.cjs');

module.exports = async function visual(browser, { compare, updateBaselines }) {
  const root = path.join(QA, 'visual');
  const current = path.join(root, 'current');
  const baseline = path.join(root, 'baseline');
  fs.mkdirSync(current, { recursive: true });
  const manifest = {
    environment: { browser: browser.version(), platform: process.platform, arch: process.arch, scale: 1 },
    images: {}
  };
  async function capture(page, filename, fullPage) {
    const buffer = await page.screenshot({ path: path.join(current, filename), fullPage, animations: 'disabled' });
    manifest.images[filename] = createHash('sha256').update(buffer).digest('hex');
  }
  for (const { name, width, height } of VIEWPORTS) {
    await withPage(browser, 'index.html', { width, height }, async page => {
      await capture(page, `${name}-top.png`, false);
      if (['desktop', 'mobile', 'small-mobile'].includes(name)) {
        await capture(page, `${name}-full.png`, true);
      }
      if (['mobile', 'short-landscape'].includes(name)) {
        await page.locator('.menu-toggle').click();
        await capture(page, `${name}-menu.png`, false);
      }
    });
  }
  for (const file of PAGES.filter(file => file !== 'index.html')) {
    for (const width of [320, 1440]) {
      await withPage(browser, file, { width, height: 900 }, page =>
        capture(page, `${path.basename(file, '.html')}-${width}.png`, true));
    }
  }
  fs.writeFileSync(path.join(current, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Baselines are local review artifacts. Capturing alone never approves a new design.
  if (updateBaselines) {
    fs.mkdirSync(baseline, { recursive: true });
    for (const filename of [...Object.keys(manifest.images), 'manifest.json']) {
      fs.copyFileSync(path.join(current, filename), path.join(baseline, filename));
    }
    return { screenshots: Object.keys(manifest.images).length, comparison: 'baseline explicitly saved; review images before relying on it' };
  }
  if (!compare) return { screenshots: Object.keys(manifest.images).length, comparison: 'not run; use visual --compare with a reviewed baseline' };

  const manifestPath = path.join(baseline, 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'No visual baseline. Review captures before using visual --update-baselines.');
  const expected = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.deepEqual(manifest.environment, expected.environment, 'Visual environment changed; review fresh captures instead of silently accepting a new baseline.');
  const changed = [...new Set([...Object.keys(expected.images), ...Object.keys(manifest.images)])]
    .filter(file => expected.images[file] !== manifest.images[file] || !fs.existsSync(path.join(baseline, file)));
  fs.writeFileSync(path.join(root, 'differences.json'), JSON.stringify(changed, null, 2));
  assert.deepEqual(changed, [], 'Visual changes require review. Compare .qa/visual/baseline with .qa/visual/current; see differences.json.');
  return { screenshots: Object.keys(manifest.images).length, comparison: 'identical to baseline' };
};
