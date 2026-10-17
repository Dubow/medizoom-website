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
list subscription. The site is hosted on Netlify, which may process technical
request logs. Enquiries use Namecheap Private Email.

## File Structure

```text
public/                      The only folder to publish
  index.html                 Public homepage and platform overview
  styles.css                 Responsive styles
  navigation.js              Accessible mobile menu behavior
  privacy.html               Website-only privacy notice (review before publication)
  terms.html                 Website terms (review before publication)
  medical-disclaimer.html    Website medical disclaimer
  robots.txt                 Crawl instructions and sitemap location
  sitemap.xml                Public page URLs
  assets/                    Images and favicon
tests/website.cjs             Local browser, accessibility and link regression checks
docs/WEBSITE.md               This maintenance guide
README.md                    Public brand and platform introduction
ASSETS.md                    Visual provenance and credits
netlify.toml                 Netlify publish directory and security headers
.gitignore                   Local file and secret exclusions
```

## Publication

The existing site is live at https://medizoom.care/. The GitHub production branch
is connected to Netlify: pushing to it can publish changes automatically. This
revision is local only. Do not push or deploy it without the owner's approval.

1. Complete the publication review below and review copy and visuals locally.
2. Inspect staged files before committing.
3. Obtain explicit approval to publish, then push only this website repository.
4. Netlify publishes `public` with no build command. Never publish the repository root.
5. Verify HTTPS, page rendering, redirects and contact links after the approved deployment.

The `netlify.toml` configures the publish directory and restrictive
security headers. Editing it locally does not deploy the site or alter DNS. Other hosts need
equivalent configuration. Review the content security policy before adding any
third-party integration.

The HTML includes canonical and social-sharing metadata for `medizoom.care`.
Social previews require the domain and image to be publicly accessible. Update
these URLs if the final domain changes.

Preserve existing email MX, SPF, DKIM and DMARC records during domain setup.
Do not replace nameservers or remove mail records without reviewing the full
DNS configuration. The backend, database and mobile repositories remain separate.

## Verification

Run the reproducible checks from the repository root with Node.js and Microsoft
Edge installed. Test-only dependencies and generated screenshots remain in `.qa`,
which is ignored and outside the publish directory:

```powershell
npm install --prefix .qa --no-save --package-lock=false playwright@1.62.1 axe-core@4.14.0
node tests/website.cjs
```

The script tests the original navigation and FAQ behavior, page layouts, local
links, page metadata, sitemap XML, and automated axe accessibility rules. It does
not contact the app backend, send email or publish anything. Automated scans do
not certify WCAG compliance or replace assistive-technology testing.

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
date and absence of duplicate footer section navigation and the credits control
were checked. Footer legal links are intentionally available on every page.

After the update, all 12 homepage viewports passed again. The homepage and three
legal pages passed automated accessibility checks at widths of 320, 768 and 1440
pixels; an additional open-menu check brought the total to 13 axe scans. Local
page and asset links, duplicate IDs, metadata, sitemap XML and legal-page return
navigation also passed. All files in `public` total approximately 136 KiB before
HTTP compression, including both hero images and all four HTML pages. No runtime
library, external font, tracking script or new image download was introduced.

Re-run these checks when changing content or layout. Local QA files are excluded
from Git and remain outside `public`. Safari, physical-device and screen-reader
testing, and social previews still need verification. The existing live homepage returned HTTP
200 with HTTPS and its restrictive content security policy during this audit;
changed pages must be checked on Netlify after an approved deployment.
Website checks do not validate the separate mobile application or backend.

## Audit and Publication Review

Audit date: 16 October 2026. Baseline: the original homepage passed its 12-viewport
layout, keyboard, FAQ and mobile-menu checks. The existing branding, image
compositions, content order, contact links and small JavaScript menu were retained.

Necessary improvements identified and prepared locally:

- A four-step planned patient journey, separate from the existing benefit overview.
- Specific patient and doctor benefits without presenting pre-launch services as live.
- Planned credential review, separating professional registration from annual licensing.
- Website-only privacy, terms and medical-disclaimer pages; the old site had none.
- Clear emergency and sensitive-information boundaries around general enquiries.
- Search descriptions, page-specific canonical URLs, sitemap and robots file.
- A darker support email link: the accessibility scan found insufficient contrast
  against the original contact background.
- Reproducible tests and a documented launch transition instead of a new framework.

Still required before publishing this revision:

- The owner selected a text-only product preview on 17 October 2026. Screenshots
  are optional, not a prerequisite for publication. Do not add them without
  specific approval or present the illustrative hero as a participating doctor.
- Confirm the approved operator identity and business contact details for the
  website's legal notices. Brand and support email alone are not a completed legal
  identity disclosure. Do not invent an entity, office or registration information.
- Have a qualified Kenyan legal adviser review the website notices and the
  applicable operational obligations. The draft pages are not a compliance certificate.
- Confirm the proposed enquiry-use and no-marketing statements, access controls,
  retention/deletion practice, rights-request handling and lawful bases against
  actual operations. No arbitrary retention period has been invented.
- Check provider settings, processing locations, contracts and cross-border transfer
  safeguards for hosting and email. A link to a provider's policy does not establish
  MediZoom's own compliance or a Kenya-only data-residency guarantee.
- Confirm that Netlify has no separately enabled analytics or tracking integration
  beyond what is visible in this repository. Re-review the notice if one is enabled.
- Review the planned launch date, clinical scope and doctor-onboarding wording.

Policy and credential references reviewed for this work:

- [KMPDC registration](https://kmpdc.go.ke/registering-as-a-practitioner/) and
  [annual licensing](https://kmpdc.go.ke/application-for-annual-license/).
- [Official practitioner registers](https://registers.kmpdc.go.ke/).
- [ODPC data subject rights](https://www.odpc.go.ke/rights-of-a-data-subject/).
- [Netlify privacy](https://www.netlify.com/privacy/) and
  [data processing agreement](https://www.netlify.com/pdf/netlify-dpa.pdf).
- [Namecheap privacy](https://www.namecheap.com/legal/general/privacy-policy/).

These sources support the distinctions and provider references, not claims of
MediZoom approval, certification, affiliation or completed verification.

## Product Preview and Private Demos

The "A closer look at MediZoom" section follows the planned patient journey.
It is deliberately text-only by the owner's decision on 17 October 2026. The
attached app captures were reviewed but were not approved for publication and
have not been copied into the repository. Do not add empty device frames, a
fictional interface, a hidden screenshot gallery or a claim that images are shown.

Any future public preview is limited to two or three carefully selected, genuine
app screenshots with explicit approval for each image. Do not turn it into a full
feature gallery or expose internal workflows. Replace personal data in the app
with fictional demo data before capture; exclude real faces, names, messages,
medical records, identifiers, payment details and authentication information.
Prefer fresh, clean captures rather than altering an interface to conceal content.

If approved later, place the images in this same section with factual development
preview captions, local WebP files, explicit dimensions and lazy loading. Maintain
readable screen content, record provenance and approval in `ASSETS.md`, and update
the test that currently requires the homepage to contain only its existing hero
image. No automated upload, discovery or publishing mechanism is provided.

The demo action opens a draft in the visitor's email application addressed to
`support@medizoom.care` with the subject `MediZoom private demo request`. It does
not send the email, submit a form, book a meeting, create an account or grant
application access. Requests are intended primarily for healthcare professionals
and potential partners and must be reviewed and arranged manually. Do not expose
test accounts, credentials, patient data or internal application URLs.

## Infrastructure Disclosure Audit

Reviewed on 17 October 2026. The homepage's promotional sections contain no
hosting-provider names, backend frameworks, database technologies or deployment
architecture. No such material needed removal from those sections. The public
README's repository note was shortened to omit internal application references.

The privacy FAQ still mentions technical request logs and links to the full
privacy notice. `public/privacy.html` is unchanged: it retains the hosting and
email provider names, provider policy and processing-agreement links, information
categories, retention wording, international-processing disclosure, rights and
contact information. Those disclosures were not removed as promotional detail.
This is a content-scope audit, not a new determination of legal compliance.

Hosting and implementation instructions remain in this maintenance guide, not
promotional copy. This revision does not change `netlify.toml`, DNS, certificates,
deployment configuration, the mobile application, backend or database. Publishing
still requires a separate explicit approval.

Validation on 17 October 2026: all 12 responsive layouts and 13 axe accessibility
scans passed after darkening the new contact-section link. Existing menu, FAQ,
keyboard, no-JavaScript, local-link, metadata and sitemap checks passed. New checks
verify the text-only preview, the demo email recipient and subject, manual-review
wording and the retained privacy disclosures. Desktop and small-screen previews
were visually inspected. No demo email was sent; no changes were committed,
pushed or deployed during this revision.

## Launch Transition

Launch remains a manual content change, not a date-triggered unlock.

1. Confirm actual service readiness and approved operating and clinical disclosures.
2. Finalise app privacy information, patient and doctor terms, consent, pricing,
   cancellation/refund information and clinical support arrangements before use.
3. Verify store listings and live service URLs before adding download or booking links.
4. Update the hero, availability FAQ, planned journey, verification statements,
   footer, metadata and README together; retain only features available at launch.
5. Recheck data collection, providers, retention, permissions, safety notices and SEO
   whenever forms, analytics, payments or embedded services are introduced.
6. Run the website tests, review on physical devices, obtain approval, then publish.

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
