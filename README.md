# MediZoom Website

The public pre-launch website for [MediZoom](https://medizoom.care), a
telemedicine platform in development for Kenya. **Targeting February 2027**;
public consultations and bookings are not open.

This repository contains the company website only, not the mobile application,
clinical services or backend. Private demonstrations are requested through
[support@medizoom.care](mailto:support@medizoom.care?subject=MediZoom%20private%20demo%20request)
and arranged manually. The site does not create accounts or collect medical data.

## Stack

- Static HTML and CSS, with a small vanilla JavaScript mobile menu.
- Local WebP imagery and system fonts; no runtime packages or build step.
- Playwright with Microsoft Edge and axe-core for local testing only.
- Netlify publishes `public/`; security headers are defined in `netlify.toml`.

## Repository Layout

```text
public/                 Publishable homepage, legal pages, styles, script and assets
tests/website.cjs        Test runner (all suites or one selected suite)
tests/functional.cjs     Navigation, links, responsive geometry and no-JS behavior
tests/accessibility.cjs  Automated axe scans
tests/content.cjs        Launch consistency, metadata and publication safeguards
tests/visual.cjs         Screenshot capture and optional baseline comparison
tests/support.cjs        Shared browser setup, paths and viewport matrix
docs/WEBSITE.md          Maintenance, testing details and publication checklist
docs/DECISIONS.md        Relevant historical decisions and review caveats
ASSETS.md               Image provenance and icon licensing
netlify.toml            Publish directory and HTTP security headers
.qa/                    Ignored test dependencies, reports and visual artifacts
```

## Local Preview

Open `public/index.html` in a browser. In PowerShell from this directory:

```powershell
Invoke-Item .\public\index.html
```

No server, installation or environment variables are needed to preview the site.
The mobile navigation also works without JavaScript. A file preview does not
exercise the HTTP security headers or redirects configured by the host.

## Tests

Install Node.js with npm and Microsoft Edge. The suite was tested with Node 24.
From the repository root, install the existing test-only tools into `.qa/`:

```powershell
npm install --prefix .qa --no-save --package-lock=false playwright@1.62.1 axe-core@4.14.0
node tests/website.cjs
```

Run one suite when iterating:

```powershell
node tests/website.cjs functional
node tests/website.cjs accessibility
node tests/website.cjs content
node tests/website.cjs visual
```

Results are written to `.qa/report.json`. Screenshots are saved in
`.qa/visual/current/`. A normal run captures screenshots but does **not** claim
visual regression comparison. See the [testing guide](docs/WEBSITE.md#testing)
for explicitly saved baselines, comparison and known limitations.

## Deployment Boundaries

Publish **only `public/`**, with no build command. A push to the connected
production branch can trigger an automatic Netlify deployment. Obtain owner
approval before pushing or deploying; a local commit does not publish the site.

Keep private app source, credentials, medical information and test artifacts out
of the publish directory and Git history. Changes to the separate application,
database, DNS or email configuration are outside this repository's scope.

Before release, follow the [publication checklist](docs/WEBSITE.md#publication).
Legal and clinical wording requires qualified review; automated checks do not
establish legal compliance, medical suitability or complete accessibility.
