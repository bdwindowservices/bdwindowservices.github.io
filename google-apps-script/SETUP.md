# Booking confirmation setup

The live site on `main` continues to use FormSubmit until this pull request is tested and merged. The feature branch is connected to the deployed Google Apps Script web application.

## What this automation does

- records each booking in a private Google Sheet;
- sends the customer a branded confirmation containing their submitted details;
- emails the complete booking to `bdwindowservices@gmail.com`;
- creates a booking reference;
- accepts several bookings in the same arrival window;
- returns the customer to the website after a successful submission.

It does not check availability or limit the number of bookings in a time window.

## 1. Create the spreadsheet

1. Sign in to the Google account for `bdwindowservices@gmail.com`.
2. Go to Google Sheets and create a blank spreadsheet.
3. Name it `B D Website Bookings`.
4. Keep the spreadsheet private. The script creates and formats the `Bookings` tab automatically after the first booking.

## 2. Add the Apps Script files

1. In the spreadsheet, select **Extensions > Apps Script**. Google may call it **Untitled project**; this is normal and means the script is attached to that spreadsheet.
2. Set the Apps Script project name to `B D Booking Confirmation`.
3. Open the existing `Code.gs` file and replace its contents with the contents of this folder's `Code.gs`.
4. Select the **+** beside Files, choose **HTML**, and name the new file `EmailTemplate`.
5. Replace the new file's contents with the contents of `EmailTemplate.html`.
6. Select **Project Settings** and set the time zone to **(GMT+00:00) London** or **Europe/London**.
7. Save the project.
8. At the top of the editor, select `setupBookingService` from the function list and click **Run**.
9. Approve the requested spreadsheet permissions while signed in as `bdwindowservices@gmail.com`.
10. Confirm the execution completes and a `Bookings` tab appears in the spreadsheet. This one-time step securely stores the spreadsheet connection for the deployed web app.

## 3. Deploy the web application

1. Select **Deploy > New deployment**.
2. Select the gear icon and choose **Web app**.
3. Description: `Website booking confirmations`.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Select **Deploy**.
7. Google will ask you to authorise access to the spreadsheet and Gmail. Review the permissions and approve them while signed in as `bdwindowservices@gmail.com`.
8. Copy the web app URL ending in `/exec`. The feature branch now uses this deployment URL.

If Google shows an unverified-app message for this personal script, choose **Advanced**, open the `B D Booking Confirmation` project, review the requested permissions, and continue only while signed in to the correct business account.

## 4. Website connection and testing

The feature branch now:

1. submits bookings to the deployed Google web application;
2. no longer sends FormSubmit-only settings;
3. displays the generated booking reference on the confirmation message;
4. clearly labels the selected time as an arrival window.

Submit a controlled test booking and complete the checklist below. Merge the pull request only after the complete journey passes.

## Testing checklist

- Use a separate customer email address for the first test.
- Confirm one new row appears in the `Bookings` sheet.
- Confirm the customer email shows the correct name, address, estimate and arrival window.
- Confirm the business notification arrives at `bdwindowservices@gmail.com`.
- Reply to the customer confirmation and verify the reply goes to the business inbox.
- Check the customer email on a phone as well as a computer.
- Check the spam folder during testing.

Google applies daily sending limits to Gmail and Apps Script. This setup is intended for normal small-business booking volume; the script will show an error page instead of claiming success if storing the booking or sending the emails fails.
