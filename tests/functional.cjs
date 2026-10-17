const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { PUBLIC, PAGES, CONTACT, VIEWPORTS, withPage } = require('./support.cjs');

async function checkLayout(page, label) {
  const issues = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
    if (el.classList.contains('skip-link')) return false;
    const rect = el.getBoundingClientRect();
    return rect.width && (rect.right > innerWidth + 1 || rect.left < -1);
  }).map(el => el.tagName + '.' + el.className));
  assert.deepEqual(issues, [], `${label}: horizontal overflow`);
}

async function checkNavigation(page) {
  const toggle = page.locator('.menu-toggle');
  const navigation = page.locator('#main-navigation');
  const mobile = await toggle.isVisible();
  if (mobile) {
    assert.equal(await navigation.isVisible(), false);
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Tab');
    assert.equal(await navigation.locator('a').first().evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Escape');
    assert.equal(await navigation.isVisible(), false);
    assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
    await toggle.click();
    await page.locator('#platform h2').click();
    assert.equal(await navigation.isVisible(), false, 'Outside click closes menu');
    await toggle.click();
    await page.locator('.hero .button').focus();
    assert.equal(await navigation.isVisible(), false, 'Focus leaving header closes menu');
  } else {
    assert.equal(await navigation.isVisible(), true);
  }
  for (const link of await navigation.locator('a').all()) {
    const target = await link.getAttribute('href');
    if (mobile) await toggle.click();
    await link.click();
    assert.equal(new URL(page.url()).hash, target);
    if (mobile) {
      assert.equal(await navigation.isVisible(), false);
      assert.equal(await page.locator(target).evaluate(el => el === document.activeElement), true);
    }
  }
}

async function checkLinks(page) {
  const links = await page.evaluate(() => {
    const urls = [...document.querySelectorAll('a[href], link[href], script[src], img[src]')]
      .map(el => el.getAttribute('href') || el.getAttribute('src'));
    for (const el of document.querySelectorAll('[srcset]')) {
      urls.push(...el.getAttribute('srcset').split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    }
    return urls.map(url => new URL(url, document.URL).href);
  });
  for (const href of links) {
    const url = new URL(href);
    assert.ok(['file:', 'https:', 'mailto:'].includes(url.protocol), `Unexpected link protocol: ${href}`);
    if (url.protocol === 'mailto:') {
      assert.equal(url.pathname, CONTACT, 'Approved email recipient');
      assert.equal(url.searchParams.has('cc') || url.searchParams.has('bcc'), false);
      assert.doesNotMatch(decodeURIComponent(url.search), /[\r\n]/, 'Email header injection');
    }
    if (url.protocol !== 'file:') continue;
    const filename = fileURLToPath(url);
    const relative = path.relative(PUBLIC, filename);
    assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative), `Link outside public/: ${href}`);
    assert.ok(fs.existsSync(filename), `Missing target: ${href}`);
    if (url.hash) {
      assert.equal(await page.evaluate(({ html, id }) =>
        !!new DOMParser().parseFromString(html, 'text/html').getElementById(id),
      { html: fs.readFileSync(filename, 'utf8'), id: decodeURIComponent(url.hash.slice(1)) }), true, `Missing fragment: ${href}`);
    }
  }
}

module.exports = async function functional(browser) {
  const navigationLayouts = new Set(['desktop', 'mobile', 'small-mobile', 'short-landscape', 'menu-boundary', 'navigation-breakpoint']);
  for (const { name, width, height } of VIEWPORTS) {
    await withPage(browser, 'index.html', { width, height }, async page => {
      await checkLayout(page, name);
      for (const selector of ['.hero h1', '.hero-status', '.hero-tagline', '.hero .button']) {
        assert.equal(await page.locator(selector).isVisible(), true, `${name}: ${selector} visible`);
        assert.equal(await page.locator(selector).evaluate(el => {
          const item = el.getBoundingClientRect();
          const hero = el.closest('.hero').getBoundingClientRect();
          return item.top >= hero.top && item.bottom <= hero.bottom + 1;
        }), true, `${name}: ${selector} must not be clipped`);
      }
      // Compact portrait and very short landscape compositions may omit the repeated introduction.
      if (height > 700 || (width > 540 && height > 500)) {
        assert.equal(await page.locator('.hero-description').isVisible(), true, `${name}: hero introduction unnecessarily hidden`);
      }
      assert.equal(await page.locator('#platform .eyebrow').evaluate(el => el.getBoundingClientRect().bottom < innerHeight), true, `${name}: next section cue`);
      if (navigationLayouts.has(name)) await checkNavigation(page);
      if (['desktop', 'mobile'].includes(name)) {
        for (const faq of await page.locator('details').all()) {
          await faq.locator('summary').focus();
          await page.keyboard.press('Enter');
          assert.equal(await faq.evaluate(el => el.open), true);
          await page.keyboard.press('Enter');
          assert.equal(await faq.evaluate(el => el.open), false);
        }
      }
      await page.locator('.skip-link').focus();
      assert.equal(await page.locator('.skip-link').evaluate(el => getComputedStyle(el).opacity), '1');
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#main');
    });
  }
  for (const file of PAGES) {
    await withPage(browser, file, { width: 320, height: 900 }, async page => {
      await checkLinks(page);
      const legalLinks = await page.locator('.legal-links a').evaluateAll(nodes => nodes.map(a => a.getAttribute('href')));
      for (const required of ['privacy.html', 'terms.html', 'medical-disclaimer.html']) assert.ok(legalLinks.includes(required));
      if (file !== 'index.html') {
        assert.equal(await page.locator('.legal-links [aria-current="page"]').getAttribute('href'), file);
        for (const width of [320, 768, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          await checkLayout(page, `${file} ${width}`);
        }
        await page.locator('.skip-link').focus();
        await page.keyboard.press('Enter');
        assert.equal(new URL(page.url()).hash, '#main');
        await page.getByRole('link', { name: /back to home/i }).click();
        assert.ok(page.url().endsWith('/index.html'));
      }
    });
  }
  await withPage(browser, 'index.html', { width: 390, height: 844 }, async page => {
    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    await page.locator('#main-navigation a').first().focus();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
    assert.equal(await page.locator('#main-navigation').isVisible(), true);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.activeElement === document.querySelector('.menu-toggle'));
    assert.equal(await page.locator('#main-navigation').isVisible(), false);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => document.activeElement === document.querySelector('#main-navigation a'));
  });
  await withPage(browser, 'index.html', { width: 390, height: 844 }, async page => {
    assert.equal(await page.locator('.menu-toggle').isVisible(), false);
    for (const link of await page.locator('#main-navigation a').all()) assert.equal(await link.isVisible(), true);
    await page.locator('#main-navigation a[href="#patients"]').click();
    assert.equal(new URL(page.url()).hash, '#patients');
    assert.equal(await page.locator('.demo-request').getAttribute('href'), `mailto:${CONTACT}?subject=MediZoom%20private%20demo%20request`);
  }, { javaScriptEnabled: false });
  return { homepageLayouts: VIEWPORTS.length, linkedPages: PAGES.length, navigationLayouts: navigationLayouts.size, noJavaScript: 'passed' };
};
