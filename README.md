# B D Window Cleaning Services website

Free static website for **B D Window Cleaning Services**, ready for GitHub Pages.

## Tone

Use a calm, straightforward "we" voice. The site should sound personal without trying too hard to prove it is local or authentic.

Main message:

```text
Window cleaning made simple.
```

Supporting points:

- Simple process to request a fixed quote.
- No-hassle booking after the quote is accepted.
- Pure water cleaning for glass, frames and sills.
- Regular and one-off window cleaning around Southampton.

## Files

- `index.html` - the website page and quote form.
- `styles.css` - mobile-friendly styling, success message styling and mobile action bar.
- `script.js` - updates the footer year and shows the quote confirmation after redirect.
- `assets/window-cleaning-hero.svg` - the light blue water-droplet hero background.

## Current contact details

The website currently uses this email address:

```text
bdwindowservices@gmail.com
```

A phone or WhatsApp button should only be added once Ben provides the real number.

## Quote form

The quote form sends submissions through FormSubmit to:

```text
bdwindowservices@gmail.com
```

The first time the form is submitted, FormSubmit may send a confirmation email to this address. Open that email and confirm it once. After that, quote requests should be delivered directly to the inbox when customers click **Send quote request**.

After FormSubmit redirects back to the site with `?quote=sent`, the website shows a visible thank-you confirmation message.

## Best next trust upgrades

Add these only when they are genuine and confirmed:

- Phone number and WhatsApp number.
- A friendly photo of Ben.
- Photos of equipment or completed work.
- Before-and-after window photos.
- Genuine customer reviews.
- Google review link and rating.
- Insurance and years of experience, if true.
- Starting prices or example price ranges, if Ben wants to publish them.

## Turn on GitHub Pages

1. Open this repository on GitHub.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/root` folder.
6. Save and wait a minute or two.

The live website should appear at:

```text
https://bdwindowservices.github.io/
```

Test the live URL and submit one test quote request before making or printing a QR code.
