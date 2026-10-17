# Website Development Guide

Development and maintenance instructions for the MediZoom public website.

## Local Preview

Open `public/index.html` in a browser. From the repository root in PowerShell:

```powershell
Invoke-Item .\public\index.html
```

The website uses static HTML, CSS, vanilla JavaScript, local WebP images and system
fonts. No installation, server, build command or environment variables are needed
for preview. Local files do not exercise hosted redirects or HTTP security headers.

## Repository Structure

```text
public/                 Homepage, legal pages, styles, navigation and assets
tests/website.cjs        Test runner
tests/functional.cjs     Navigation, links and responsive behavior
tests/accessibility.cjs  Automated accessibility scans
tests/content.cjs        Metadata, content consistency and publication checks
tests/visual.cjs         Screenshot capture and baseline comparison
tests/support.cjs        Shared test setup and viewport matrix
docs/WEBSITE.md          Development and release guidance
ASSETS.md               Asset provenance and licenses
netlify.toml            Publish directory and security headers
.qa/                    Ignored test dependencies and generated artifacts
```

## Architecture

`public/` is the complete deployment artifact. There is no build step, package
bundle, application API, registration, payment handling or contact form. Each
HTML page can be opened directly. The shared stylesheet supplies responsive
layouts; `navigation.js` progressively enhances the homepage menu. Without
JavaScript, its links remain visible. Keep that fallback and keyboard focus
behavior when changing navigation.

Email links open a draft in the visitor's email client. They do not send mail,
subscribe visitors, schedule appointments or grant access. Hosting may process
request logs; email enquiries are handled outside the website. Any introduction
of forms, tracking, embeds or app access requires a new data-flow and legal review.

`netlify.toml` limits publication to `public/` and sets CSP, MIME-sniffing,
referrer and browser-permission restrictions. Do not relax them to accommodate
optional host scripts. Local file tests cannot validate their deployed behavior.

## Testing

Use Node.js with npm and Microsoft Edge. The suite has been tested with Node 24.
Install the test-only dependencies in `.qa/` from the repository root:

```powershell
npm install --prefix .qa --no-save --package-lock=false playwright@1.62.1 axe-core@4.14.0
node tests/website.cjs
```

To run a single suite:

```powershell
node tests/website.cjs functional
node tests/website.cjs accessibility
node tests/website.cjs content
node tests/website.cjs visual
```

The runner accepts `all` (default), `functional`, `accessibility`, `content` or
`visual`. Suites run independently and a failed suite does not suppress results
from the others. Failures produce a nonzero exit code; `.qa/report.json` contains
the most recent run. Local browser contexts block unexpected HTTP requests.

| Suite | Responsibility |
| --- | --- |
| Functional | Layout boundaries, image decoding, keyboard menu/FAQ/skip links, focus on resize, local targets, email URLs and no-JavaScript behavior |
| Accessibility | Axe scans of every public HTML page at 320, 768 and 1440 pixels, plus the open mobile menu |
| Content | Launch target, brand casing, canonical/sitemap consistency, key safety topics, text-only preview, approved media and basic publication restrictions |
| Visual | Reproducible desktop/mobile/short-screen captures, with optional comparison to a manually saved local baseline |

The exact viewport matrix is maintained once in `tests/support.cjs`. Assertions
should describe behavior or publication requirements, not paragraph counts or
the exact wording of promotional copy. Safety-topic checks are deliberately
limited: they flag omissions, but cannot establish that legal text is accurate,
that an image has consent or that a repository contains no secrets. Review those
matters manually as well.

### Visual Baselines

1. Run `node tests/website.cjs visual` and inspect `.qa/visual/current/`.
2. Once the rendering is accepted, explicitly save a baseline:
   `node tests/website.cjs visual --update-baselines`.
3. After editing, run `node tests/website.cjs visual --compare`, or use
   `node tests/website.cjs all --compare` for the full suite.
4. Review changed captures beside `.qa/visual/baseline/`. The filenames are listed
   in `.qa/visual/differences.json`. Do not refresh a baseline merely to clear a failure.

Comparison uses screenshot hashes on the same browser version, OS, architecture
and device scale. A difference is a review signal, not proof of a defect. Browser
or system-font updates can change rendering; review fresh captures in a consistent
environment. Missing or incompatible baselines fail comparison explicitly. All
baselines remain local and ignored, so a fresh checkout has no approved baseline.
Capture-only runs report that comparison was not performed.

### Failure Triage

- Broken targets, lost keyboard focus, clipping or unintended network requests
  are functional regressions, not reasons to weaken the tests.
- A copy edit may legitimately retain the meaning of a safety notice without
  matching its topic pattern. Review the meaning before changing that assertion.
- A visual difference may be intentional. Inspect the old and new rendering;
  design and publication-policy changes require maintainer review.
- A missing tool or Edge installation is a setup failure. Use the pinned test
  dependencies above; nothing needs installing into `public/`.

Physical-device browsers, Safari, screen readers, email delivery, live HTTP
headers/redirects and external sites remain outside these local checks. Tests do
not contact the private application or certify accessibility or legal compliance.

## Responsive CSS

Width rules progress from desktop to mobile. The 541-700px band uses the landscape
image; narrower screens use the portrait composition. Height-specific overrides
follow the width rules, with non-overlapping mobile and wider-screen ranges.

The introductory hero paragraph is omitted in compact portrait layouts (up to
540px wide and 700px high) and very short wider layouts (up to 500px high). The
next platform section repeats that introduction. This preserves space for the
image subject without hiding the brand, launch target, tagline or primary action.
On wider short screens with enough room, the paragraph stays visible. Do not hide
unique information to pass a screenshot or first-viewport check. Test near both
sides of changed breakpoints.

## Content Maintenance

Keep the website company-focused and truthful about pre-launch availability.
The approved target appears as static HTML so it remains available without
JavaScript. No runtime date substitution or automatic launch switch is needed.

When publishing an updated launch target, keep these references in sync:

- All launch `<time>` elements and search/social descriptions in `public/index.html`.
- The launch statement in `public/terms.html` and the brief README introduction.
- `LAUNCH_MONTH` in `tests/content.cjs`, then run the content suite.

That one test value checks every launch occurrence rather than a fixed number of
references. Legal revision dates are separate and must not be changed just to
match the launch month.

The product preview is text-only. Any future screenshot must be genuine,
individually approved for publication and free of private data. Limit it to two or three
selected screens rather than a full workflow gallery. Record approval and
provenance in `ASSETS.md`, then update the reviewed-media list and preview tests.
The media list checks filenames, not whether the contents are genuine or safe.

Keep private-demo requests directed to `support@medizoom.care`, manually reviewed
and arranged. Do not expose test accounts or invite visitors to send medical
records, identity documents or professional credentials through this channel.

## Publication

The production branch is connected to Netlify. Pushing can deploy automatically;
releases require maintainer approval before a production push or deployment.

1. Review the diff and staged files, including asset provenance and sensitive data.
2. Run all suites and visually inspect affected pages. Record any unverified items.
3. Confirm current availability, contact details and launch wording.
4. Have qualified Kenyan legal and clinical advisers review the legal pages against
   actual operations. Confirm operator identity/contact details, enquiry handling,
   retention, lawful bases, recipient disclosures and international-transfer safeguards.
   Category-only provider descriptions are not a determination of legal sufficiency.
5. Publish only `public/`, without a build command, after approval.
6. Check the live domain's HTTPS, redirects, headers, assets, links and mobile rendering.
   Include any host-level scripts or integrations in the security and privacy review.

Do not alter DNS, SSL, email records, backend or database configuration as part
of a content release. Preserve existing MX, SPF, DKIM and DMARC records if domain
work is separately approved. Keep test tools and `.qa/` outside the published files.

At launch, replace pre-launch statements only after service readiness is confirmed.
Provide the appropriate service terms, privacy information, consent, pricing,
cancellation/refund rules and verified app-store links. Re-review the website's
data practices whenever integrations change. The date itself must never unlock
bookings or change clinical availability automatically.
