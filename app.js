(() => {
  const nav = document.querySelector(".primary-navigation");
  const menuToggle = document.querySelector(".menu-toggle");
  const offersToggle = document.querySelector(".offers-menu__toggle");
  const offersList = document.querySelector(".offers-menu__list");

  if (!nav || !menuToggle || !offersToggle || !offersList) return;

  const heroVideo = document.querySelector("video.hero__video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncVideoMotion = () => {
    if (!heroVideo) return;
    if (reducedMotion.matches) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  };
  syncVideoMotion();
  reducedMotion.addEventListener?.("change", syncVideoMotion);

  const closeOffers = () => {
    offersToggle.setAttribute("aria-expanded", "false");
    offersList.hidden = true;
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Ouvrir le menu";
    closeOffers();
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "Ouvrir le menu" : "Fermer le menu";
    nav.classList.toggle("is-open", !isOpen);
    if (isOpen) closeOffers();
  });

  offersToggle.addEventListener("click", () => {
    const isOpen = offersToggle.getAttribute("aria-expanded") === "true";
    offersToggle.setAttribute("aria-expanded", String(!isOpen));
    offersList.hidden = isOpen;
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".offers-menu")) closeOffers();
    if (window.innerWidth <= 760 && !event.target.closest(".site-header")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeOffers();
      if (window.innerWidth <= 760) closeNav();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeOffers();
    }
  });

  const testimonialsCarousel = document.querySelector("[data-testimonials-carousel]");
  if (!testimonialsCarousel) return;

  const testimonialsViewport = testimonialsCarousel.querySelector(".testimonials__viewport");
  const testimonialsTrack = testimonialsCarousel.querySelector(".testimonials__track");
  const testimonialCards = Array.from(testimonialsTrack.querySelectorAll(".testimonial-card"));
  const previousButton = testimonialsCarousel.querySelector("[data-carousel-prev]");
  const nextButton = testimonialsCarousel.querySelector("[data-carousel-next]");
  const pagination = testimonialsCarousel.querySelector("[data-carousel-pagination]");
  const carouselStatus = testimonialsCarousel.querySelector("[data-carousel-status]");
  const cardsPerPageForViewport = () => {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 1040) return 2;
    return 3;
  };
  let cardsPerPage = cardsPerPageForViewport();
  let currentPage = 0;
  let paginationButtons = [];

  const pageCount = () => Math.max(1, testimonialCards.length - cardsPerPage + 1);

  const renderCarousel = () => {
    const totalPages = pageCount();
    currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));
    const startIndex = currentPage;
    const endIndex = Math.min(startIndex + cardsPerPage, testimonialCards.length);
    const visibleCards = testimonialCards.slice(startIndex, endIndex);
    const firstCard = visibleCards[0];
    const lastCard = visibleCards[visibleCards.length - 1];
    const groupWidth = lastCard.offsetLeft + lastCard.offsetWidth - firstCard.offsetLeft;
    const centeringSpace = visibleCards.length < cardsPerPage
      ? Math.max(0, (testimonialsViewport.clientWidth - groupWidth) / 2)
      : 0;
    const offset = firstCard.offsetLeft - testimonialCards[0].offsetLeft - centeringSpace;

    testimonialsTrack.style.transform = `translate3d(-${offset}px, 0, 0)`;
    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;
    testimonialCards.forEach((card, index) => {
      card.setAttribute("aria-hidden", String(index < startIndex || index >= endIndex));
    });
    paginationButtons.forEach((button, index) => {
      button.setAttribute("aria-current", String(index === currentPage));
    });
    carouselStatus.textContent = cardsPerPage === 1
      ? `Témoignage ${startIndex + 1} sur ${testimonialCards.length}`
      : `Témoignages ${startIndex + 1} à ${endIndex} sur ${testimonialCards.length}`;
  };

  const buildPagination = () => {
    pagination.replaceChildren();
    paginationButtons = Array.from({ length: pageCount() }, (_, index) => {
      const first = index + 1;
      const last = Math.min(index + cardsPerPage, testimonialCards.length);
      const button = document.createElement("button");
      button.className = "testimonials__dot";
      button.type = "button";
      button.setAttribute("aria-label", cardsPerPage === 1
        ? `Afficher le témoignage ${first}`
        : `Afficher les témoignages ${first} à ${last}`);
      button.addEventListener("click", () => {
        currentPage = index;
        renderCarousel();
      });
      pagination.append(button);
      return button;
    });
  };

  previousButton.addEventListener("click", () => {
    currentPage -= 1;
    renderCarousel();
  });
  nextButton.addEventListener("click", () => {
    currentPage += 1;
    renderCarousel();
  });
  testimonialsViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && currentPage > 0) {
      event.preventDefault();
      currentPage -= 1;
      renderCarousel();
    } else if (event.key === "ArrowRight" && currentPage < pageCount() - 1) {
      event.preventDefault();
      currentPage += 1;
      renderCarousel();
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextCardsPerPage = cardsPerPageForViewport();
      if (nextCardsPerPage !== cardsPerPage) {
        cardsPerPage = nextCardsPerPage;
        currentPage = 0;
        buildPagination();
      }
      renderCarousel();
    }, 100);
  });

  buildPagination();
  renderCarousel();
})();
