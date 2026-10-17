# Website Decisions

This is historical context, not a statement about the current deployment.
The full earlier audit narrative is preserved in Git at commit `475a2bf`
(`git show 475a2bf:docs/WEBSITE.md`). Routine test transcripts belong in local
reports rather than accumulating in the maintenance guide.

## 16 October 2026: Pre-launch Scope

Preserved the company branding and design; added a planned patient journey,
doctor-review explanation and website-only legal pages. No fabricated adoption,
testimonials, registrations, approvals or clinical guarantees were authorised.
The source repository and deployed artifact remain separate from the private app.

## 17 October 2026: Preview and Demonstrations

The owner chose a text-only product preview. Supplied app screenshots were not
approved for publication or copied into the repository. Future selected genuine
screens require individual approval, not a complete feature gallery.

Private demos are intended primarily for healthcare professionals and potential
partners, requested through the existing support email and arranged manually.
No public demo accounts, automatic access or unconnected request form were approved.

## 17 October 2026: Launch and Legal Pages

The owner replaced the fixed December 2026 launch announcement with a February
2027 target, subject to readiness. The current exact wording and update procedure
are maintained in README and the website guide, not duplicated here.

The privacy notice was rewritten with provider categories rather than supplier
brands, while retaining processing purposes, retention, international processing,
rights and contact information. The terms were named "Terms and Services";
the medical disclaimer retained emergency guidance and pre-launch boundaries.
No arbitrary liability cap, mandatory arbitration or invented operating identity
was introduced. These editorial decisions do not establish legal compliance.

The legal drafts still require review against actual operations. In particular,
provider categories and an offer to supply details on request must not be assumed
to satisfy every advance-notification obligation. Relevant primary references
used during that review were:

- [Kenya Data Protection Act](https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf), especially notice requirements.
- [ODPC data subject rights](https://www.odpc.go.ke/rights-of-a-data-subject/).
- [KMPDC registration](https://kmpdc.go.ke/registering-as-a-practitioner/),
  [annual licensing](https://kmpdc.go.ke/application-for-annual-license/) and
  [practitioner registers](https://registers.kmpdc.go.ke/).
- [WHO-hosted remote-consultation discussion](https://eurohealthobservatory.who.int/publications/i/keeping-what-works).

Hosting and email were reviewed using the
[hosting privacy policy](https://www.netlify.com/privacy/),
[processing agreement](https://www.netlify.com/pdf/netlify-dpa.pdf) and
[email-provider privacy policy](https://www.namecheap.com/legal/general/privacy-policy/).
These references do not establish MediZoom certification or endorsement; recheck
actual contracts, settings and legal requirements before relying on them.

## Historical QA Limits

Earlier local runs passed 16 homepage layouts and 13 axe scans. A live audit
observed an optional Netlify badge script causing CSP violations; no host setting
was changed. External regulator/provider pages sometimes timed out or challenged
automated requests. Those observations are not current uptime guarantees.
Use fresh test reports and the publication checklist for each release.
