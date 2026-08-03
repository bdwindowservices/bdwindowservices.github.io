const CONFIG = Object.freeze({
  businessName: "B D Window Cleaning Services",
  businessEmail: "bdwindowservices@gmail.com",
  businessPhone: "07598 629684",
  websiteUrl: "https://bdwindowservices.github.io/",
  websiteSource: "bdwindowservices.github.io",
  sheetName: "Bookings",
  timezone: "Europe/London"
});

const BOOKING_HEADERS = [
  "Booking reference",
  "Submitted",
  "Status",
  "Name",
  "Email",
  "Address line 1",
  "Address line 2",
  "Postcode",
  "Appointment",
  "Estimated quote",
  "Front window sets",
  "Back or side window sets",
  "Front only clean",
  "Extras",
  "Access notes",
  "Mobile number",
  "Submission ID",
  "Website source"
];

function setupBookingService() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Open this project from the B D Website Bookings spreadsheet before running setup.");
  }

  PropertiesService.getScriptProperties().setProperty("BOOKINGS_SPREADSHEET_ID", spreadsheet.getId());
  const sheet = getOrCreateBookingSheet_(spreadsheet);
  console.log("Setup complete. Bookings will be stored in: " + spreadsheet.getName());
  return sheet.getName();
}

function doGet() {
  return HtmlService.createHtmlOutput(
    "<h1>B D booking service</h1><p>The booking email service is running.</p>"
  );
}

function doPost(event) {
  let storedBooking = null;
  try {
    const submitted = event && event.parameter ? event.parameter : {};

    // Form bots tend to fill this hidden field. Return a normal-looking response
    // without storing data or sending email.
    if (clean_(submitted._honey)) {
      return successPage_("received");
    }

    const booking = bookingFrom_(submitted);
    validateBooking_(booking);

    const lock = LockService.getScriptLock();
    let existingReference = "";
    lock.waitLock(10000);
    try {
      existingReference = findBookingReferenceBySubmissionId_(booking.submissionId);
      if (!existingReference) {
        storedBooking = appendBooking_(booking);
      }
    } finally {
      lock.releaseLock();
    }

    if (existingReference) {
      return successPage_(existingReference);
    }

    sendBusinessNotification_(booking);
    sendCustomerConfirmation_(booking);
    updateBookingStatus_(storedBooking, "Confirmed");

    return successPage_(booking.reference);
  } catch (error) {
    console.error(error);
    if (storedBooking) {
      updateBookingStatus_(storedBooking, "Email failed");
    }
    return errorPage_();
  }
}

function bookingFrom_(submitted) {
  const now = new Date();
  const addressLine1 = clean_(submitted["Address line 1"]);
  const addressLine2 = clean_(submitted["Address line 2"]);
  const postcode = clean_(submitted.Postcode).toUpperCase();

  return {
    reference: bookingReference_(now),
    submitted: now,
    status: "Pending",
    name: clean_(submitted.Name),
    firstName: clean_(submitted.Name).split(/\s+/)[0],
    email: clean_(submitted.email || submitted["Email address"]),
    mobile: clean_(submitted["Mobile number"]),
    submissionId: clean_(submitted["Submission ID"]),
    websiteSource: clean_(submitted["Website source"]),
    addressLine1: addressLine1,
    addressLine2: addressLine2,
    postcode: postcode,
    address: [addressLine1, addressLine2, postcode].filter(Boolean).join(", "),
    appointment: clean_(submitted["Cleaning date preference"]),
    estimate: clean_(submitted["Estimated quote"]),
    frontSets: clean_(submitted["Front window sets"]),
    backSets: clean_(submitted["Back or side window sets"]),
    frontOnly: clean_(submitted["Front only clean"]) || "No",
    extras: clean_(submitted.Extras) || "No extras selected",
    accessNotes: clean_(submitted["Access notes"]) || "None provided"
  };
}

function validateBooking_(booking) {
  const required = [
    [booking.name, "name"],
    [booking.email, "email address"],
    [booking.mobile, "mobile number"],
    [booking.submissionId, "submission ID"],
    [booking.addressLine1, "address"],
    [booking.postcode, "postcode"],
    [booking.appointment, "appointment"],
    [booking.estimate, "estimate"]
  ];

  const missing = required.find(function (entry) {
    return !entry[0];
  });
  if (missing) {
    throw new Error("Missing required booking field: " + missing[1]);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    throw new Error("Invalid customer email address");
  }
  if (booking.websiteSource !== CONFIG.websiteSource) {
    throw new Error("Booking rejected because it did not come from the current website");
  }
  if (!/^[a-zA-Z0-9-]{12,100}$/.test(booking.submissionId)) {
    throw new Error("Invalid submission ID");
  }
}

function findBookingReferenceBySubmissionId_(submissionId) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("BOOKINGS_SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Booking service setup is incomplete. Run setupBookingService from the spreadsheet's Apps Script project.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = getOrCreateBookingSheet_(spreadsheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return "";
  }

  const submissionIdColumn = BOOKING_HEADERS.indexOf("Submission ID");
  const referenceColumn = BOOKING_HEADERS.indexOf("Booking reference");
  const rows = sheet.getRange(2, 1, lastRow - 1, BOOKING_HEADERS.length).getValues();
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (String(rows[index][submissionIdColumn] || "") === submissionId) {
      return String(rows[index][referenceColumn] || "");
    }
  }
  return "";
}

function appendBooking_(booking) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("BOOKINGS_SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Booking service setup is incomplete. Run setupBookingService from the spreadsheet's Apps Script project.");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = getOrCreateBookingSheet_(spreadsheet);
  const row = sheet.getLastRow() + 1;
  const values = [
    booking.reference,
    booking.submitted,
    booking.status,
    booking.name,
    booking.email,
    booking.addressLine1,
    booking.addressLine2,
    booking.postcode,
    booking.appointment,
    booking.estimate,
    booking.frontSets,
    booking.backSets,
    booking.frontOnly,
    booking.extras,
    booking.accessNotes,
    booking.mobile,
    booking.submissionId,
    booking.websiteSource
  ].map(sheetSafe_);

  sheet.getRange(row, 1, 1, values.length).setValues([values]);
  sheet.getRange(row, 2).setNumberFormat("dd mmm yyyy HH:mm");
  sheet.autoResizeColumns(1, BOOKING_HEADERS.length);

  return { sheet: sheet, row: row };
}

function getOrCreateBookingSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(BOOKING_HEADERS);
  } else {
    sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]);
  }
  sheet.getRange(1, 1, 1, BOOKING_HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#07575b")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, BOOKING_HEADERS.length);

  return sheet;
}

function updateBookingStatus_(storedBooking, status) {
  try {
    storedBooking.sheet.getRange(storedBooking.row, 3).setValue(status);
  } catch (error) {
    console.error("Could not update booking status: " + error);
  }
}

function sendCustomerConfirmation_(booking) {
  const template = HtmlService.createTemplateFromFile("EmailTemplate");
  template.booking = booking;
  template.config = CONFIG;

  GmailApp.sendEmail(
    booking.email,
    "Booking confirmed - " + booking.appointment + " | " + CONFIG.businessName,
    customerPlainText_(booking),
    {
      htmlBody: template.evaluate().getContent(),
      name: CONFIG.businessName,
      replyTo: CONFIG.businessEmail
    }
  );
}

function sendBusinessNotification_(booking) {
  const body = [
    "A website booking has been confirmed.",
    "",
    "Reference: " + booking.reference,
    "Customer: " + booking.name,
    "Email: " + booking.email,
    "Mobile: " + booking.mobile,
    "Address: " + booking.address,
    "Appointment: " + booking.appointment,
    "Estimated quote: " + booking.estimate,
    "Front window sets: " + booking.frontSets,
    "Back or side window sets: " + booking.backSets,
    "Front only clean: " + booking.frontOnly,
    "Extras: " + booking.extras,
    "Access notes: " + booking.accessNotes,
    "",
    "The customer has automatically received a confirmation email."
  ].join("\n");

  GmailApp.sendEmail(
    CONFIG.businessEmail,
    "New booking: " + booking.name + " - " + booking.appointment,
    body,
    {
      name: CONFIG.businessName,
      replyTo: booking.email
    }
  );
}

function customerPlainText_(booking) {
  return [
    "Hi " + booking.firstName + ",",
    "",
    "Thank you for booking with " + CONFIG.businessName + ". Your window cleaning appointment is confirmed.",
    "",
    "YOUR BOOKING",
    "Reference: " + booking.reference,
    "Date and arrival window: " + booking.appointment,
    "Address: " + booking.address,
    "Mobile: " + booking.mobile,
    "Estimated price: " + booking.estimate,
    "Front window sets: " + booking.frontSets,
    "Back or side window sets: " + booking.backSets,
    "Extras: " + booking.extras,
    "",
    "The selected time is an estimated arrival window. We may be visiting other customers during the same period, but we will aim to arrive within it.",
    "",
    "The price shown is an estimate based on the information provided. We will check and confirm it before starting your first clean. There is nothing to pay until the clean has been completed.",
    "",
    "To change your booking, reply to this email, call " + CONFIG.businessPhone + ", or message us on WhatsApp.",
    "",
    "Kind regards,",
    "Ben",
    CONFIG.businessName,
    CONFIG.businessPhone,
    CONFIG.businessEmail
  ].join("\n");
}

function bookingReference_(date) {
  const datePart = Utilities.formatDate(date, CONFIG.timezone, "yyyyMMdd");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return "BD-" + datePart + "-" + randomPart;
}

function successPage_(reference) {
  return messagePage_("success", reference);
}

function errorPage_() {
  const page = responsePage_(
    "We could not complete the booking",
    "Your information has not been confirmed. Please return to the website and contact Ben by phone, WhatsApp or email.",
    CONFIG.websiteUrl + "#contact",
    "Return to contact details"
  );
  const message = bookingMessageScript_("error", "");
  return HtmlService.createHtmlOutput(page.replace("</head>", message + "</head>"));
}

function messagePage_(status, reference) {
  return HtmlService.createHtmlOutput(
    "<!doctype html><html lang=\"en-GB\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<title>Booking response</title>" +
    bookingMessageScript_(status, reference) +
    "</head><body></body></html>"
  );
}

function bookingMessageScript_(status, reference) {
  const message = JSON.stringify({
    source: "bd-booking-service",
    status: status,
    reference: reference
  }).replace(/</g, "\\u003c");
  return "<script>window.top.postMessage(" + message + ", \"*\");<\/script>";
}

function responsePage_(title, message, destination, linkText) {
  return "<!doctype html><html lang=\"en-GB\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<meta http-equiv=\"refresh\" content=\"2;url=" + html_(destination) + "\">" +
    "<title>" + html_(title) + " | " + html_(CONFIG.businessName) + "</title>" +
    "<style>body{margin:0;background:#eef8f7;color:#172521;font:16px/1.6 Arial,sans-serif}" +
    "main{width:min(560px,calc(100% - 32px));margin:12vh auto;padding:32px;background:#fff;border:1px solid #dbe6e2;border-radius:8px;box-shadow:0 16px 40px rgba(21,42,36,.12)}" +
    "h1{margin-top:0;color:#07575b;font-size:28px}a{display:inline-block;margin-top:12px;padding:12px 18px;border-radius:6px;background:#0f8b8d;color:#fff;font-weight:700;text-decoration:none}</style>" +
    "</head><body><main><h1>" + html_(title) + "</h1><p>" + html_(message) + "</p>" +
    "<a href=\"" + html_(destination) + "\">" + html_(linkText) + "</a></main></body></html>";
}

function clean_(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function sheetSafe_(value) {
  if (typeof value !== "string") {
    return value;
  }
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function html_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
