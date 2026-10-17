# Website Guide

This repository contains MediZoom's public coming-soon page. The mobile
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
  terms.html                 Terms and Services (website-only; review before publication)
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

## Final Quality Review

Review date: 17 October 2026. The live website and local publish files were
reviewed without changing hosting settings or deploying. The owner approved
"Targeting February 2027" as the replacement launch message. This is a target,
not a confirmed opening date; public consultations remain unavailable.

Focused changes made locally:

- Updated the homepage's four launch references, search and sharing descriptions,
  website terms and README. Month-only HTML dates use `datetime="2027-02"`.
- Standardised MediZoom capitalization in copy, accessible labels, wordmarks,
  email subjects and documentation, retaining existing typography and colours.
- Explicitly included private-demo email enquiries in the privacy notice and
  the existing manual-review/no-automatic-access approach in the website terms.
- Fixed hero wordmark clipping at 280 pixels with a font-size rule below 320
  pixels. Existing mobile and desktop styles are unchanged.
- Extended regression checks for launch wording, brand consistency, email
  recipients and demo scope, and added four responsive test sizes.

Verification completed:

- All 16 homepage viewports passed, spanning 280 to 1920 pixels. New sizes are
  280x653, 360x640, 851x700 and 1024x768, alongside the original twelve.
- All 13 axe scans passed. Navigation, keyboard focus, FAQ disclosures, menu
  resizing, JavaScript-disabled navigation, local links, email URL recipients,
  metadata and sitemap checks passed. Desktop, mobile, narrow-screen and demo
  section screenshots were inspected. No email was sent.
- The live homepage and three legal pages returned HTTP 200 over HTTPS; their
  canonical URLs matched their final URLs. HTTP and www requests resolved to the
  HTTPS primary domain. Referenced assets, robots and sitemap returned HTTP 200.
- KMPDC, ODPC and Netlify reference links returned HTTP 200. Namecheap's privacy
  URL is still documented and retrievable through web search, but direct automated
  requests reached a 403 browser-verification challenge. Recheck it manually;
  this is not evidence that the URL is missing.
- Source inspection found no credentials, internal application addresses or
  unapproved app screenshots in `public`. Promotional sections contain no named
  hosting providers or implementation architecture; privacy disclosures remain.
- There is no production compilation command or package manifest. The production
  artifact is the existing `public` directory: 12 files, 141,666 bytes (about
  138 KiB) before HTTP compression, including both images and all legal pages.
  Its links and assets were validated, `node --check public/navigation.js` passed,
  and `git diff --check` reported no whitespace errors. No build pipeline was added.

Remaining review items, in priority order:

1. The privacy notice still needs the approved responsible operator identity and
   contact details, actual retention/deletion practice, lawful-basis assessment,
   and provider transfer safeguards checked against operations. The current
   retention wording reviewed at that point was not a confirmed retention policy. Have
   a qualified Kenyan adviser review the notice; no identity, address, retention
   period or compliance status was invented. See the
   [ODPC principles and rights guidance](https://www.odpc.go.ke/rights-of-a-data-subject/).
2. The deployed homepage includes a host-injected
   `/.netlify/scripts/hud?variant=public` script, absent from this repository.
   It added a roughly 35 KiB response and produced inline-script/style CSP
   violations in a fresh browser; no badge was visible in the captured view.
   Recommend disabling the optional Powered by Netlify badge, with owner
   approval, under Project configuration > General > Powered by Netlify badge.
   See [Netlify's badge settings](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/).
   Do not weaken the CSP or add a CSS hiding workaround. No setting was changed.
3. Real-device Safari and screen-reader testing remain manual follow-ups.
   Automated accessibility checks are not a compliance certification. Mailto
   checks verify addresses and subjects, not email delivery or response times.

The existing layout, patient journey, doctor information, text-only preview,
manual demo approach and medical-disclaimer content are retained. No app,
database, DNS, SSL or deployment configuration was changed. The live site still
has the previous launch date until these local changes are approved and deployed.

## Provider-Neutral Privacy Revision

Later on 17 October 2026, the owner requested a more structured privacy notice,
using [the Aluta privacy page](https://aluta.ke/privacy) as a presentation reference
without naming MediZoom's third-party suppliers in the public notice.

The revised `public/privacy.html` has fourteen numbered sections and retains the
existing website design, legal navigation, canonical URL and privacy contact.
It describes only the pre-launch information website and email enquiries,
including private-demo requests. It does not adopt the reference site's company
identity, registration statements, operating features, retention periods or
security promises.

Provider brand names and provider-policy URLs were removed from this public
notice. Recipient categories and their roles remain explicit: website hosting
and delivery, and email delivery and storage, including their service partners.
Processing outside Kenya, retention factors, HTTPS, sensitive-information
boundaries, data subject rights and the regulator's contact links are retained.
Visitors can request further information about recipients, locations and
safeguards through the privacy contact. The actual supplier information remains
in this maintenance guide for operational review, not in promotional copy.

This is a local draft, not a legal determination that category-only disclosure
is sufficient. Section 29 of the
[Kenyan Data Protection Act](https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf)
requires notification about third-party recipients and safeguards, among other
matters. The owner should obtain Kenyan legal review of the recipient detail
required before replacing the live notice. Supplying details only on request
must not be assumed to discharge advance notification requirements. Approved
operator identity/contact details, actual retention practices, lawful bases and
transfer arrangements still need confirmation; none have been invented.

Regression tests now require the provider categories, international-processing
disclosure, rights, website-only scope and numbered sections, and reject vendor
names or copied reference-site branding in the public privacy file. This
supersedes the earlier tests that required named vendors and their policy links.
No homepage, hosting, DNS, SSL, app or deployment changes are part of this
privacy revision, and no publication was authorised.

Validation after this revision: all 16 responsive layouts and 13 automated axe
scans passed, including the revised notice at 320, 768 and 1440 pixels. Numbered
sections, recipient categories, retained disclosures, local links and email URLs
passed their checks. Mobile and desktop privacy-page screenshots were reviewed;
`git diff --check` reported no whitespace errors. No email was sent or production
change made.

## Terms and Services Revision

On 17 October 2026, the owner requested the title "Terms and Services" and a
numbered structure inspired by [the Aluta terms page](https://aluta.ke/terms).
The existing `terms.html` URL, canonical URL and sitemap entry are unchanged.
The page title, heading, description and every public link label now use the
requested name.

The twelve sections cover the information website, pre-launch availability,
medical boundaries, manual private demos, responsible use, content and branding,
illustrative imagery, privacy, external links, availability and legal rights,
complaints, and future service terms. The approved February 2027 target remains.
No supplier names, registration claims, operating address, payment rules,
arbitrary liability cap, indemnity or mandatory arbitration provision were
imported from the reference. Existing statutory-rights protections are retained.

This remains a website-only draft, not an agreement for clinical care or public
app access. Confirm the responsible operator's identity and have a qualified
Kenyan adviser review the wording before publication. Future service terms will
need separate clinical, payment, cancellation, refund and consent decisions.
Tests verify the renamed links, numbered sections, pre-launch and medical scope,
manual access arrangements and unchanged canonical URL. No deployment is part
of this revision.

Validation: all 16 responsive layouts and 13 automated axe scans passed, including
the revised terms at 320, 768 and 1440 pixels. Local links, email URLs, metadata,
sitemap, navigation and no-JavaScript checks passed. Mobile and desktop terms
screenshots were visually reviewed, and `git diff --check` passed. No production
change or email transmission occurred.

## Medical Disclaimer Revision

On 17 October 2026, the owner requested the same structured treatment for the
medical disclaimer as the privacy notice and Terms and Services. The revised
page has ten numbered sections and retains its design, URL, metadata, legal
navigation, support email and prominent emergency warning.

The wording covers the pre-launch website, general enquiries and private product
demonstrations, not an active clinical service. It distinguishes demonstrations
from consultations, explains remote-care limitations, avoids guarantees of
prescriptions or outcomes, retains planned-only credential-review wording and
identifies the homepage imagery as illustrative. It also preserves statutory
rights and professional duties rather than adding a blanket liability waiver.
No supplier names, public screenshots, clinical instructions or invented
approvals were added.

The general remote-care limitation is consistent with the WHO-hosted European
Observatory's [Keeping what works](https://eurohealthobservatory.who.int/publications/i/keeping-what-works).
The existing [official KMPDC registers](https://registers.kmpdc.go.ke/) link is
retained for independent practitioner information, not as an endorsement.
The draft still needs qualified Kenyan legal and clinical review before
publication, and a fresh review against actual service arrangements at launch.

Regression checks cover the numbered structure, prominent emergency warning,
pre-launch scope, demonstration boundaries, non-guarantees, sensitive-information
guidance, rights and regulator link. No backend, hosting or deployment
configuration is changed by this revision.

Validation: all 16 responsive layouts and 13 automated axe scans passed, including
the revised disclaimer at 320, 768 and 1440 pixels. Local links, email URLs,
metadata, sitemap, navigation and JavaScript-disabled checks passed. Mobile and
desktop disclaimer screenshots were visually reviewed, and `git diff --check`
passed. The external KMPDC register could not be rechecked through the research
browser because of a timeout; its existing URL was retained. This static site
has no production compilation step. No email was sent or production change made.

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

Keep the website and public README focused on MediZoom, its purpose and its value
for patients and doctors. Place hosting instructions and maintenance notes here.
Avoid personal biographies, academic positioning and internal operational detail.

The owner-approved launch wording is "Targeting February 2027", not a confirmed
opening date. Keep the hero, platform note, FAQ, footer, website terms,
page metadata and README consistent if this target changes. Review availability
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
