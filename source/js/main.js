import Swiper from 'swiper';
import '../../node_modules/swiper/swiper.scss';
import '../index.html';
import 'focus-visible';
import '../scss/style.scss';

/* Buttons "Показать все/Скрыть все" */

const buttonStatus = (show) => {
  const buttonBrands = document.querySelector(".brands__button");
  const listBrands = document.querySelector(".brands__list");

  buttonBrands.addEventListener("click", (e) => {
    e.preventDefault();
    listBrands.classList.toggle(show);
    buttonTextToogle();
  });

  const buttonTextToogle = () => {
    if (buttonBrands.textContent === `Показать все`) {
      buttonBrands.textContent = `Скрыть`;
      buttonBrands.classList.add("brands__button--rotate");
    } else if (buttonBrands.textContent === `Скрыть`) {
      buttonBrands.textContent = `Показать все`;
      buttonBrands.classList.remove("brands__button--rotate");
    }
  };
};

buttonStatus("brands__list--visible");

/* Swiper slider */

const breakpoint = window.matchMedia("(min-width: 768px)");
let mySwiper;

const breakpointChecker = function () {
  if (breakpoint.matches === true) {
    if (mySwiper !== undefined) {
      mySwiper.destroy(true, true);
    }
    return;
  } else if (breakpoint.matches === false) {
    enableSwiper();
    return;
  }
};

const enableSwiper = function () {
  mySwiper = new Swiper(".swiper", {
    // Бесконечный скролл
    loop: true,
    loopedSlides: 3,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Кол-во слайдов для показа
    slidesPerView: "auto",

    // Скорость скролла
    speed: 800,
  });
};

breakpoint.addEventListener("change", () => {
  breakpointChecker();
});

breakpointChecker();
