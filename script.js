const year = document.querySelector("#year");
const quoteForm = document.querySelector("#quote-form");
const quoteStatus = document.querySelector("#quote-status");
const quoteReference = document.querySelector("#quote-reference");
const params = new URLSearchParams(window.location.search);
const counterButtons = document.querySelectorAll("[data-counter-action]");
const frontWindowCount = document.querySelector("#front-window-count");
const backWindowCount = document.querySelector("#back-window-count");
const frontWindowSetsInput = document.querySelector("#front-window-sets-input");
const backSideWindowSetsInput = document.querySelector("#back-side-window-sets-input");
const frontOnlyClean = document.querySelector("#front-only-clean");
const frontOnlyInput = document.querySelector("#front-only-input");
const extrasInput = document.querySelector("#extras-input");
const extraButtons = document.querySelectorAll("[data-extra-button]");
const previewGrid = document.querySelector("#window-preview-grid");
const previewCaption = document.querySelector("#window-preview-caption");
const quoteTotal = document.querySelector("#quote-total");
const quoteTotalPrice = document.querySelector("#quote-total-price");
const quoteTotalMonthly = document.querySelector("#quote-total-monthly");
const estimatedQuoteInput = document.querySelector("#estimated-quote");
const mobileActionBar = document.querySelector(".mobile-action-bar");
const mobileQuoteAmount = document.querySelector("#mobile-quote-amount");
const desktopActionBar = document.querySelector(".desktop-action-bar");
const desktopEstimateAction = document.querySelector("#desktop-estimate-action");
const desktopEstimateMain = document.querySelector("#desktop-estimate-main");
const desktopEstimateSub = document.querySelector("#desktop-estimate-sub");
const desktopEstimateCta = document.querySelector("#desktop-estimate-cta");
const quoteNextButton = document.querySelector("#quote-next-button");
const quoteNextHint = document.querySelector("#quote-next-hint");
const quoteDetails = document.querySelector("#quote-details");
const requiredQuoteDetailInputs = document.querySelectorAll("#quote-details input[required]");
const bookingNextButton = document.querySelector("#booking-next-button");
const bookingNextHint = document.querySelector("#booking-next-hint");
const bookingDateStep = document.querySelector("#booking-date-step");
const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
const bookCleanButton = document.querySelector("#book-clean-button");
const formStatus = document.querySelector("#form-status");
const bookingResponse = document.querySelector("#booking-response");
const mobileQuoteDefaultHref = mobileQuoteAmount ? mobileQuoteAmount.getAttribute("href") : "";
const mobileQuoteDefaultText = mobileQuoteAmount ? mobileQuoteAmount.textContent : "";
const desktopEstimateDefaultMain = desktopEstimateMain ? desktopEstimateMain.textContent : "";
const desktopEstimateDefaultSub = desktopEstimateSub ? desktopEstimateSub.textContent : "";
const desktopEstimateDefaultCta = desktopEstimateCta ? desktopEstimateCta.textContent : "";
const frontOptions = [
  { label: "1 to 2", emailLabel: "1 to 2 sets", previewSets: 2, price: 12 },
  { label: "3 to 4", emailLabel: "3 to 4 sets", previewSets: 3, price: 15 },
  { label: "5 to 6", emailLabel: "5 to 6 sets", previewSets: 5, price: 18 },
  { label: "7 to 8", emailLabel: "7 to 8 sets", previewSets: 7, price: 21 },
  { label: "9+ bespoke", emailLabel: "9+ sets - bespoke quote", previewSets: 0, price: null, bespoke: true }
];
const backOptions = [
  { label: "0", emailLabel: "No back or side sets selected", previewSets: 0, price: 0 },
  { label: "1 to 2", emailLabel: "1 to 2 sets", previewSets: 2, price: 5 },
  { label: "3 to 4", emailLabel: "3 to 4 sets", previewSets: 4, price: 8 },
  { label: "5 to 6", emailLabel: "5 to 6 sets", previewSets: 6, price: 11 },
  { label: "7 to 8", emailLabel: "7 to 8 sets", previewSets: 8, price: 14 },
  { label: "9+ bespoke", emailLabel: "9+ sets - bespoke quote", previewSets: 0, price: null, bespoke: true }
];
const quoteState = {
  frontIndex: 1,
  backIndex: 0,
  frontOnly: false,
  extra: "",
  extraPrice: 0,
  priceChanged: false
};
const formatCleaningDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long"
});
let bookingSubmissionPending = false;
let bookingConfirmationShown = false;

if (year) {
  year.textContent = new Date().getFullYear();
}

const positionBookingConfirmation = () => {
  if (!quoteStatus || quoteStatus.hidden) {
    return;
  }

  requestAnimationFrame(() => {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const confirmationTop = window.scrollY + quoteStatus.getBoundingClientRect().top;
    const destination = Math.max(0, confirmationTop - headerHeight - 16);

    window.scrollTo({ top: destination, behavior: "auto" });
  });
};

const showBookingConfirmation = (reference) => {
  if (!quoteStatus || bookingConfirmationShown) {
    return;
  }

  bookingConfirmationShown = true;
  bookingSubmissionPending = false;

  const confirmationTitle = quoteStatus.querySelector("strong");
  if (confirmationTitle) {
    confirmationTitle.textContent = "Thank you, your booking request has been sent.";
  }
  if (quoteReference) {
    quoteReference.textContent = reference
      ? `Booking reference: ${reference}. A confirmation email is on its way. If it is not in your inbox, please check your spam folder.`
      : "A confirmation email is on its way. If it is not in your inbox, please check your spam folder.";
  }

  const confirmationUrl = new URL(window.location.href);
  confirmationUrl.searchParams.set("quote", "sent");
  if (reference) {
    confirmationUrl.searchParams.set("reference", reference);
  } else {
    confirmationUrl.searchParams.delete("reference");
  }
  confirmationUrl.hash = "quote-status";
  window.history.replaceState(null, "", confirmationUrl);

  document.body.classList.add("booking-complete");
  quoteStatus.classList.add("is-complete");
  quoteStatus.hidden = false;

  if (quoteForm) {
    quoteForm.reset();
    quoteForm.hidden = true;
    quoteForm.setAttribute("aria-hidden", "true");
  }
  if (bookingResponse) {
    bookingResponse.hidden = true;
  }
  if (mobileActionBar) {
    mobileActionBar.hidden = true;
  }
  if (desktopActionBar) {
    desktopActionBar.hidden = true;
  }

  quoteStatus.focus({ preventScroll: true });

  if (document.readyState === "complete") {
    positionBookingConfirmation();
  } else {
    window.addEventListener("load", positionBookingConfirmation, { once: true });
  }
};

if (params.get("quote") === "sent") {
  showBookingConfirmation(params.get("reference"));
}

const formatMoney = (value) => {
  const number = Number(value);
  return Number.isInteger(number) ? `£${number}` : `£${number.toFixed(2)}`;
};

const getFrontOption = () => frontOptions[quoteState.frontIndex];

const getBackOption = () => backOptions[quoteState.backIndex];

const hasCompleteQuoteSelection = () => Boolean(getFrontOption());

const markPriceChanged = () => {
  quoteState.priceChanged = true;
};

const getCheckedOption = (options) => Array.from(options).find((option) => option.checked);

const setSingleCheckedOption = (selectedOption, options) => {
  if (!selectedOption.checked) {
    return;
  }

  options.forEach((option) => {
    if (option !== selectedOption) {
      option.checked = false;
    }
  });
};

const clearOptions = (options) => {
  options.forEach((option) => {
    option.checked = false;
  });
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const isCleaningDay = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 4;
};

const moveToCleaningDay = (date) => {
  let nextDate = new Date(date);
  while (!isCleaningDay(nextDate)) {
    nextDate = addDays(nextDate, 1);
  }
  return nextDate;
};

const getAvailableCleaningDates = () => {
  const firstDate = moveToCleaningDay(addDays(new Date(), 2));
  const dates = [firstDate];

  while (dates.length < 4) {
    const followingDate = moveToCleaningDay(addDays(dates[dates.length - 1], 1));
    dates.push(followingDate);
  }

  return dates;
};

const updateBookingDateOptions = () => {
  const dates = getAvailableCleaningDates();

  document.querySelectorAll("[data-booking-date-index]").forEach((option) => {
    const dateIndex = Number(option.dataset.bookingDateIndex);
    const slot = option.dataset.bookingSlot;
    const dateText = formatCleaningDate.format(dates[dateIndex]);
    const label = `${dateText}, ${slot}`;
    option.value = label;
    option.parentElement.lastChild.textContent = label;
  });
};

const validateQuoteDetails = () => {
  const invalidField = Array.from(requiredQuoteDetailInputs).find((field) => !field.checkValidity());
  if (!invalidField) {
    return true;
  }

  invalidField.reportValidity();
  invalidField.focus();
  return false;
};

const closeBookingDateStep = () => {
  if (bookingDateStep) {
    bookingDateStep.hidden = true;
  }
  clearOptions(bookingDateOptions);
  if (formStatus) {
    formStatus.textContent = "";
  }
};

const setQuoteProgressState = (isInProgress) => {
  if (quoteTotal) {
    quoteTotal.classList.toggle("is-in-progress", isInProgress);
  }
};

const setMobileActionText = (text) => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = text;
  mobileQuoteAmount.setAttribute("href", "#quote");
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const resetMobileQuoteAmount = () => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = mobileQuoteDefaultText;
  mobileQuoteAmount.setAttribute("href", mobileQuoteDefaultHref);
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const updateMobileQuoteAmount = (price, monthly) => {
  if (!mobileQuoteAmount) {
    return;
  }

  if (!quoteState.priceChanged) {
    resetMobileQuoteAmount();
    return;
  }

  if (!monthly) {
    mobileQuoteAmount.innerHTML = `<span>${price}</span><small>We will confirm the price</small>`;
  } else {
    mobileQuoteAmount.innerHTML = `<span>${price} per clean - every 6–7 weeks</span><small>Paid as ${monthly}/month</small>`;
  }
  mobileQuoteAmount.setAttribute("href", "#quote");
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const setDesktopEstimateState = (main, sub, cta, state) => {
  if (desktopEstimateMain) {
    desktopEstimateMain.textContent = main;
  }
  if (desktopEstimateSub) {
    desktopEstimateSub.innerHTML = sub;
  }
  if (desktopEstimateCta) {
    desktopEstimateCta.textContent = cta;
  }
  if (desktopActionBar) {
    desktopActionBar.classList.toggle("is-progress", state === "progress");
    desktopActionBar.classList.toggle("is-ready", state === "ready");
  }
};

const resetDesktopEstimateAmount = () => {
  setDesktopEstimateState(
    desktopEstimateDefaultMain,
    desktopEstimateDefaultSub,
    desktopEstimateDefaultCta,
    "idle"
  );
};

const updateDesktopEstimateAmount = (price, monthly) => {
  const hasChangedPrice = quoteState.priceChanged;

  setDesktopEstimateState(
    hasChangedPrice ? (monthly ? `${price} per clean - every 6–7 weeks` : price) : desktopEstimateDefaultMain,
    hasChangedPrice ? (monthly ? `Paid as ${monthly}/month` : "We will confirm the price") : desktopEstimateDefaultSub,
    hasChangedPrice ? "Book clean" : "See prices",
    hasChangedPrice ? "ready" : "idle"
  );
};

const updateHiddenQuoteFields = () => {
  const frontOption = getFrontOption();
  const backOption = getBackOption();

  if (frontWindowSetsInput) {
    frontWindowSetsInput.value = `Front: ${frontOption.emailLabel}`;
  }
  if (backSideWindowSetsInput) {
    backSideWindowSetsInput.value = quoteState.frontOnly
      ? "Not required - Front Only Clean"
      : `Back or side: ${backOption.emailLabel}`;
  }
  if (frontOnlyInput) {
    frontOnlyInput.value = quoteState.frontOnly ? "Yes" : "No";
  }
  if (extrasInput) {
    extrasInput.value = quoteState.extra || "No extras selected";
  }
};

const updateWindowPreview = () => {
  if (!previewGrid) {
    return;
  }

  const frontOption = getFrontOption();
  const isBespoke = Boolean(frontOption.bespoke);
  const totalSets = isBespoke ? 0 : frontOption.previewSets;
  previewGrid.innerHTML = "";
  previewGrid.dataset.windowCount = String(totalSets);

  for (let index = 0; index < totalSets; index += 1) {
    const windowSet = document.createElement("span");
    windowSet.className = "preview-window-set";
    windowSet.setAttribute("aria-hidden", "true");
    previewGrid.append(windowSet);
  }

  if (previewCaption) {
    if (isBespoke) {
      previewCaption.textContent = "9+ front window sets selected. We will confirm a bespoke quote.";
      return;
    }
    previewCaption.textContent = `Front example: ${frontOption.label} window sets.`;
  }
};

const setFloatingBookingDatePrompt = () => {
  const price = quoteTotalPrice ? quoteTotalPrice.textContent : "";
  const monthly = quoteTotalMonthly ? quoteTotalMonthly.innerHTML : "";
  const isBespoke = Boolean(getFrontOption().bespoke || (!quoteState.frontOnly && getBackOption().bespoke));

  if (price && desktopEstimateMain) {
    desktopEstimateMain.textContent = `${price} - Choose a cleaning date`;
  }
  if (desktopEstimateSub) {
    desktopEstimateSub.innerHTML = monthly;
  }
  if (desktopEstimateCta) {
    desktopEstimateCta.textContent = "Book clean";
  }
  if (desktopActionBar) {
    desktopActionBar.classList.add("is-ready");
    desktopActionBar.classList.remove("is-progress");
  }
  if (price && monthly && mobileQuoteAmount) {
    mobileQuoteAmount.innerHTML = `<span>${price} - Choose a cleaning date</span><small>${monthly}</small>`;
  }
};

const closeQuoteDetails = () => {
  if (quoteDetails) {
    quoteDetails.hidden = true;
  }
  closeBookingDateStep();
};

const updateQuoteStep = (hasCompleteSelection) => {
  if (quoteNextButton) {
    quoteNextButton.disabled = !hasCompleteSelection;
  }
  if (!quoteNextHint) {
    return;
  }

  quoteNextHint.textContent = hasCompleteSelection
    ? "Monthly payments spread the cost throughout the year."
    : "Add front window sets to continue.";
};

const updateQuoteTotal = () => {
  const frontOption = getFrontOption();
  const backOption = getBackOption();
  const isBespoke = Boolean(frontOption.bespoke || (!quoteState.frontOnly && backOption.bespoke));

  setQuoteProgressState(false);
  if (quoteTotal) {
    quoteTotal.hidden = false;
  }

  if (!hasCompleteQuoteSelection()) {
    if (quoteTotalPrice) {
      quoteTotalPrice.textContent = "£-";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "Add front window sets to see your estimate.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    resetMobileQuoteAmount();
    resetDesktopEstimateAmount();
    updateQuoteStep(false);
    updateHiddenQuoteFields();
    updateWindowPreview();
    closeQuoteDetails();
    return;
  }

  if (isBespoke) {
    const bespokeLabels = [];
    if (frontOption.bespoke) {
      bespokeLabels.push(`Front: ${frontOption.emailLabel}`);
    }
    if (!quoteState.frontOnly && backOption.bespoke) {
      bespokeLabels.push(`Back or side: ${backOption.emailLabel}`);
    }

    if (quoteTotalPrice) {
      quoteTotalPrice.textContent = "Bespoke quote";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "We will confirm the price with you.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = `Bespoke quote (${bespokeLabels.join("; ")})`;
    }

    updateQuoteStep(true);
    updateHiddenQuoteFields();
    updateWindowPreview();
    updateMobileQuoteAmount("Bespoke quote", "");
    updateDesktopEstimateAmount("Bespoke quote", "");
    return;
  }

  const backSideExtra = quoteState.frontOnly ? 0 : backOption.price;
  const totalPrice = frontOption.price + backSideExtra + quoteState.extraPrice;
  const monthlyPrice = totalPrice * 2 / 3;
  const price = formatMoney(totalPrice);
  const monthly = formatMoney(monthlyPrice);

  if (quoteTotalPrice) {
    quoteTotalPrice.textContent = `${price} per clean - every 6–7 weeks`;
  }
  if (quoteTotalMonthly) {
    quoteTotalMonthly.textContent = `Paid as ${monthly}/month`;
  }
  if (estimatedQuoteInput) {
    estimatedQuoteInput.value = `${price} per clean - every 6–7 weeks; Paid as ${monthly}/month`;
  }

  updateQuoteStep(true);
  updateHiddenQuoteFields();
  updateWindowPreview();
  updateMobileQuoteAmount(price, monthly);
  updateDesktopEstimateAmount(price, monthly);
};

const updateCounters = () => {
  const backCard = document.querySelector('[data-counter-card="back"]');

  if (frontWindowCount) {
    frontWindowCount.textContent = getFrontOption().label;
  }
  if (backWindowCount) {
    backWindowCount.textContent = quoteState.frontOnly ? "Not needed" : getBackOption().label;
  }
  if (backCard) {
    backCard.classList.toggle("is-disabled", quoteState.frontOnly);
  }

  counterButtons.forEach((button) => {
    const target = button.dataset.counterTarget;
    const action = button.dataset.counterAction;
    const value = target === "front" ? quoteState.frontIndex : quoteState.backIndex;
    const max = target === "front" ? frontOptions.length - 1 : backOptions.length - 1;
    button.disabled = (target === "back" && quoteState.frontOnly) || (action === "decrease" && value <= 0) || (action === "increase" && value >= max);
  });
};

const updateExtraButtons = () => {
  extraButtons.forEach((button) => {
    const isSelected = quoteState.extra === button.dataset.extraValue;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
};

const scrollToFormStep = (anchor) => {
  if (!anchor) {
    return;
  }

  requestAnimationFrame(() => {
    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const anchorTop = window.scrollY + anchor.getBoundingClientRect().top;
    const destination = Math.max(0, anchorTop - headerHeight - 18);

    window.scrollTo({ top: destination, behavior: "smooth" });
  });
};

const openBookingDateStep = () => {
  if (!validateQuoteDetails()) {
    return;
  }

  updateBookingDateOptions();
  if (bookingDateStep) {
    bookingDateStep.hidden = false;
  }
  if (bookingNextHint) {
    bookingNextHint.textContent = "Step 3: choose a cleaning date before sending your request.";
  }
  setFloatingBookingDatePrompt();
  scrollToFormStep(bookingNextHint || bookingDateStep);
};

const openQuoteDetails = () => {
  if (!hasCompleteQuoteSelection()) {
    updateQuoteStep(false);
    if (quoteTotal) {
      quoteTotal.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  if (quoteDetails) {
    quoteDetails.hidden = false;
  }
  closeBookingDateStep();
  if (quoteNextHint) {
    quoteNextHint.textContent = "Step 2: send your details to book a clean right now.";
  }

  scrollToFormStep(quoteNextHint || quoteDetails);
};

const handleFloatingEstimateAction = (event) => {
  if (!hasCompleteQuoteSelection() || !quoteState.priceChanged) {
    return;
  }

  event.preventDefault();

  if (quoteDetails && !quoteDetails.hidden) {
    openBookingDateStep();
    return;
  }

  openQuoteDetails();
};

counterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.counterTarget;
    const action = button.dataset.counterAction;
    const direction = action === "increase" ? 1 : -1;

    markPriceChanged();

    if (target === "front") {
      quoteState.frontIndex = Math.min(frontOptions.length - 1, Math.max(0, quoteState.frontIndex + direction));
    }
    if (target === "back" && !quoteState.frontOnly) {
      quoteState.backIndex = Math.min(backOptions.length - 1, Math.max(0, quoteState.backIndex + direction));
    }

    updateCounters();
    updateQuoteTotal();
  });
});

if (frontOnlyClean) {
  frontOnlyClean.addEventListener("change", () => {
    markPriceChanged();
    quoteState.frontOnly = frontOnlyClean.checked;
    if (quoteState.frontOnly) {
      quoteState.backIndex = 0;
    }
    updateCounters();
    updateQuoteTotal();
  });
}

extraButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.extraValue;
    const isSelected = quoteState.extra === value;
    markPriceChanged();
    quoteState.extra = isSelected ? "" : value;
    quoteState.extraPrice = isSelected ? 0 : Number(button.dataset.extraPrice || 0);
    updateExtraButtons();
    updateQuoteTotal();
  });
});

bookingDateOptions.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, bookingDateOptions);
    if (formStatus) {
      formStatus.textContent = "";
    }
  });
});

if (desktopEstimateAction) {
  desktopEstimateAction.addEventListener("click", handleFloatingEstimateAction);
}

if (mobileQuoteAmount) {
  mobileQuoteAmount.addEventListener("click", handleFloatingEstimateAction);
}

if (quoteNextButton && quoteDetails) {
  quoteNextButton.addEventListener("click", openQuoteDetails);
}

if (bookingNextButton && bookingDateStep) {
  bookingNextButton.addEventListener("click", openBookingDateStep);
}

const isTrustedBookingOrigin = (origin) => {
  return origin === "null"
    || origin === "https://script.google.com"
    || /^https:\/\/([a-z0-9-]+\.)*googleusercontent\.com$/.test(origin);
};

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!isTrustedBookingOrigin(event.origin) || !message || message.source !== "bd-booking-service") {
    return;
  }

  if (message.status === "success") {
    showBookingConfirmation(String(message.reference || ""));
    return;
  }

  bookingSubmissionPending = false;
  if (bookCleanButton) {
    bookCleanButton.disabled = false;
    bookCleanButton.textContent = "Confirm booking";
  }
  if (formStatus) {
    formStatus.textContent = "We could not complete your booking. Please try again or contact us directly.";
  }
});

if (bookingResponse) {
  bookingResponse.addEventListener("load", () => {
    if (!bookingSubmissionPending || bookingConfirmationShown) {
      return;
    }

    window.setTimeout(() => {
      if (bookingSubmissionPending && !bookingConfirmationShown) {
        showBookingConfirmation("");
      }
    }, 500);
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    if (!validateQuoteDetails()) {
      event.preventDefault();
      return;
    }

    if (bookingDateOptions.length && !getCheckedOption(bookingDateOptions)) {
      event.preventDefault();
      if (formStatus) {
        formStatus.textContent = "Please choose a cleaning date option before sending your request.";
      }
      if (bookingDateStep) {
        bookingDateStep.hidden = false;
      }
      setFloatingBookingDatePrompt();
      scrollToFormStep(bookingNextHint || bookingDateStep);
      return;
    }

    bookingSubmissionPending = true;

    if (bookCleanButton) {
      bookCleanButton.disabled = true;
      bookCleanButton.textContent = "Confirming booking...";
    }
    if (formStatus) {
      formStatus.textContent = "Confirming your booking. The next page will show when it has gone through.";
    }
  });
}

updateBookingDateOptions();
updateCounters();
updateExtraButtons();
updateQuoteTotal();