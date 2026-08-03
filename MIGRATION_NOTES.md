# Website migration record

The B D Window Cleaning Services website was migrated from
`bdwindowservices-cloud/bd-window-cleaning` to the shorter live address:

https://bdwindowservices.github.io/

The previous homepage now redirects to the live website. Its Privacy Notice
and Customer Booking Terms should also continue to redirect to the matching
pages on the live site.

GitHub Pages publishes from the `main` branch and repository root.

The Google Apps Script booking service is deployed separately from GitHub.
Whenever `google-apps-script/Code.gs` or
`google-apps-script/EmailTemplate.html` changes, the existing Apps Script
project must be updated and a new web-app version deployed.
