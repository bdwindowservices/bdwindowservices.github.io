(() => {
  const frontPreviewCaptionText = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets."
  };

  const oneOffSurcharge = 5;
  let oneOffActive = false;

  const style = document.createElement("style");
  style.textContent = `
    #services,
    #about,
    #window-set-picture {
      scroll-margin-top: 96px;
    }

    @media (max-width: 900px) {
      #services,
      #about,
      #window-set-picture {
        scroll-margin-top: 132px;
      }
    }

    @media (min-width: 641px) {
      .counter-control {
        grid-template-columns: 42px minmax(96px, auto) 42px;
      }

      .counter-control output {
        padding: 0 10px;
        font-size: 1.05rem;
        line-height: 1.1;
        white-space: nowrap;
      }

      .window-set-preview {
        align-content: center;
        padding-top: 34px;
      }

      .desktop-action-bar.is-ready #desktop-estimate-main {
        font-size: 1.05rem !important;
        line-height: 1.25;
      }

      .quote-total #quote-total-price {
        font-size: 1.25rem !important;
        line-height: 1.25;
      }
    }

    .mobile-price-builder-intro {
      display: none;
    }

    @media (max-width: 640px) {
      .site-header nav {
        flex-wrap: nowrap;
        justify-content: space-between;
        gap: 8px;
        font-size: clamp(0.78rem, 3.5vw, 0.9rem);
        white-space: nowrap;
      }

      .price-builder-panel > .price-builder-intro {
        display: none !important;
      }

      .window-set-preview > .mobile-price-builder-intro {
        display: block !important;
        width: 100%;
        max-width: none;
        margin: 0 0 12px;
        text-align: left;
      }

      .quote-total {
        display: none !important;
      }

      .counter-control {
        grid-template-columns: 36px minmax(78px, auto) 36px;
      }

      .counter-control button {
        width: 36px;
        min-width: 36px;
        height: 36px;
        min-height: 36px;
        padding: 0;
      }

      .counter-control output {
        min-height: 36px;
        padding: 5px 8px;
        line-height: 1.05;
      }

      .preview-house.mobile-three-four-fit {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
      }

      .preview-house.mobile-three-four-fit .house-preview-photo {
        width: 100%;
        height: auto;
        min-height: 0 !important;
        aspect-ratio: auto;
        object-fit: contain !important;
      }

      .mobile-action-bar {
        opacity: 0;
        pointer-events: none;
        transform: translateY(calc(100% + 24px));
        transition: opacity 180ms ease, transform 220ms ease;
      }

      .mobile-action-bar.mobile-banner-visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
    }
  `;
  document.head.append(style);

  const formatMoney = (value) => {
    const number = Number(value);
    return Number.isInteger(number) ? `£${number}` : `£${number.toFixed(2)}`;
  };

  const parseMoney = (text) => {
    const match = String(text).match(/£\s*(\d+(?:\.\d{1,2})?)/);
    if (!match) return null;

    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  };

  const ensureAboutHeaderLink = () => {
    const navigation = document.querySelector(".site-header nav");
    if (!navigation || navigation.querySelector('a[href="#about"]')) return;

    const faqLink = navigation.querySelector('a[href="#faq"]');
    const aboutLink = document.createElement("a");
    aboutLink.href = "#about";
    aboutLink.textContent = "About";

    navigation.insertBefore(aboutLink, faqLink || null);
  };

  const initialisePreciseHeaderLinks = () => {
    const header = document.querySelector(".site-header");
    const links = document.querySelectorAll(
      '.site-header nav a[href="#faq"], .site-header nav a[href="#contact"]'
    );

    if (!header || !links.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const selector = link.getAttribute("href");
        const section = selector ? document.querySelector(selector) : null;
        const contentStart = section?.firstElementChild || section;
        if (!selector || !contentStart) return;

        event.preventDefault();

        const headerHeight = header.getBoundingClientRect().height;
        const contentTop = window.scrollY + contentStart.getBoundingClientRect().top;
        const destination = Math.max(0, contentTop - headerHeight - 18);

        window.scrollTo({
          top: destination,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });

        if (window.location.hash !== selector) {
          history.pushState(null, "", selector);
        }
      });
    });
  };

  const updateOneOffFormField = (checked) => {
    const hiddenInput = document.querySelector("#front-only-input");
    if (!hiddenInput) return;

    hiddenInput.name = "One-off clean";
    hiddenInput.value = checked ? "Yes - £5 added" : "No";
  };

  const updateOneOffOptionCopy = () => {
    const checkbox = document.querySelector("#front-only-clean");
    const label = checkbox?.closest("label");
    if (!checkbox || !label) return;

    checkbox.setAttribute("aria-label", "One-off clean, £5 extra");
    const textNode = Array.from(label.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );

    if (textNode) {
      textNode.textContent = "One-off clean £5+";
    } else {
      label.append("One-off clean £5+");
    }

    updateOneOffFormField(checkbox.checked);
  };

  const updateOneOffActionBars = (displayText, bespoke) => {
    const mobileQuote = document.querySelector("#mobile-quote-amount");
    const desktopBar = document.querySelector(".desktop-action-bar");
    const desktopMain = document.querySelector("#desktop-estimate-main");
    const desktopSub = document.querySelector("#desktop-estimate-sub");
    const desktopCta = document.querySelector("#desktop-estimate-cta");

    if (mobileQuote) {
      mobileQuote.innerHTML = bespoke
        ? `<span>${displayText}</span><small>We will confirm the price</small>`
        : `<span>${displayText}</span>`;
      mobileQuote.setAttribute("href", "#quote");
    }

    if (desktopMain) desktopMain.textContent = displayText;
    if (desktopSub) desktopSub.textContent = bespoke ? "We will confirm the price" : "";
    if (desktopCta) desktopCta.textContent = "Book clean";
    if (desktopBar) {
      desktopBar.classList.add("is-ready");
      desktopBar.classList.remove("is-progress");
    }
  };

  const applyOneOffPricing = () => {
    if (!oneOffActive) return;

    const price = document.querySelector("#quote-total-price");
    const monthly = document.querySelector("#quote-total-monthly");
    const estimated = document.querySelector("#estimated-quote");
    if (!price || !monthly) return;

    const currentPriceText = price.textContent.trim();
    if (!currentPriceText || currentPriceText === "£-") return;

    updateOneOffFormField(true);

    if (currentPriceText.toLowerCase().includes("one-off clean")) {
      monthly.hidden = true;
      monthly.textContent = "";
      return;
    }

    const bespoke = currentPriceText.toLowerCase().includes("bespoke");
    if (bespoke) {
      const displayText = "Bespoke One-off Clean";
      price.textContent = displayText;
      monthly.hidden = true;
      monthly.textContent = "";
      if (estimated) estimated.value = "Bespoke One-off Clean (one-off clean selected)";
      updateOneOffActionBars(displayText, true);
      return;
    }

    const basePrice = parseMoney(currentPriceText);
    if (basePrice === null) return;

    const singlePrice = formatMoney(basePrice + oneOffSurcharge);
    const displayText = `${singlePrice} One-off Clean`;
    price.textContent = displayText;
    monthly.hidden = true;
    monthly.textContent = "";
    if (estimated) {
      estimated.value = `${singlePrice} One-off Clean (includes £5 one-off clean charge)`;
    }
    updateOneOffActionBars(displayText, false);
  };

  const markOriginalCalculatorAsChanged = () => {
    const extraButton = document.querySelector("[data-extra-button]");
    if (!extraButton) return;

    extraButton.click();
    extraButton.click();
  };

  const initialiseOneOffOption = () => {
    const checkbox = document.querySelector("#front-only-clean");
    const monthly = document.querySelector("#quote-total-monthly");
    if (!checkbox) return;

    oneOffActive = checkbox.checked;
    updateOneOffOptionCopy();

    checkbox.addEventListener(
      "change",
      (event) => {
        event.stopImmediatePropagation();
        oneOffActive = checkbox.checked;
        updateOneOffFormField(oneOffActive);

        if (!oneOffActive && monthly) {
          monthly.hidden = false;
        }

        markOriginalCalculatorAsChanged();

        queueMicrotask(() => {
          if (oneOffActive) {
            applyOneOffPricing();
          } else if (monthly) {
            monthly.hidden = false;
          }
        });
      },
      true
    );

    document.addEventListener("click", (event) => {
      const calculatorControl = event.target.closest(
        "[data-counter-action], [data-extra-button]"
      );
      if (calculatorControl && oneOffActive) {
        queueMicrotask(applyOneOffPricing);
      }

      const bookingControl = event.target.closest(
        "#booking-next-button, #desktop-estimate-action, #mobile-quote-amount"
      );
      if (bookingControl && oneOffActive) {
        setTimeout(() => {
          const bookingStep = document.querySelector("#booking-date-step");
          if (!bookingStep || bookingStep.hidden) return;

          const priceText = document.querySelector("#quote-total-price")?.textContent.trim();
          const desktopMain = document.querySelector("#desktop-estimate-main");
          const desktopSub = document.querySelector("#desktop-estimate-sub");
          const mobileQuote = document.querySelector("#mobile-quote-amount");

          if (priceText && desktopMain) {
            desktopMain.textContent = `${priceText} - Choose a cleaning date`;
          }
          if (desktopSub) desktopSub.textContent = "";
          if (priceText && mobileQuote) {
            mobileQuote.innerHTML = `<span>${priceText} - Choose a cleaning date</span>`;
          }
        }, 0);
      }
    });
  };

  const updateCaption = () => {
    const frontCount = document.querySelector("#front-window-count");
    const caption = document.querySelector("#window-preview-caption");
    if (!frontCount || !caption) return;

    const captionText = frontPreviewCaptionText[frontCount.textContent.trim()];
    if (captionText) caption.textContent = captionText;
  };

  const updateMobileThreeFourImageFit = () => {
    const frontCount = document.querySelector("#front-window-count");
    const previewHouse = document.querySelector(".preview-house");
    if (!frontCount || !previewHouse) return;

    const useFullImage = window.innerWidth <= 640 && frontCount.textContent.trim() === "3 to 4";
    previewHouse.classList.toggle("mobile-three-four-fit", useFullImage);
  };

  const getSevenToEightPreviewSource = () => {
    if (typeof frontSevenToEightPreviewImage !== "undefined") {
      return frontSevenToEightPreviewImage;
    }
    if (typeof frontHousePreviewImages !== "undefined") {
      return frontHousePreviewImages["7 to 8"] || "";
    }
    return "";
  };

  const showBespokeWithSevenToEightImage = () => {
    const frontCount = document.querySelector("#front-window-count");
    const house = document.querySelector(".preview-house");
    const caption = document.querySelector("#window-preview-caption");
    if (!frontCount || !house || frontCount.textContent.trim() !== "9+ bespoke") return;

    const imageSource = getSevenToEightPreviewSource();
    if (!imageSource) return;

    let photo = house.querySelector("img.house-preview-photo");
    if (!photo || photo.getAttribute("src") !== imageSource) {
      house.innerHTML = `<img class="house-preview-photo" src="${imageSource}" alt="Brick house front shown for a bespoke quote">`;
      photo = house.querySelector("img.house-preview-photo");
    }

    if (photo) {
      photo.style.display = "block";
      photo.style.width = "100%";
      photo.style.height = "100%";
      photo.style.minHeight = "0";
      photo.style.aspectRatio = "auto";
      photo.style.objectFit = "contain";
      photo.style.objectPosition = "center";
      photo.style.background = "#dcecf2";
    }
    if (caption) {
      caption.textContent = "9+ front window sets selected. We will confirm a bespoke quote.";
    }
  };

  const scheduleBespokePreview = () => {
    window.setTimeout(showBespokeWithSevenToEightImage, 0);
    window.requestAnimationFrame(showBespokeWithSevenToEightImage);
  };

  const initialiseBespokePreview = () => {
    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", scheduleBespokePreview);
      });

    const frontCount = document.querySelector("#front-window-count");
    if (frontCount) {
      const observer = new MutationObserver(scheduleBespokePreview);
      observer.observe(frontCount, { childList: true, characterData: true, subtree: true });
    }

    scheduleBespokePreview();
  };

  const updateFrontInstruction = () => {
    const instruction = document.querySelector('[data-counter-card="front"] span');
    if (instruction) instruction.textContent = "Choose the best match";
  };

  const updatePricingGuide = () => {
    const list = document.querySelector("#pricing-guide .faq-list");
    const preview = document.querySelector(".window-set-preview");
    if (preview) preview.id = "window-set-picture";
    if (!list) return;

    list.innerHTML = `
      <article><h3>What counts as a window set? - <a href="#window-set-picture">See picture examples</a></h3><p>Look for the separate groups of windows on your home. Each group counts as one set, even when it contains several windows or panes.</p></article>
      <article><h3>Can you only clean my front windows?</h3><p>If you only want your front windows cleaned just let us know how many sets of windows you have at the front and ignore the back and side windows.</p></article>
      <article><h3>Is my conservatory small or large?</h3><p>Choose small for up to 6 large glass sections, or large for 7 or more. We clean the glass, frames and sills included in a conservatory clean. If you would like a roof plastic or glass cleaned please contact us for a separate quote <a href="#contact">here</a>.</p></article>
      <article><h3>How should I count my porch?</h3><p>Count a porch as one window set.</p></article>
      <article><h3>What about doors with glass?</h3><p>We will clean any regular front and back doors as included in the price and these do not need to be counted. Just count any French doors or patio doors as one window set.</p></article>
      <article><h3>With a regular clean how long do I have to commit to?</h3><p>Regular cleaning requires a minimum of three monthly payments, covering two cleans. We will confirm the price at your first appointment before you decide. After 3 months you may cancel our services at any time. If you just require a one-off clean please select it on our price list when booking.</p></article>
    `;
  };

  const addMobileIntro = () => {
    const originalIntro = document.querySelector(".price-builder-panel > .price-builder-intro");
    const preview = document.querySelector(".window-set-preview");
    const house = preview?.querySelector(".preview-house");

    if (!originalIntro || !preview || !house) return;

    let mobileIntro = preview.querySelector(".mobile-price-builder-intro");
    if (!mobileIntro) {
      mobileIntro = originalIntro.cloneNode(true);
      mobileIntro.classList.add("mobile-price-builder-intro");
      preview.insertBefore(mobileIntro, house);
    }
  };

  const showExistingMobilePrice = () => {
    if (window.innerWidth > 640) return;

    const bannerLink = document.querySelector("#mobile-quote-amount");
    const price = document.querySelector("#quote-total-price");
    const monthly = document.querySelector("#quote-total-monthly");
    if (!bannerLink || !price || !monthly) return;

    const priceText = price.textContent.trim();
    const monthlyText = monthly.textContent.trim();
    const monthlyHtml = monthly.innerHTML.trim();
    if (!priceText || priceText === "£-") return;

    if (priceText.toLowerCase().includes("one-off clean")) {
      const bespoke = priceText.toLowerCase().includes("bespoke");
      bannerLink.innerHTML = bespoke
        ? `<span>${priceText}</span><small>We will confirm the price</small>`
        : `<span>${priceText}</span>`;
    } else if (priceText === "Bespoke quote") {
      bannerLink.innerHTML = `<span>${priceText}</span><small>We will confirm the price</small>`;
    } else {
      bannerLink.innerHTML = `<span>${priceText}</span><small>${monthlyHtml}</small>`;
    }
  };

  const initialiseMobileBanner = () => {
    const banner = document.querySelector(".mobile-action-bar");
    const quoteSection = document.querySelector("#quote");

    if (!banner || !quoteSection) return;

    let hasBeenRevealed = false;

    const revealBanner = () => {
      if (hasBeenRevealed) return;
      hasBeenRevealed = true;
      showExistingMobilePrice();
      banner.classList.add("mobile-banner-visible");
    };

    const checkPosition = () => {
      if (window.innerWidth > 640 || hasBeenRevealed) return;
      const quoteTop = quoteSection.getBoundingClientRect().top;
      if (quoteTop <= window.innerHeight) revealBanner();
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            revealBanner();
            observer.disconnect();
          }
        },
        { threshold: 0.01 }
      );
      observer.observe(quoteSection);
    }

    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", () => {
      checkPosition();
      updateMobileThreeFourImageFit();
    });
    checkPosition();
  };

  const refreshPreviewEnhancements = () => {
    queueMicrotask(() => {
      updateCaption();
      updateMobileThreeFourImageFit();
    });
  };

  const initialise = () => {
    ensureAboutHeaderLink();
    initialisePreciseHeaderLinks();
    initialiseOneOffOption();
    updatePricingGuide();
    addMobileIntro();
    updateCaption();
    updateFrontInstruction();
    updateMobileThreeFourImageFit();
    initialiseBespokePreview();
    initialiseMobileBanner();

    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", refreshPreviewEnhancements);
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();