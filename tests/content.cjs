const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, PUBLIC, PAGES, ORIGIN, CONTACT, withPage } = require('./support.cjs');

// Publication settings. HTML stays readable without JavaScript or a build.
const LAUNCH_MONTH = '2027-02';
const launchLabel = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  .format(new Date(`${LAUNCH_MONTH}-01T00:00:00Z`));
const monthYear = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/g;
const approvedMedia = new Set([
  'assets/consultation-desktop.webp', 'assets/consultation-mobile.webp',
  'assets/medizoom-mark.svg', 'assets/favicon.svg'
]);

function checkLaunchText(text, label) {
  for (const date of text.match(monthYear) || []) assert.equal(date, launchLabel, `${label}: inconsistent launch month`);
}

function requireTopics(text, topics, label) {
  for (const [topic, pattern] of Object.entries(topics)) assert.match(text, pattern, `${label}: missing ${topic}`);
}

async function checkPublication(page, file) {
  const text = (await page.locator('main').textContent()).replace(/\s+/g, ' ').trim();
  assert.equal(await page.locator('form, iframe, input, textarea').count(), 0, `${file}: unapproved collection or embed`);
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie })),
    { local: 0, session: 0, cookies: '' }, 'No visitor tracking storage');
  if (file === 'index.html') {
    const preview = page.locator('#product-preview');
    // The public preview is text-only; other reviewed illustrations are permitted.
    assert.equal(await preview.locator('img, picture, video, iframe, canvas, object, embed').count(), 0, 'Public screenshots need explicit approval');
    const demo = new URL(await page.locator('.demo-request').getAttribute('href'));
    assert.equal(demo.protocol, 'mailto:');
    assert.equal(demo.pathname, CONTACT);
    assert.match(demo.searchParams.get('subject') || '', /private.*demo/i);
    requireTopics(await preview.textContent(), {
      'manual demo review': /(?:manual(?:ly)?|review(?:ed)?).*(?:request|demonstration)|(?:request|demonstration).*manual(?:ly)?/is,
      'no automatic access': /(?:does not|will not|no)[^.]*automatic[^.]*access/i,
      'sensitive-information warning': /(?:do not|don't|never)[^.]*patient information|(?:do not|don't|never)[^.]*medical records/i
    }, 'Product preview');
    requireTopics(text, { 'pre-launch availability': /not (?:yet )?(?:open|available)|in development|pre-launch/i }, file);
    const promotion = await page.locator('.hero, .platform, .journey, .product-preview, .audiences, .about, .contact').allTextContents();
    assert.doesNotMatch(promotion.join(' '), /\b(Netlify|Namecheap|PostgreSQL|MySQL|Spring Boot|React Native|Expo|backend|database|deployment architecture|university application|academic portfolio)\b/i);
  } else {
    assert.doesNotMatch(text, /\b(?:Netlify|Namecheap)\b/i, 'No supplier branding in legal copy');
  }
  if (file === 'privacy.html') requireTopics(text, {
    'website scope': /pre-launch|information website/i,
    'technical request information': /technical request|access logs/i,
    'hosting recipients': /hosting.*providers/i,
    'email recipients': /email.*providers/i,
    'international processing': /outside Kenya|cross-border|international transfer/i,
    'retention': /retention|retain(?:ed)?/i,
    'safeguards': /safeguards/i,
    'rights': /access personal information|right.*access/i,
    'privacy authority': /Office of the Data Protection Commissioner|ODPC/i
  }, file);
  if (file === 'terms.html') requireTopics(text, {
    'target rather than firm launch': /not a (?:confirmed|fixed|guaranteed).*date/i,
    'manual demo arrangements': /manual(?:ly)?/i,
    'nonclinical website': /(?:does not|not).*medical advice/i,
    'non-excludable rights': /cannot lawfully be excluded|non-excludable/i,
    'separate clinical terms': /separate service terms|separate clinical terms/i
  }, file);
  if (file === 'medical-disclaimer.html') {
    const warning = page.locator('.care-note');
    assert.equal(await warning.isVisible(), true, 'Emergency notice must remain visible');
    requireTopics(await warning.textContent(), {
      'emergency guidance': /emergenc(?:y|ies)/i,
      'do not await a response': /(?:do not|don't|never) wait/i
    }, 'Emergency notice');
    requireTopics(text, {
      'no clinical relationship': /(?:does not|no)[^.]*patient-doctor relationship/i,
      'demo is not care': /(?:not|no)[^.]*medical consultations/i,
      'remote care limitations': /in-person|physical examination/i,
      'no guaranteed prescription': /(?:does not|no)[^.]*guarantee[^.]*prescription/i,
      'planned verification': /planned credential|planned verification/i,
      'nonclinical email': /not monitored as an emergency or clinical|not a clinical.*channel/i,
      'professional duties retained': /does not waive professional duties|professional duties remain/i,
      'not clinical consent': /not consent to treatment/i
    }, file);
    assert.equal(await page.locator('a[href="https://registers.kmpdc.go.ke/"]').count() > 0, true);
  }
}

function checkPublishFiles() {
  function inspect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(PUBLIC, absolute).split(path.sep).join('/');
      assert.equal(entry.isSymbolicLink(), false, `Symlink may publish outside files: ${relative}`);
      if (entry.isDirectory()) { inspect(absolute); continue; }
      assert.doesNotMatch(relative, /(?:^|\/)(?:\.env|\.git|backups|private)|\.(?:java|sql|pem|key|p12|pfx|map|ts|tsx)$/i, 'Private source/config in public/');
      if (/\.(?:webp|png|jpe?g|gif|svg|avif|mp4|webm|pdf)$/i.test(relative)) {
        assert.ok(approvedMedia.has(relative), `Unreviewed public media: ${relative}. Record approval in ASSETS.md before updating this list.`);
      }
      if (/\.(?:html|css|js|txt|xml|svg)$/i.test(relative)) {
        const source = fs.readFileSync(absolute, 'utf8');
        assert.doesNotMatch(source, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\b(?:LIVEKIT_API_SECRET|DB_PASSWORD|MAIL_PASSWORD)\s*[:=]|https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.|10\.\d+\.)/i, `Possible credential/internal URL: ${relative}`);
      }
    }
  }
  inspect(PUBLIC);
  const config = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  assert.match(config, /^\s*publish\s*=\s*"public"\s*$/m, 'Publish only public/');
  for (const directive of ["default-src 'none'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'"]) {
    assert.ok(config.includes(directive), `Missing security restriction: ${directive}`);
  }
  assert.doesNotMatch(config, /unsafe-inline|unsafe-eval/);
}

module.exports = async function content(browser) {
  checkPublishFiles();
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  checkLaunchText(readme, 'README');
  const titles = new Set();
  const canonicals = [];
  for (const file of PAGES) {
    await withPage(browser, file, { width: 1440, height: 900 }, async page => {
      const title = await page.title();
      assert.ok(title.trim() && !titles.has(title), `${file}: nonempty unique title`);
      titles.add(title);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).trim(), `${file}: description required`);
      const canonical = new URL(file === 'index.html' ? '' : file, ORIGIN).href;
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonical);
      canonicals.push(canonical);
      const copy = await page.locator('body').evaluate(el => {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.document-meta').forEach(node => node.remove());
        return clone.textContent.replace(/\s+/g, ' ');
      });
      for (const brand of copy.match(/\bmedizoom\b(?!\.care)/gi) || []) assert.equal(brand, 'MediZoom', `${file}: brand casing`);
      checkLaunchText(copy, file);
      const dates = page.locator('time:not(.document-meta time)');
      if (['index.html', 'terms.html'].includes(file)) assert.ok(await dates.count(), `${file}: launch target missing`);
      for (const time of await dates.all()) {
        assert.equal(await time.getAttribute('datetime'), LAUNCH_MONTH, `${file}: machine-readable launch month`);
        assert.equal((await time.textContent()).trim(), launchLabel, `${file}: visible launch month`);
        assert.match(await time.locator('..').textContent(), /target/i, `${file}: qualified launch target`);
      }
      for (const meta of await page.locator('meta[name="description"], meta[property="og:description"]').all()) {
        checkLaunchText(await meta.getAttribute('content'), `${file} metadata`);
      }
      for (const link of await page.locator('a[href="terms.html"]').all()) assert.equal((await link.textContent()).trim(), 'Terms and Services');
      assert.deepEqual(await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      }), [], `${file}: duplicate IDs`);
      await checkPublication(page, file);
    });
  }
  await withPage(browser, 'index.html', { width: 1440, height: 900 }, async page => {
    const symbolPaths = [];
    for (const asset of ['medizoom-mark.svg', 'favicon.svg']) {
      symbolPaths.push(await page.evaluate(source => {
        const svg = new DOMParser().parseFromString(source, 'image/svg+xml');
        if (svg.querySelector('parsererror')) throw new Error('Invalid brand SVG');
        if (svg.querySelector('script, foreignObject, image, use')) throw new Error('Brand SVG must be self-contained');
        return [...svg.querySelectorAll('path')].map(node => ({
          d: node.getAttribute('d'), fillRule: node.getAttribute('fill-rule')
        }));
      }, fs.readFileSync(path.join(PUBLIC, 'assets', asset), 'utf8')));
    }
    assert.ok(symbolPaths[0].length, 'Brand symbol must contain artwork');
    assert.deepEqual(symbolPaths[1], symbolPaths[0], 'Favicon uses the same brand symbol');
    const urls = await page.evaluate(xml => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
      return [...doc.querySelectorAll('loc')].map(node => node.textContent.trim());
    }, fs.readFileSync(path.join(PUBLIC, 'sitemap.xml'), 'utf8'));
    assert.deepEqual(urls.sort(), canonicals.sort(), 'Sitemap matches public pages');
  });
  assert.ok(fs.readFileSync(path.join(PUBLIC, 'robots.txt'), 'utf8').includes(`Sitemap: ${ORIGIN}sitemap.xml`));
  return { pages: PAGES.length, launchTarget: launchLabel, publicationChecks: 'passed; manual legal and sensitive-data review still required' };
};

module.exports.checkPublication = checkPublication;
module.exports.checkLaunchText = checkLaunchText;
