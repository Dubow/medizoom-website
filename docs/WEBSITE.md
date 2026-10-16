# Website Guide

This repository contains Medizoom's public coming-soon page. The mobile
application and backend are maintained separately and are not deployed by this
website.

## Local Preview

Open `public/index.html` in a browser. From PowerShell in this repository:

```powershell
Invoke-Item .\public\index.html
```

No installation, build command, server or environment variables are required.
The page uses static HTML, CSS, local WebP images and system fonts. A small local
JavaScript file controls the mobile navigation; links remain available if
JavaScript is disabled. There are no application API calls, forms, analytics
scripts or third-party JavaScript dependencies.
Contact links open the visitor's email application; they do not create a mailing
list subscription. Once hosted, the host may process technical request logs.

## File Structure

```text
public/                      The only folder to publish
  index.html                 Public homepage and platform overview
  styles.css                 Responsive styles
  navigation.js              Accessible mobile menu behavior
  assets/                    Images and favicon
docs/WEBSITE.md               This maintenance guide
README.md                    Public brand and platform introduction
ASSETS.md                    Visual provenance and credits
netlify.toml                 Optional static-host configuration
.gitignore                   Local file and secret exclusions
```

## Publication

The site is currently prepared for local review. No deployment is implied by
the configuration files.

1. Review the copy and visuals locally.
2. Inspect staged files before committing.
3. Push only this folder to the separate `medizoom-website` repository.
4. Connect it to the selected static host, publishing `public` with no build command.
5. Connect `medizoom.care` and verify HTTPS, page rendering and contact links.

The optional `netlify.toml` configures the publish directory and restrictive
security headers. It does not deploy the site or alter DNS. Other hosts need
equivalent configuration. Review the content security policy before adding any
third-party integration.

The HTML includes canonical and social-sharing metadata for `medizoom.care`.
Social previews require the domain and image to be publicly accessible. Update
these URLs if the final domain changes.

Preserve existing email MX, SPF, DKIM and DMARC records during domain setup.
Do not replace nameservers or remove mail records without reviewing the full
DNS configuration. The backend, database and mobile repositories remain separate.

## Verification

Local Playwright checks using headless Microsoft Edge on 16 October 2026 covered
320x568, 390x844, 480x800, 600x390, 600x800, 768x640, 768x1024, 844x390,
1366x768, 1440x650, 1440x900 and 1920x1080 viewports. Checks passed for horizontal
overflow, fragment targets, navigation, image loading, the skip link and keyboard
operation of FAQ disclosures. No page JavaScript
errors or external page requests were observed. Desktop and mobile screenshots
were inspected. Contact URLs were checked, but no email was sent.

Mobile-menu checks also covered keyboard opening, Escape, outside-click closing,
focus leaving the header, focus transfer after link selection and resizing between
mobile and desktop. Navigation was verified with JavaScript disabled. The launch
date and removal of duplicate footer navigation and the credits control were checked.

Re-run these checks when changing content or layout. Local QA files are excluded
from Git and remain outside `public`. Safari, physical-device browser testing,
deployed headers, DNS, HTTPS and social previews still need verification.
Website checks do not validate the separate mobile application or backend.

## Content Maintenance

Keep the website and public README focused on Medizoom, its purpose and its value
for patients and doctors. Place hosting instructions and maintenance notes here.
Avoid personal biographies, academic positioning and internal operational detail.

The announced launch date is 20 December 2026. Keep the hero, FAQ, footer,
page metadata and README consistent if this date changes. Review availability
wording when services actually launch; the page does not switch automatically.

- Distinguish prototype functionality from planned integrations and evaluation.
- Use only approved public information and fictional demonstration data.
- Keep API secrets, passwords, environment files, database exports, medical
  records and identity documents out of this repository.
- Do not publish unsupported adoption, performance or clinical claims.
- Maintain image provenance in `ASSETS.md`; illustrative clinicians should not be
  represented as actual participating doctors.
- Treat the support address as a general contact, not a clinical or emergency
  service. Do not request medical records through it.

An ignore file is not a security guarantee. Review the staged files before every
public push, and deploy only `public`.
