const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const QA = path.join(ROOT, '.qa');
const PAGES = fs.readdirSync(PUBLIC).filter(file => file.endsWith('.html')).sort();
const ORIGIN = 'https://medizoom.care/';
const CONTACT = 'support@medizoom.care';
const VIEWPORTS = [
  ['desktop', 1440, 900], ['wide', 1920, 1080], ['tablet', 768, 1024],
  ['mobile', 390, 844], ['small-mobile', 320, 568], ['landscape', 844, 390],
  ['large-mobile', 480, 800], ['small-tablet', 600, 800],
  ['laptop', 1366, 768], ['short-desktop', 1440, 650], ['short-tablet', 768, 640],
  ['small-landscape', 600, 390], ['narrow-mobile', 280, 653],
  ['compact-mobile', 360, 640], ['navigation-breakpoint', 851, 700],
  ['compact-desktop', 1024, 768], ['short-mobile', 320, 480],
  ['short-landscape', 844, 320], ['medium-boundary', 700, 660],
  ['tablet-boundary', 701, 660], ['menu-boundary', 850, 700],
  ['portrait-boundary', 540, 700], ['landscape-boundary', 541, 700]
].map(([name, width, height]) => ({ name, width, height }));

function dependency(name, resolveOnly = false) {
  try {
    const location = require.resolve(name, { paths: [ROOT, QA] });
    return resolveOnly ? location : require(location);
  } catch (error) {
    throw new Error(`Cannot load ${name}. Install the test-only dependencies using README.md.`, { cause: error });
  }
}

async function withPage(browser, file, viewport, check, options = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', ...options });
  const page = await context.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.route(/^https?:/, route => {
    externalRequests.push(route.request().url());
    return route.abort();
  });
  try {
    await page.goto(pathToFileURL(path.join(PUBLIC, file)).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode()));
    });
    const result = await check(page);
    assert.deepEqual(errors, [], `${file}: JavaScript errors`);
    assert.deepEqual(externalRequests, [], `${file}: unexpected external requests`);
    return result;
  } finally {
    await context.close();
  }
}

module.exports = { ROOT, PUBLIC, QA, PAGES, ORIGIN, CONTACT, VIEWPORTS, dependency, withPage };
