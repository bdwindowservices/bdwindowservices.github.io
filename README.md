# B D Window Cleaning Services website

Static GitHub Pages website for **B D Window Cleaning Services**:

https://bdwindowservices.github.io/

## Business details

- Telephone and WhatsApp: 07598 629684
- Email: bdwindowservices@gmail.com
- Service areas: SO15, SO16 and SO40

## Main website files

- `index.html` - homepage, estimator and booking form
- `styles.css` - responsive styling
- `script.js` - estimator, appointment dates and booking submission
- `privacy.html` - privacy notice
- `terms.html` - customer booking terms
- `robots.txt` and `sitemap.xml` - search-engine crawl files
- `assets/` - logo, hero artwork and website photograph
- `preview-*.js`, `mobile-number.js` and `one-off-payment-hint.js` - focused interface enhancements

## Booking service

The form posts to the deployed Google Apps Script web app configured in
`index.html`. The source files are:

- `google-apps-script/Code.gs`
- `google-apps-script/EmailTemplate.html`

The service stores bookings in the Bookings sheet and sends confirmation
emails through Gmail. After changing either Apps Script source file, copy the
updated source into the existing Apps Script project and deploy a new version
of the web app.

Website prices are estimates. The final price is checked before the first
clean begins. The appointment date and arrival window are confirmed when the
website displays success and sends the confirmation email.

## Publishing

GitHub Pages publishes from the `main` branch and repository root. Changes
should be made through a branch and pull request, tested, and then merged.

The site is intentionally static and uses free GitHub Pages hosting.
