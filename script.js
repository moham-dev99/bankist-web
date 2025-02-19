"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Button smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  section1?.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation

// Old implementation
/* document.querySelector('.nav__links').addEventListener("click", function (e) {
  e.preventDefault();
  const href = e.target.getAttribute("href");

  ===
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  ===

  if (href?.length > 1) {
    const section = document.querySelector(href);
    const coords = section?.getBoundingClientRect();

    scrollTo({
      top: coords.top + window.pageYOffset,
      behavior: "smooth",
    });
  }
}); */

// New implementation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  const href = e.target.getAttribute("href");

  if (href?.length > 1 && e.target.classList.contains("nav__link")) {
    const section = document.querySelector(href);
    section?.scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const links = e.target.closest(".nav").querySelectorAll(".nav__link");
    const logo = e.target.closest(".nav").querySelector("img");

    links.forEach((link) => {
      if (link != e.target) link.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

/* window.addEventListener("scroll", function (e) {
  const coords = section1.getBoundingClientRect();

  if (coords.top <= 0) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
}) */

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  entry.isIntersecting
    ? nav.classList.remove("sticky")
    : nav.classList.add("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections effect
const allSections = document.querySelectorAll(".section");

const revealSections = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, { rootMargin: "200px" });

imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider

const slider = function () {
  // Selectors
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    activateDot(slide);
  };

  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
  };

  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;
    goToSlide(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);

    goToSlide(0);
  };

  init();

  // Event Listeners
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot"))
      goToSlide(e.target.dataset.slide);
  });
};

slider();


function openMenu(){
  sideMenu.style.right = "0";
}
function closeMenu(){
  sideMenu.style.right = "-300px";
}

function closeLinks() {
  var links = document.querySelectorAll("ul li")
  console.log(links);

  links.forEach(link => {
    link.addEventListener('click', function() {
      sideMenu.style.right = "-300px";
    })
  })
}
closeLinks()



const mode = document.querySelector('.toggle_mode')
const body = document.body

// Change to light or dark mode
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.toggle_mode');
  const body = document.body;

  // Check for previously saved mode preference
  const savedMode = localStorage.getItem('mode');
  if (savedMode) {
      body.classList.add(savedMode);
  }

  toggleButton.addEventListener('click', () => {
    if(body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      mode.innerHTML = "<i class='bx bxs-moon'></i> mode"
    }else {
      body.classList.add('dark-mode');
      mode.innerHTML = "<i class='bx bx-sun'></i> mode"
    }

    // Save the current mode preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('mode', 'dark-mode');
    } else {
        localStorage.removeItem('mode');
      }
  });
});
