'use strict';
import * as baseFunction from './modules/functions.js';
import './vendors/vendors.js';
import Swiper, {
    Navigation,
    Pagination,
    Autoplay,
    EffectFade,
} from 'swiper';

import AOS from 'aos';
import IMask from 'imask';

// Проверка поддержки webP
baseFunction.testWebP();


// Анимация инпутов при фокусе
(function getAnimationinputs() {
    const stylinginputs = document.querySelectorAll('[data-styles-field]');
    if (stylinginputs) {
        stylinginputs.forEach(input => {
            const inputpParent = input.parentNode;
            const transformtext = inputpParent.querySelector('.styles-text');
            input.addEventListener('focus', (e) => {
                inputpParent.classList.add('focus');
                transformtext && transformtext.classList.add('fixed');

                input.addEventListener('blur', (e) => {
                    const inputValue = e.target.value.trim();
                    inputpParent.classList.remove('focus');
                    if (inputValue.length === 0) {
                        transformtext.classList.remove('fixed');
                    }
                }, { once: true });
            });
            //Добавление класса к инпуту если он заполнен
            const inputValue = input.value.trim();
            console.log(inputValue);
            if (inputValue.length === 0) {
                transformtext.classList.remove('fixed');
            } else {
                transformtext.classList.add('fixed');
            }
        });
    }
}())

const generalSlidesCount = document.querySelector('.general-counter');
const currentSlideNum = document.querySelector('.current-counter');
// Слайдер полноэкранный
const mainSlider = new Swiper('.main-slider', {
    modules: [Pagination,
        EffectFade,
        Navigation,
        Autoplay
    ],
    speed: 800,
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    init: false,
    autoplay: {
        delay: 6000,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
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


window.addEventListener('load', (e) => {
    mainSlider.init();
    document.body.style.opacity = 1;
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
    if (target.closest('.fullscreen-slider__desc')) {
        target.closest('.fullscreen-slider__desc').classList.add('open');
    }
});

// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7}(000) 000-00-00'
    });
});


