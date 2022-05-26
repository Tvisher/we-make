'use strict';
import * as baseFunction from './modules/functions.js';
import './vendors/vendors.js';
import Swiper, {
    Navigation,
    Pagination,
    Autoplay,
    EffectFade,
    Keyboard
} from 'swiper';

import AOS from 'aos';
import IMask from 'imask';


import ModalVideo from 'modal-video';
new ModalVideo('.js-modal-btn', {
    theme: 'dark',
    autoplay: 1,
});

// Проверка поддержки webP
baseFunction.testWebP();

const generalSlidesCount = document.querySelector('.general-counter');
const currentSlideNum = document.querySelector('.current-counter');
// Слайдер полноэкранный
const mainSlider = new Swiper('.main-slider', {
    modules: [Pagination,
        EffectFade,
        Navigation,
        Autoplay,
        Keyboard
    ],
    speed: 1200,
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    init: false,
    autoplay: {
        delay: 8000,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
    on: {
        resize(swiper) {
            swiper.update();
        },
        init(swiper) {
            let clidesCount = String(swiper.slides.length);
            if (clidesCount < 2) {
                return;
            }
            clidesCount = clidesCount.length < 2 ? `0${clidesCount}` : clidesCount;
            generalSlidesCount.textContent = clidesCount;
        },
        activeIndexChange(swiper) {
            let currentSlide = String(swiper.activeIndex + 1);
            currentSlide = currentSlide.length < 2 ? `0${currentSlide}` : currentSlide;
            currentSlideNum.textContent = currentSlide;
        },
    },
    breakpoints: {
        768: {

        }
    }
});
const rewiewsSlider = new Swiper('.rewiews__slider', {
    modules: [EffectFade, Autoplay, Navigation],
    speed: 800,
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 6000,
    },
    on: {
        resize(swiper) {
            swiper.update();
        },
        init(swiper) {
            let clidesCount = String(swiper.slides.length);
            if (clidesCount < 2) {
                return;
            }
            let animationTime = swiper.params.autoplay.delay / 1000;
            let diagramSpiner = swiper.$el[0].querySelector('.slider-timer');
            diagramSpiner.querySelector('.slider-timer-path').style.animationDuration = `${animationTime}s`;
            diagramSpiner.classList.add('start');
        },

        slideChange(swiper) {
            let sliderSpeed = swiper.params.speed;
            let diagramSpiner = swiper.$el[0].querySelector('.slider-timer');
            diagramSpiner.classList.remove('start');
            setTimeout(() => {
                diagramSpiner.classList.add('start');
            }, sliderSpeed);
        }
    },
    breakpoints: {
        768: {
        }
    }
});

const aboutSectionSlider = new Swiper('.about-section__slider', {
    modules: [Navigation],
    speed: 800,
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next.outside',
        prevEl: '.swiper-button-prev.outside',
    },
});


const preloader = document.querySelector('#preloader');
const preloaderSvg = preloader.querySelector('svg');
document.body.style.opacity = 1;
preloaderSvg.classList.add('active');
window.addEventListener('load', (e) => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        mainSlider.init();
    }, 3200);
    $('.marquee').marquee({
        startVisible: true,
        duration: 20000,
        gap: 50,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
    });
});
// Инит и опции библиотеки анимаций
AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'load', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 25, // offset (in px) from the original trigger point
    delay: 100, // values from 0 to 3000, with step 50ms
    duration: 1200, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});
//логика работы меню бургер
document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('[data-burger-menu]')) {
        target.closest('[data-burger-menu]').classList.toggle('active');
        document.querySelector('[data-header-menu]').classList.toggle('active');
        document.body.classList.toggle('hidden');
    }
});
// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7}(000) 000-00-00'
    });
});






