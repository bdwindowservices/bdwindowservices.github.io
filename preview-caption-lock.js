(() => {
  const exactPictureCaptions = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets.",
    "9+ bespoke": "9+ front window sets selected. We will confirm a bespoke quote."
  };

  const frontCount = document.querySelector("#front-window-count");
  const caption = document.querySelector("#window-preview-caption");

  if (frontCount && caption) {
    let applyingCaption = false;

    const applyExactPictureCaption = () => {
      if (applyingCaption) return;

      const exactCaption = exactPictureCaptions[frontCount.textContent.trim()];
      if (!exactCaption || caption.textContent.trim() === exactCaption) return;

      applyingCaption = true;
      caption.textContent = exactCaption;
      applyingCaption = false;
    };

    const scheduleExactPictureCaption = () => {
      queueMicrotask(applyExactPictureCaption);
      window.setTimeout(applyExactPictureCaption, 0);
      window.requestAnimationFrame(applyExactPictureCaption);
    };

    const frontCountObserver = new MutationObserver(scheduleExactPictureCaption);
    frontCountObserver.observe(frontCount, {
      childList: true,
      characterData: true,
      subtree: true
    });

    const captionObserver = new MutationObserver(applyExactPictureCaption);
    captionObserver.observe(caption, {
      childList: true,
      characterData: true,
      subtree: true
    });

    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", scheduleExactPictureCaption);
      });

    scheduleExactPictureCaption();
  }

  const quoteDetails = document.querySelector("#quote-details");
  const quoteNextButton = document.querySelector("#quote-next-button");
  const bookingDateStep = document.querySelector("#booking-date-step");
  const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
  const bookingNextHint = document.querySelector("#booking-next-hint");
  const bookingNextButton = document.querySelector("#booking-next-button");
  const bookCleanButton = document.querySelector("#book-clean-button");
  const desktopEstimateMain = document.querySelector("#desktop-estimate-main");
  const desktopEstimateCta = document.querySelector("#desktop-estimate-cta");
  const mobileActionBar = document.querySelector(".mobile-action-bar");
  const mobileQuoteAmount = document.querySelector("#mobile-quote-amount");
  const appointmentPrompt = "Step 3: choose your appointment date and time";
  const chooseDateLabel = "Choose a date";
  const bookingSummaryLabel = "Booking Summary";
  const datePromptSuffix = " - Choose a cleaning date";

  let mobileSummaryButton = document.querySelector("#mobile-summary-button");

  if (mobileActionBar && !mobileSummaryButton) {
    mobileSummaryButton = document.createElement("button");
    mobileSummaryButton.id = "mobile-summary-button";
    mobileSummaryButton.type = "button";
    mobileSummaryButton.textContent = bookingSummaryLabel;
    mobileSummaryButton.hidden = true;
    mobileActionBar.append(mobileSummaryButton);
  }

  if (!document.querySelector("#mobile-summary-action-styles")) {
    const mobileSummaryStyles = document.createElement("style");
    mobileSummaryStyles.id = "mobile-summary-action-styles";
    mobileSummaryStyles.textContent = `
      @media (max-width: 640px) {
        .mobile-action-bar.has-summary-action {
          grid-template-columns: minmax(0, 1fr) minmax(124px, 0.72fr);
        }

        .mobile-action-bar.has-summary-action #mobile-quote-amount {
          justify-items: start;
          padding: 8px 10px;
          text-align: left;
          pointer-events: none;
        }

        #mobile-summary-button {
          display: grid;
          place-items: center;
          min-height: 52px;
          padding: 8px 10px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #07575b;
          font: inherit;
          font-weight: 850;
          line-height: 1.15;
          text-align: center;
          cursor: pointer;
        }

        #mobile-summary-button:hover,
        #mobile-summary-button:focus-visible {
          background: #043f42;
        }

        #mobile-summary-button:focus-visible {
          outline: 3px solid rgba(15, 139, 141, 0.24);
          outline-offset: 2px;
        }

        #mobile-summary-button[hidden] {
          display: none;
        }
      }
    `;
    document.head.append(mobileSummaryStyles);
  }

  const getSelectedBookingDate = () =>
    Array.from(bookingDateOptions).find((option) => option.checked);

  const hasSelectedBookingDate = () => Boolean(getSelectedBookingDate());

  const removeDatePromptFromMobileBanner = () => {
    const mobileMain = mobileQuoteAmount?.querySelector("span");
    if (mobileMain && mobileMain.textContent.includes(datePromptSuffix)) {
      mobileMain.textContent = mobileMain.textContent.replace(datePromptSuffix, "");
    }
  };

  const removeDatePromptFromDesktopBanner = () => {
    if (
      desktopEstimateMain &&
      desktopEstimateMain.textContent.includes(datePromptSuffix)
    ) {
      desktopEstimateMain.textContent = desktopEstimateMain.textContent.replace(
        datePromptSuffix,
        ""
      );
    }
  };

  const scrollToBookingSummaryButton = () => {
    if (!bookCleanButton) return;

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const buttonTop = window.scrollY + bookCleanButton.getBoundingClientRect().top;
    const destination = Math.max(0, buttonTop - headerHeight - 18);

    window.scrollTo({ top: destination, behavior: "smooth" });
    window.setTimeout(() => {
      bookCleanButton.focus({ preventScroll: true });
    }, 350);
  };

  const updateAppointmentStep = () => {
    if (!bookingDateStep) return;

    const legend = bookingDateStep.querySelector(":scope > legend");
    if (legend) legend.remove();

    bookingDateStep.setAttribute("aria-label", "Choose your appointment date and time");

    const stepTwoIsOpen = Boolean(quoteDetails && !quoteDetails.hidden);
    const stepThreeIsOpen = !bookingDateStep.hidden;
    const selectedBookingDate = getSelectedBookingDate();
    const dateSelected = Boolean(selectedBookingDate);
    const targetButtonLabel = dateSelected ? bookingSummaryLabel : chooseDateLabel;
    const showMobileSummaryAction = stepThreeIsOpen && dateSelected;

    if (quoteNextButton && quoteNextButton.hidden !== stepTwoIsOpen) {
      quoteNextButton.hidden = stepTwoIsOpen;
    }

    if (bookingNextButton && bookingNextButton.hidden !== stepThreeIsOpen) {
      bookingNextButton.hidden = stepThreeIsOpen;
    }

    if (
      bookingNextHint &&
      stepThreeIsOpen &&
      bookingNextHint.textContent.trim() !== appointmentPrompt
    ) {
      bookingNextHint.textContent = appointmentPrompt;
    }

    if (bookCleanButton) {
      const isSubmitting =
        bookCleanButton.disabled &&
        bookCleanButton.textContent.toLowerCase().includes("sending");

      if (!isSubmitting && bookCleanButton.textContent.trim() !== targetButtonLabel) {
        bookCleanButton.textContent = targetButtonLabel;
      }
    }

    if (desktopEstimateCta) {
      const currentLabel = desktopEstimateCta.textContent.trim();

      if (stepThreeIsOpen && currentLabel !== targetButtonLabel) {
        desktopEstimateCta.textContent = targetButtonLabel;
      } else if (
        !stepThreeIsOpen &&
        (currentLabel === chooseDateLabel || currentLabel === bookingSummaryLabel)
      ) {
        desktopEstimateCta.textContent = "Book clean";
      }
    }

    if (mobileSummaryButton) {
      mobileSummaryButton.hidden = !showMobileSummaryAction;
      mobileSummaryButton.setAttribute(
        "aria-label",
        selectedBookingDate
          ? `View booking summary for ${selectedBookingDate.value}`
          : bookingSummaryLabel
      );
    }

    if (mobileActionBar) {
      mobileActionBar.classList.toggle("has-summary-action", showMobileSummaryAction);
      mobileActionBar.classList.toggle("is-single-action", !showMobileSummaryAction);
    }

    if (mobileQuoteAmount) {
      if (showMobileSummaryAction) {
        mobileQuoteAmount.setAttribute("aria-disabled", "true");
        mobileQuoteAmount.setAttribute("tabindex", "-1");
      } else {
        mobileQuoteAmount.removeAttribute("aria-disabled");
        mobileQuoteAmount.removeAttribute("tabindex");
      }
    }

    if (stepThreeIsOpen) {
      removeDatePromptFromMobileBanner();
    }

    if (stepThreeIsOpen && dateSelected) {
      removeDatePromptFromDesktopBanner();
    }
  };

  if (quoteDetails) {
    const quoteDetailsObserver = new MutationObserver(updateAppointmentStep);
    quoteDetailsObserver.observe(quoteDetails, {
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }

  if (bookingDateStep) {
    const bookingStepObserver = new MutationObserver(updateAppointmentStep);
    bookingStepObserver.observe(bookingDateStep, {
      attributes: true,
      attributeFilter: ["hidden"],
      childList: true
    });
  }

  if (bookingNextHint) {
    const bookingHintObserver = new MutationObserver(updateAppointmentStep);
    bookingHintObserver.observe(bookingNextHint, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (bookCleanButton) {
    const bookButtonObserver = new MutationObserver(updateAppointmentStep);
    bookButtonObserver.observe(bookCleanButton, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (desktopEstimateMain) {
    const desktopMainObserver = new MutationObserver(updateAppointmentStep);
    desktopMainObserver.observe(desktopEstimateMain, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (desktopEstimateCta) {
    const desktopCtaObserver = new MutationObserver(updateAppointmentStep);
    desktopCtaObserver.observe(desktopEstimateCta, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (mobileQuoteAmount) {
    const mobileBannerObserver = new MutationObserver(updateAppointmentStep);
    mobileBannerObserver.observe(mobileQuoteAmount, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  bookingDateOptions.forEach((option) => {
    option.addEventListener("change", updateAppointmentStep);
  });

  if (bookingNextButton) {
    bookingNextButton.addEventListener("click", () => {
      window.setTimeout(updateAppointmentStep, 0);
    });
  }

  if (mobileSummaryButton) {
    mobileSummaryButton.addEventListener("click", scrollToBookingSummaryButton);
  }

  if (!document.querySelector('script[data-booking-summary-script]')) {
    const bookingSummaryScript = document.createElement("script");
    bookingSummaryScript.src = "booking-summary.js?v=20260802-2";
    bookingSummaryScript.dataset.bookingSummaryScript = "true";
    document.body.append(bookingSummaryScript);
  }

  updateAppointmentStep();
})();