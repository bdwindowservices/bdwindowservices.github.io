(() => {
  const ensureTermsLinks = () => {
    if (!document.querySelector("#terms-link-styles")) {
      const termsStyles = document.createElement("style");
      termsStyles.id = "terms-link-styles";
      termsStyles.textContent = `
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 10px 16px;
        }

        .booking-summary-legal-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px 14px;
        }

        .booking-summary-terms-link {
          color: #07575b;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 700px) {
          .booking-summary-footer .booking-summary-legal-links {
            order: 0;
            width: 100%;
          }

          .booking-summary-footer .booking-summary-legal-links .booking-summary-privacy-link,
          .booking-summary-footer .booking-summary-legal-links .booking-summary-terms-link {
            order: initial;
            width: auto;
            padding: 3px 0;
            text-align: center;
          }
        }
      `;
      document.head.append(termsStyles);
    }

    const footerPrivacyLink = document.querySelector(
      'footer .footer-links a[href="privacy.html"]'
    );

    if (
      footerPrivacyLink &&
      !document.querySelector('footer .footer-links a[href="terms.html"]')
    ) {
      const footerTermsLink = document.createElement("a");
      footerTermsLink.href = "terms.html";
      footerTermsLink.target = "_blank";
      footerTermsLink.rel = "noopener noreferrer";
      footerTermsLink.textContent = "Terms & Conditions";
      footerPrivacyLink.insertAdjacentElement("afterend", footerTermsLink);
    }

    const addTermsToSummary = () => {
      const overlay = document.querySelector("#booking-summary-overlay");
      const privacyLink = overlay?.querySelector(".booking-summary-privacy-link");
      if (!overlay || !privacyLink) return false;

      let legalLinks = overlay.querySelector(".booking-summary-legal-links");
      if (!legalLinks) {
        legalLinks = document.createElement("span");
        legalLinks.className = "booking-summary-legal-links";
        privacyLink.replaceWith(legalLinks);
        legalLinks.append(privacyLink);
      }

      if (!legalLinks.querySelector('a[href="terms.html"]')) {
        const termsLink = document.createElement("a");
        termsLink.className = "booking-summary-terms-link";
        termsLink.href = "terms.html";
        termsLink.target = "_blank";
        termsLink.rel = "noopener noreferrer";
        termsLink.setAttribute(
          "aria-label",
          "Terms and Conditions, opens in a new tab"
        );
        termsLink.textContent = "Terms & Conditions";
        legalLinks.append(termsLink);
      }

      return true;
    };

    if (!addTermsToSummary()) {
      const termsObserver = new MutationObserver(() => {
        if (addTermsToSummary()) termsObserver.disconnect();
      });

      termsObserver.observe(document.body, { childList: true });
    }
  };

  ensureTermsLinks();

  const params = new URLSearchParams(window.location.search);
  const bookingWasSent = params.get("quote") === "sent";

  if (bookingWasSent) {
    const confirmation = document.querySelector("#quote-status");

    if (confirmation) {
      confirmation.innerHTML = `
        <strong>Thank you, your appointment request has been sent successfully.</strong>
        <span>We will email you confirmation of your booked appointment. For any changes to your appointment or anything urgent please email us on <a href="mailto:bdwindowservices@gmail.com">bdwindowservices@gmail.com</a>.</span>
      `;

      const positionMobileConfirmation = () => {
        if (window.innerWidth > 640) return;

        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const confirmationTop =
          window.scrollY + confirmation.getBoundingClientRect().top;
        const destination = Math.max(0, confirmationTop - headerHeight - 18);

        window.scrollTo({ top: destination, behavior: "auto" });
      };

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(positionMobileConfirmation);
      });
      window.setTimeout(positionMobileConfirmation, 450);
    }

    document
      .querySelectorAll(".desktop-action-bar, .mobile-action-bar")
      .forEach((banner) => {
        banner.hidden = true;
        banner.setAttribute("aria-hidden", "true");
        banner.style.setProperty("display", "none", "important");
      });
  }

  const quoteForm = document.querySelector("#quote-form");
  const quoteDetails = document.querySelector("#quote-details");
  const bookingNextButton = document.querySelector("#booking-next-button");

  if (!quoteForm || !quoteDetails) return;

  let mobileInput = quoteForm.elements.namedItem("Mobile number");

  if (!mobileInput) {
    const postcodeInput = quoteForm.elements.namedItem("Postcode");
    const postcodeLabel = postcodeInput?.closest("label");
    const mobileLabel = document.createElement("label");

    mobileLabel.innerHTML = 'Mobile number<input name="Mobile number" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. 07598 123456" required>';

    if (postcodeLabel) {
      postcodeLabel.insertAdjacentElement("afterend", mobileLabel);
    } else {
      quoteDetails.prepend(mobileLabel);
    }

    mobileInput = mobileLabel.querySelector("input");
  }

  if (bookingNextButton && mobileInput) {
    bookingNextButton.addEventListener(
      "click",
      (event) => {
        if (mobileInput.checkValidity()) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        mobileInput.reportValidity();
        mobileInput.focus();
      },
      true
    );
  }

  const addMobileToSummary = () => {
    const overlay = document.querySelector("#booking-summary-overlay");
    const summaryEmail = overlay?.querySelector("#summary-email");
    if (!overlay || !summaryEmail) return false;

    let summaryMobile = overlay.querySelector("#summary-mobile");

    if (!summaryMobile) {
      const mobileRow = document.createElement("div");
      mobileRow.className = "booking-summary-row";
      mobileRow.innerHTML = '<dt>Mobile number</dt><dd id="summary-mobile"></dd>';
      summaryEmail.closest(".booking-summary-row")?.insertAdjacentElement("afterend", mobileRow);
      summaryMobile = mobileRow.querySelector("#summary-mobile");
    }

    const updateMobileSummary = () => {
      if (!summaryMobile) return;
      summaryMobile.textContent = mobileInput?.value.trim() || "Not provided";
    };

    const overlayObserver = new MutationObserver(() => {
      if (!overlay.hidden) updateMobileSummary();
    });

    overlayObserver.observe(overlay, {
      attributes: true,
      attributeFilter: ["hidden"]
    });

    if (!overlay.hidden) updateMobileSummary();
    return true;
  };

  if (!addMobileToSummary()) {
    const bodyObserver = new MutationObserver(() => {
      if (addMobileToSummary()) bodyObserver.disconnect();
    });

    bodyObserver.observe(document.body, { childList: true });
  }
})();