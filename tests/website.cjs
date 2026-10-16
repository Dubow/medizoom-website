const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const dependencyPaths = [process.cwd(), path.resolve('.qa')];
const { chromium } = require(require.resolve('playwright', { paths: dependencyPaths }));
const axePath = require.resolve('axe-core/axe.min.js', { paths: dependencyPaths });
fs.mkdirSync('.qa', { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const [name, width, height] of [
      ['desktop', 1440, 900], ['wide', 1920, 1080], ['tablet', 768, 1024],
      ['mobile', 390, 844], ['small-mobile', 320, 568], ['landscape', 844, 390],
      ['large-mobile', 480, 800], ['small-tablet', 600, 800],
      ['laptop', 1366, 768], ['short-desktop', 1440, 650],
      ['short-tablet', 768, 640], ['small-landscape', 600, 390]
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors = [];
      const requests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => requests.push(request.url()));
      await page.goto(pathToFileURL(path.resolve('public/index.html')).href);
      await page.locator('.hero-image img').evaluate(img => img.decode());
      assert.equal(await page.locator('.skip-link').evaluate(el => getComputedStyle(el).opacity), '0');
      const checks = await page.evaluate(() => {
        const html = document.documentElement;
        const brokenLinks = [...document.querySelectorAll('a[href^="#"]')]
          .filter(a => !document.querySelector(a.getAttribute('href')))
          .map(a => a.getAttribute('href'));
        const overflows = [...document.querySelectorAll('body *')].filter(el => {
          if (el.classList.contains('skip-link')) return false;
          const rect = el.getBoundingClientRect();
          return rect.width && (rect.right > innerWidth + 1 || rect.left < -1);
        }).map(el => el.tagName + '.' + el.className);
        return {
          pageOverflow: html.scrollWidth > innerWidth,
          overflows,
          brokenLinks,
          h1Count: document.querySelectorAll('h1').length,
          imageLoaded: document.querySelector('.hero-image img').naturalWidth > 0,
          heroBottom: document.querySelector('.hero').getBoundingClientRect().bottom,
          nextSectionVisible: document.querySelector('.platform .eyebrow').getBoundingClientRect().bottom < innerHeight,
          viewportHeight: innerHeight,
          imageSource: document.querySelector('.hero-image img').currentSrc,
          mailLinks: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.href)
        };
      });
      assert.equal(checks.pageOverflow, false, name + ' horizontal page overflow');
      assert.deepEqual(checks.overflows, [], name + ' overflowing elements');
      assert.deepEqual(checks.brokenLinks, [], name + ' broken fragment links');
      assert.equal(checks.h1Count, 1);
      assert.equal(checks.imageLoaded, true);
      assert.equal(checks.nextSectionVisible, true, name + ' next section not visible');
      assert.equal(checks.mailLinks.every(link => link.startsWith('mailto:support@medizoom.care')), true);
      assert.equal(await page.locator('#engineering, #research, #project').count(), 0);
      assert.equal(await page.locator('.main-nav a').count(), 5);
      assert.equal(await page.locator('footer nav:not(.legal-links), .image-credit').count(), 0);
      assert.equal(await page.locator('footer .legal-links a').count(), 3);
      assert.equal(await page.locator('time[datetime="2026-12-20"]').count(), 4);
      assert.equal((await page.locator('meta[name="description"]').getAttribute('content')).includes('20 December 2026'), true);
      assert.deepEqual(errors, []);
      assert.equal(requests.every(url => url.startsWith('file:')), true, 'Unexpected external request');
      await page.screenshot({ path: path.resolve('.qa/' + name + '-top.png') });
      await page.screenshot({ path: path.resolve('.qa/' + name + '-full.png'), fullPage: true });
      if (['desktop', 'mobile', 'small-mobile'].includes(name)) {
        for (const section of ['platform', 'how-it-works', 'patients', 'doctors', 'doctor-verification', 'about', 'contact']) {
          await page.locator('#' + section).screenshot({ path: path.resolve('.qa/' + name + '-' + section + '.png') });
        }
      }
      for (const faq of await page.locator('details').all()) {
        await faq.locator('summary').focus();
        await page.keyboard.press('Enter');
        assert.equal(await faq.getAttribute('open'), '');
        await page.keyboard.press('Enter');
        assert.equal(await faq.getAttribute('open'), null);
      }
      const toggle = page.locator('.menu-toggle');
      const navigation = page.locator('.main-nav');
      if (width <= 850) {
        assert.equal(await toggle.isVisible(), true);
        assert.equal(await navigation.isVisible(), false);
        await toggle.focus();
        await page.keyboard.press('Enter');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(await navigation.isVisible(), true);
        await page.screenshot({ path: path.resolve('.qa/' + name + '-menu.png') });
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.main-nav a:first-child').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
        await toggle.click();
        await page.locator('.platform h2').click();
        assert.equal(await navigation.isVisible(), false, name + ' outside click closes menu');
        await toggle.click();
        await page.locator('.hero .button').focus();
        assert.equal(await navigation.isVisible(), false, name + ' focus leaving header closes menu');
      } else {
        assert.equal(await toggle.isVisible(), false);
        assert.equal(await navigation.isVisible(), true);
      }
      for (const navLink of await page.locator('.main-nav a').all()) {
        const target = await navLink.getAttribute('href');
        if (width <= 850) await toggle.click();
        await navLink.click();
        assert.ok(page.url().endsWith(target), name + ' navigation to ' + target);
        if (width <= 850) {
          assert.equal(await navigation.isVisible(), false);
          assert.equal(await page.locator(target).evaluate(el => el === document.activeElement), true);
        }
      }
      await page.locator('.skip-link').focus();
      assert.equal(await page.locator('.skip-link').evaluate(el => getComputedStyle(el).opacity), '1');
      await page.keyboard.press('Enter');
      assert.ok(page.url().endsWith('#main'));
      results.push({ name, ...checks, consoleErrors: errors.length, externalRequests: 0, keyboardFaq: 'pass', skipLink: 'pass', navigation: 'pass' });
      await page.close();
    }
    await checkPages(browser);
    const resizePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await resizePage.goto(pathToFileURL(path.resolve('public/index.html')).href);
    await resizePage.locator('.menu-toggle').click();
    await resizePage.setViewportSize({ width: 1440, height: 900 });
    await resizePage.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
    assert.equal(await resizePage.locator('.main-nav').isVisible(), true);
    assert.equal(await resizePage.locator('.menu-toggle').isVisible(), false);
    await resizePage.setViewportSize({ width: 390, height: 844 });
    assert.equal(await resizePage.locator('.main-nav').isVisible(), false);
    await resizePage.close();

    const fallbackPage = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await fallbackPage.goto(pathToFileURL(path.resolve('public/index.html')).href);
    assert.equal(await fallbackPage.locator('.menu-toggle').isVisible(), false);
    for (const link of await fallbackPage.locator('.main-nav a').all()) assert.equal(await link.isVisible(), true);
    await fallbackPage.locator('.main-nav a[href="#patients"]').click();
    assert.ok(fallbackPage.url().endsWith('#patients'));
    await fallbackPage.close();

    fs.writeFileSync('.qa/results.json', JSON.stringify(results, null, 2));
    console.log('Menu resize and JavaScript-disabled fallback: passed');
    console.log('Passed ' + results.length + ' viewports; results and screenshots saved in .qa/');
  } finally {
    await browser.close();
  }
}
async function checkPages(browser) {
  const files = ['index.html', 'privacy.html', 'terms.html', 'medical-disclaimer.html'];
  const sources = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join('public', file), 'utf8')]));
  const titles = new Set();
  let accessibilityScans = 0;
  for (const file of files) {
    for (const width of [320, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(path.resolve('public', file)).href);
      assert.equal(await page.locator('h1').count(), 1, file + ' single main heading');
      const expectedUrl = 'https://medizoom.care/' + (file === 'index.html' ? '' : file);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), expectedUrl);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      assert.ok(description.length >= 60 && description.length <= 170, file + ' description length');
      if (width === 320) {
        const title = await page.title();
        assert.ok(!titles.has(title), 'Unique page titles');
        titles.add(title);
      }
      const issues = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('body *')];
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        return {
          overflow: elements.filter(el => {
            if (el.classList.contains('skip-link')) return false;
            const rect = el.getBoundingClientRect();
            return rect.width && (rect.right > innerWidth + 1 || rect.left < -1);
          }).map(el => el.tagName + '.' + el.className),
          duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
          hasForms: !!document.querySelector('form'),
          missingAlt: document.querySelectorAll('img:not([alt])').length,
          storedData: localStorage.length + sessionStorage.length
        };
      });
      assert.deepEqual(issues, { overflow: [], duplicateIds: [], hasForms: false, missingAlt: 0, storedData: 0 }, file + ' at ' + width);
      const links = await page.locator('a[href], link[rel="stylesheet"], script[src], img[src], source[srcset]').evaluateAll(nodes =>
        nodes.map(el => new URL(el.getAttribute('href') || el.getAttribute('src') || el.getAttribute('srcset'), document.URL).href)
      );
      for (const href of links) {
        const url = new URL(href);
        if (url.protocol !== 'file:') continue;
        assert.ok(fs.existsSync(fileURLToPath(url)), 'Missing local target: ' + href);
        if (url.hash) {
          const targetFile = path.basename(fileURLToPath(url));
          assert.ok(sources[targetFile], 'Unknown HTML target: ' + href);
          assert.equal(await page.evaluate(({ html, id }) =>
            !!new DOMParser().parseFromString(html, 'text/html').getElementById(id),
            { html: sources[targetFile], id: decodeURIComponent(url.hash.slice(1)) }), true, href);
        }
      }
      // axe is injected only into the test browser, never shipped to visitors.
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
        return result.violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target), summary: v.nodes.map(n => n.failureSummary) }));
      });
      assert.deepEqual(violations, [], file + ' accessibility at ' + width + ': ' + JSON.stringify(violations));
      accessibilityScans++;
      if (file === 'index.html' && width === 320) {
        await page.locator('.menu-toggle').click();
        const menuViolations = await page.evaluate(async () => (await axe.run(document)).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
        assert.deepEqual(menuViolations, [], 'Open mobile menu accessibility');
        await page.keyboard.press('Escape');
        accessibilityScans++;
      }
      if (file !== 'index.html') {
        assert.equal(await page.locator('.legal-links [aria-current="page"]').count(), 1);
        await page.screenshot({ path: path.resolve('.qa', file.replace('.html', '') + '-' + width + '.png'), fullPage: true });
        await page.locator('.skip-link').focus();
        await page.keyboard.press('Enter');
        assert.ok(page.url().endsWith('#main'));
        await page.getByRole('link', { name: 'Back to home' }).click();
        assert.ok(page.url().endsWith('/index.html'));
      }
      assert.deepEqual(errors, [], file + ' JavaScript errors');
      await page.close();
    }
  }
  const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  const parserPage = await browser.newPage();
  const urls = await parserPage.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
    return [...doc.querySelectorAll('loc')].map(node => node.textContent);
  }, sitemap);
  assert.deepEqual(urls, files.map(file => 'https://medizoom.care/' + (file === 'index.html' ? '' : file)));
  assert.match(fs.readFileSync('public/robots.txt', 'utf8'), /Sitemap: https:\/\/medizoom\.care\/sitemap\.xml/);
  await parserPage.close();
  console.log('All local links, metadata, sitemap and ' + accessibilityScans + ' axe accessibility scans: passed');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
