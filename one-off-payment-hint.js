(() => {
  const oneOffCheckbox = document.querySelector("#front-only-clean");
  const quoteNextHint = document.querySelector("#quote-next-hint");
  const quoteDetails = document.querySelector("#quote-details");
  const monthlyPaymentMessage = "Monthly payments spreads the cost throughout the year.";
  const previousMonthlyPaymentMessage = "Monthly payments spread the cost throughout the year.";

  if (!oneOffCheckbox || !quoteNextHint || !quoteDetails) return;

  const updateHint = () => {
    if (!quoteDetails.hidden) return;

    const currentText = quoteNextHint.textContent.trim();
    const isMonthlyPaymentMessage =
      currentText === monthlyPaymentMessage ||
      currentText === previousMonthlyPaymentMessage;

    if (oneOffCheckbox.checked && isMonthlyPaymentMessage) {
      quoteNextHint.textContent = "";
      return;
    }

    if (!oneOffCheckbox.checked && (currentText === "" || currentText === previousMonthlyPaymentMessage)) {
      quoteNextHint.textContent = monthlyPaymentMessage;
    }
  };

  oneOffCheckbox.addEventListener("change", () => queueMicrotask(updateHint));

  const observer = new MutationObserver(updateHint);
  observer.observe(quoteNextHint, {
    childList: true,
    characterData: true,
    subtree: true
  });
  observer.observe(quoteDetails, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  updateHint();
})();