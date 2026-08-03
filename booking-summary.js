(() => {
  const quoteForm = document.querySelector("#quote-form");
  const bookCleanButton = document.querySelector("#book-clean-button");
  const desktopEstimateAction = document.querySelector("#desktop-estimate-action");
  const desktopEstimateCta = document.querySelector("#desktop-estimate-cta");
  const bookingDateStep = document.querySelector("#booking-date-step");
  const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
  const formStatus = document.querySelector("#form-status");
  const quoteDetails = document.querySelector("#quote-details");
  const quoteTotalPrice = document.querySelector("#quote-total-price");
  const quoteTotalMonthly = document.querySelector("#quote-total-monthly");
  const frontWindowCount = document.querySelector("#front-window-count");
  const backWindowCount = document.querySelector("#back-window-count");
  const oneOffClean = document.querySelector("#front-only-clean");

  if (!quoteForm || !bookCleanButton || !bookingDateStep) return;

  const style = document.createElement("style");
  style.id = "booking-summary-styles";
  style.textContent = `
    body.booking-summary-open {
      overflow: hidden;
    }

    .booking-summary-overlay[hidden] {
      display: none;
    }

    .booking-summary-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(12, 30, 27, 0.62);
      backdrop-filter: blur(6px);
    }

    .booking-summary-dialog {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      width: min(960px, 100%);
      max-height: min(90vh, 900px);
      overflow: hidden;
      border: 1px solid #dbe6e2;
      border-radius: 12px;
      background: #f7faf8;
      box-shadow: 0 28px 90px rgba(12, 30, 27, 0.3);
    }

    .booking-summary-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      padding: 24px 26px 20px;
      border-bottom: 1px solid #dbe6e2;
      background: #ffffff;
    }

    .booking-summary-header h2 {
      margin: 0 0 5px;
      font-size: clamp(1.65rem, 4vw, 2.45rem);
      line-height: 1.05;
    }

    .booking-summary-header p {
      margin: 0;
      color: #5d6c67;
    }

    .booking-summary-close {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 42px;
      height: 42px;
      padding: 0;
      border: 1px solid #dbe6e2;
      border-radius: 50%;
      color: #172521;
      background: #ffffff;
      font: inherit;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
    }

    .booking-summary-content {
      overflow: auto;
      padding: 22px 26px 26px;
    }

    .booking-summary-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.75fr);
      gap: 18px;
      align-items: start;
    }

    .booking-summary-main {
      display: grid;
      gap: 14px;
    }

    .booking-summary-card {
      padding: 19px;
      border: 1px solid #dbe6e2;
      border-radius: 10px;
      background: #ffffff;
    }

    .booking-summary-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 13px;
    }

    .booking-summary-card h3 {
      margin: 0;
      color: #07575b;
      font-size: 0.84rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .booking-summary-edit {
      padding: 4px 0;
      border: 0;
      color: #07575b;
      background: transparent;
      font: inherit;
      font-weight: 850;
      text-decoration: underline;
      text-underline-offset: 3px;
      cursor: pointer;
    }

    .booking-summary-list {
      display: grid;
      gap: 9px;
      margin: 0;
    }

    .booking-summary-row {
      display: grid;
      grid-template-columns: minmax(125px, 0.72fr) minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }

    .booking-summary-row dt {
      color: #5d6c67;
      font-weight: 750;
    }

    .booking-summary-row dd {
      margin: 0;
      color: #172521;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .booking-summary-estimate {
      position: sticky;
      top: 0;
      padding: 22px;
      border: 1px solid rgba(7, 87, 91, 0.24);
      border-radius: 10px;
      background: linear-gradient(145deg, #e8f3ef, #ffffff);
    }

    .booking-summary-estimate-label {
      display: block;
      margin-bottom: 10px;
      color: #07575b;
      font-size: 0.84rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .booking-summary-price {
      display: block;
      margin-bottom: 7px;
      color: #07575b;
      font-size: clamp(1.65rem, 4vw, 2.35rem);
      line-height: 1.05;
    }

    .booking-summary-frequency,
    .booking-summary-monthly,
    .booking-summary-estimate-note {
      display: block;
      color: #405c56;
      font-weight: 750;
    }

    .booking-summary-monthly {
      margin-top: 3px;
    }

    .booking-summary-estimate-note {
      margin: 18px 0 0;
      padding-top: 16px;
      border-top: 1px solid rgba(7, 87, 91, 0.16);
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .booking-summary-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 26px;
      border-top: 1px solid #dbe6e2;
      background: #ffffff;
    }

    .booking-summary-privacy-link {
      color: #07575b;
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .booking-summary-back,
    .booking-summary-send {
      min-height: 48px;
      padding: 11px 18px;
      border-radius: 8px;
      font: inherit;
      font-weight: 850;
      cursor: pointer;
    }

    .booking-summary-back {
      border: 1px solid rgba(7, 87, 91, 0.3);
      color: #07575b;
      background: #ffffff;
    }

    .booking-summary-send {
      border: 1px solid #07575b;
      color: #ffffff;
      background: #07575b;
    }

    .booking-summary-send:hover,
    .booking-summary-send:focus-visible {
      background: #043f42;
    }

    .booking-summary-send:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    @media (max-width: 700px) {
      .booking-summary-overlay {
        place-items: stretch;
        padding: 0;
        background: #f7faf8;
      }

      .booking-summary-dialog {
        width: 100%;
        height: 100dvh;
        max-height: none;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .booking-summary-header {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 17px 16px 14px;
      }

      .booking-summary-header h2 {
        font-size: 1.55rem;
      }

      .booking-summary-header p {
        font-size: 0.92rem;
      }

      .booking-summary-close {
        width: 38px;
        height: 38px;
      }

      .booking-summary-content {
        padding: 14px 14px 24px;
      }

      .booking-summary-layout {
        grid-template-columns: 1fr;
      }

      .booking-summary-estimate {
        position: static;
        order: -1;
      }

      .booking-summary-card,
      .booking-summary-estimate {
        padding: 16px;
      }

      .booking-summary-row {
        grid-template-columns: 1fr;
        gap: 1px;
      }

      .booking-summary-row dt {
        font-size: 0.82rem;
      }

      .booking-summary-footer {
        position: sticky;
        bottom: 0;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
      }

      .booking-summary-send {
        order: -1;
        width: 100%;
      }

      .booking-summary-privacy-link {
        order: 0;
        width: 100%;
        padding: 3px 0;
        text-align: center;
      }

      .booking-summary-back {
        order: 1;
        width: 100%;
        min-height: 40px;
        padding: 7px 14px;
        border-color: transparent;
        background: transparent;
      }
    }
  `;
  document.head.append(style);

  const overlay = document.createElement("div");
  overlay.id = "booking-summary-overlay";
  overlay.className = "booking-summary-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="booking-summary-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-summary-title" aria-describedby="booking-summary-description" tabindex="-1">
      <header class="booking-summary-header">
        <div>
          <h2 id="booking-summary-title">Review your booking</h2>
          <p id="booking-summary-description">Check everything below before sending your request.</p>
        </div>
        <button class="booking-summary-close" type="button" aria-label="Close booking summary">×</button>
      </header>
      <div class="booking-summary-content">
        <div class="booking-summary-layout">
          <div class="booking-summary-main">
            <section class="booking-summary-card">
              <div class="booking-summary-card-header">
                <h3>Appointment</h3>
                <button class="booking-summary-edit" type="button" data-summary-edit="appointment">Edit</button>
              </div>
              <dl class="booking-summary-list">
                <div class="booking-summary-row"><dt>Date and time</dt><dd id="summary-appointment"></dd></div>
              </dl>
            </section>

            <section class="booking-summary-card">
              <div class="booking-summary-card-header">
                <h3>Clean details</h3>
                <button class="booking-summary-edit" type="button" data-summary-edit="clean">Edit</button>
              </div>
              <dl class="booking-summary-list">
                <div class="booking-summary-row"><dt>Cleaning type</dt><dd id="summary-cleaning-type"></dd></div>
                <div class="booking-summary-row"><dt>Coverage</dt><dd id="summary-coverage"></dd></div>
                <div class="booking-summary-row"><dt>Front window sets</dt><dd id="summary-front-sets"></dd></div>
                <div class="booking-summary-row"><dt>Back or side sets</dt><dd id="summary-back-sets"></dd></div>
                <div class="booking-summary-row"><dt>Extras</dt><dd id="summary-extras"></dd></div>
              </dl>
            </section>

            <section class="booking-summary-card">
              <div class="booking-summary-card-header">
                <h3>Your details</h3>
                <button class="booking-summary-edit" type="button" data-summary-edit="details">Edit</button>
              </div>
              <dl class="booking-summary-list">
                <div class="booking-summary-row"><dt>Name</dt><dd id="summary-name"></dd></div>
                <div class="booking-summary-row"><dt>Email</dt><dd id="summary-email"></dd></div>
                <div class="booking-summary-row"><dt>Address</dt><dd id="summary-address"></dd></div>
                <div class="booking-summary-row" id="summary-access-row"><dt>Access notes</dt><dd id="summary-access"></dd></div>
              </dl>
            </section>
          </div>

          <aside class="booking-summary-estimate" aria-label="Your estimate">
            <span class="booking-summary-estimate-label">Your estimate</span>
            <strong class="booking-summary-price" id="summary-price"></strong>
            <span class="booking-summary-frequency" id="summary-frequency"></span>
            <span class="booking-summary-monthly" id="summary-monthly"></span>
            <p class="booking-summary-estimate-note">Your cleaner will check the estimate and confirm the price before beginning. There is nothing to pay until your first clean has been completed.</p>
          </aside>
        </div>
      </div>
      <footer class="booking-summary-footer">
        <button class="booking-summary-back" type="button">Back to booking</button>
        <a class="booking-summary-privacy-link" href="privacy.html" target="_blank" rel="noopener noreferrer" aria-label="Privacy Notice, opens in a new tab">Privacy Notice</a>
        <button class="booking-summary-send" type="button">Send booking request</button>
      </footer>
    </section>
  `;
  document.body.append(overlay);

  const dialog = overlay.querySelector(".booking-summary-dialog");
  const closeButton = overlay.querySelector(".booking-summary-close");
  const backButton = overlay.querySelector(".booking-summary-back");
  const sendButton = overlay.querySelector(".booking-summary-send");
  const summaryAppointment = overlay.querySelector("#summary-appointment");
  const summaryCleaningType = overlay.querySelector("#summary-cleaning-type");
  const summaryCoverage = overlay.querySelector("#summary-coverage");
  const summaryFrontSets = overlay.querySelector("#summary-front-sets");
  const summaryBackSets = overlay.querySelector("#summary-back-sets");
  const summaryExtras = overlay.querySelector("#summary-extras");
  const summaryName = overlay.querySelector("#summary-name");
  const summaryEmail = overlay.querySelector("#summary-email");
  const summaryAddress = overlay.querySelector("#summary-address");
  const summaryAccess = overlay.querySelector("#summary-access");
  const summaryAccessRow = overlay.querySelector("#summary-access-row");
  const summaryPrice = overlay.querySelector("#summary-price");
  const summaryFrequency = overlay.querySelector("#summary-frequency");
  const summaryMonthly = overlay.querySelector("#summary-monthly");

  let previousFocus = null;

  const getSelectedBookingDate = () =>
    Array.from(bookingDateOptions).find((option) => option.checked);

  const getFormValue = (name) => {
    const field = quoteForm.elements.namedItem(name);
    return field && "value" in field ? field.value.trim() : "";
  };

  const getSelectedExtra = () => {
    const selected = document.querySelector(
      '[data-extra-button][aria-pressed="true"], [data-extra-button].is-selected'
    );
    return selected?.dataset.extraValue || "None";
  };

  const getEstimateParts = () => {
    const fullPrice = quoteTotalPrice?.textContent.trim() || "Estimate unavailable";
    const monthly = quoteTotalMonthly && !quoteTotalMonthly.hidden
      ? quoteTotalMonthly.textContent.trim()
      : "";

    const regularMatch = fullPrice.match(/^(£[^-]+?)(?:\s+-\s+every\s+(.+))$/i);
    if (regularMatch) {
      return {
        price: regularMatch[1].trim(),
        frequency: `Every ${regularMatch[2].trim()}`,
        monthly
      };
    }

    return { price: fullPrice, frequency: "", monthly };
  };

  const validateBeforeSummary = () => {
    const requiredFields = Array.from(
      quoteForm.querySelectorAll("#quote-details input[required]")
    );
    const invalidField = requiredFields.find((field) => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return false;
    }

    if (!getSelectedBookingDate()) {
      if (formStatus) {
        formStatus.textContent = "Please choose a cleaning date option before viewing your booking summary.";
      }
      bookingDateStep.hidden = false;
      bookingDateStep.scrollIntoView({ behavior: "smooth", block: "start" });
      return false;
    }

    return true;
  };

  const populateSummary = () => {
    const selectedDate = getSelectedBookingDate();
    const backSets = backWindowCount?.textContent.trim() || "0";
    const backIncluded = backSets !== "0" && !/not needed/i.test(backSets);
    const address = [
      getFormValue("Address line 1"),
      getFormValue("Address line 2"),
      getFormValue("Postcode")
    ].filter(Boolean).join(", ");
    const accessNotes = getFormValue("Access notes");
    const estimate = getEstimateParts();

    summaryAppointment.textContent = selectedDate?.value || "No appointment selected";
    summaryCleaningType.textContent = oneOffClean?.checked ? "One-off clean" : "Regular clean";
    summaryCoverage.textContent = backIncluded ? "Front, back and sides" : "Front only";
    summaryFrontSets.textContent = frontWindowCount?.textContent.trim() || "Not selected";
    summaryBackSets.textContent = backIncluded ? backSets : "None selected";
    summaryExtras.textContent = getSelectedExtra();
    summaryName.textContent = getFormValue("Name") || "Not provided";
    summaryEmail.textContent = getFormValue("Email address") || "Not provided";
    summaryAddress.textContent = address || "Not provided";
    summaryAccess.textContent = accessNotes;
    summaryAccessRow.hidden = !accessNotes;
    summaryPrice.textContent = estimate.price;
    summaryFrequency.textContent = estimate.frequency;
    summaryFrequency.hidden = !estimate.frequency;
    summaryMonthly.textContent = estimate.monthly;
    summaryMonthly.hidden = !estimate.monthly;
  };

  const closeSummary = (restoreFocus = true) => {
    overlay.hidden = true;
    document.body.classList.remove("booking-summary-open");

    if (restoreFocus && previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  };

  const openSummary = () => {
    if (!validateBeforeSummary()) return;

    populateSummary();
    previousFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("booking-summary-open");
    dialog.focus({ preventScroll: true });
  };

  const scrollToSection = (section) => {
    if (!section) return;
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + section.getBoundingClientRect().top - headerHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const editSection = (sectionName) => {
    closeSummary(false);

    if (sectionName === "appointment") {
      bookingDateStep.hidden = false;
      scrollToSection(bookingDateStep);
      return;
    }

    if (sectionName === "details") {
      if (quoteDetails) quoteDetails.hidden = false;
      scrollToSection(quoteDetails);
      return;
    }

    scrollToSection(document.querySelector(".fixed-price-choice"));
  };

  bookCleanButton.type = "button";
  bookCleanButton.addEventListener("click", openSummary);

  document.addEventListener(
    "click",
    (event) => {
      const mobileSummaryButton = event.target.closest("#mobile-summary-button");
      if (!mobileSummaryButton) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      openSummary();
    },
    true
  );

  if (desktopEstimateAction) {
    desktopEstimateAction.addEventListener(
      "click",
      (event) => {
        const stepThreeIsOpen = !bookingDateStep.hidden;
        const dateSelected = Boolean(getSelectedBookingDate());
        const isSummaryAction = desktopEstimateCta?.textContent.trim() === "Booking Summary";

        if (!stepThreeIsOpen || !dateSelected || !isSummaryAction) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        openSummary();
      },
      true
    );
  }

  closeButton.addEventListener("click", () => closeSummary());
  backButton.addEventListener("click", () => closeSummary());

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeSummary();
  });

  overlay.querySelectorAll("[data-summary-edit]").forEach((button) => {
    button.addEventListener("click", () => editSection(button.dataset.summaryEdit));
  });

  sendButton.addEventListener("click", () => {
    if (!validateBeforeSummary()) {
      closeSummary(false);
      return;
    }

    closeSummary(false);
    if (typeof quoteForm.requestSubmit === "function") {
      quoteForm.requestSubmit();
    } else {
      quoteForm.submit();
    }
  });

  quoteForm.addEventListener("submit", (event) => {
    if (event.defaultPrevented) return;
    sendButton.disabled = true;
    sendButton.textContent = "Sending booking request...";
  });

  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSummary();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      overlay.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hidden && element.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.openBookingSummary = openSummary;
})();