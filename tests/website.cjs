const fs = require('node:fs');
const path = require('node:path');
const { ROOT, QA, dependency } = require('./support.cjs');

const suiteNames = ['functional', 'accessibility', 'content', 'visual'];

async function main() {
  const [selection = 'all', ...flags] = process.argv.slice(2);
  if (selection === '--help') {
    console.log('node tests/website.cjs [all|functional|accessibility|content|visual] [--compare|--update-baselines]');
    return;
  }
  if (!['all', ...suiteNames].includes(selection) ||
      flags.some(flag => !['--compare', '--update-baselines'].includes(flag)) ||
      (flags.length && !['all', 'visual'].includes(selection)) ||
      (flags.includes('--update-baselines') && (selection !== 'visual' || flags.length !== 1))) {
    throw new Error('Invalid arguments. Run node tests/website.cjs --help.');
  }
  const { chromium } = dependency('playwright');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { startedAt: new Date().toISOString(), suites: {} };
  try {
    for (const name of selection === 'all' ? suiteNames : [selection]) {
      console.log(`Running ${name} checks...`);
      try {
        const result = await require(`./${name}.cjs`)(browser, {
          compare: flags.includes('--compare'), updateBaselines: flags.includes('--update-baselines')
        });
        report.suites[name] = { status: 'passed', ...result };
        console.log(`${name}: ${JSON.stringify(result)}`);
      } catch (error) {
        report.suites[name] = { status: 'failed', error: error.message };
        console.error(`${name}: ${error.stack}`);
        process.exitCode = 1;
      }
    }
  } finally {
    await browser.close();
    fs.mkdirSync(QA, { recursive: true });
    fs.writeFileSync(path.join(QA, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`Report: ${path.relative(ROOT, path.join(QA, 'report.json'))}`);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
