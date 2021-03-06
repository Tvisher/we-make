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
    speed: 600,
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
if (preloader) {
    const preloaderSvg = preloader.querySelector('svg');
    document.body.style.opacity = 1;
    preloaderSvg.classList.add('active');
}

window.addEventListener('load', (e) => {
    setTimeout(() => {
        preloader && preloader.classList.add('hidden');
        mainSlider.init();
        AOS.init();
    }, 3200);
    //инициализация бегущей строки
    $('.marquee').marquee({
        startVisible: true,
        duration: 20000,
        gap: 50,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
    });
    //инициализация тултипа виджета
    const widgetElem = document.querySelector('.widget-elem');
    if (widgetElem) {
        setTimeout(() => {
            widgetElem.classList.add('show-tooltip');
            widgetElem.onclick = (e) => {
                widgetElem.classList.remove('show-tooltip');
            }
        }, 4000);
    }
});

//логика работы меню бургер
document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('[data-burger-menu]')) {
        target.closest('[data-burger-menu]').classList.toggle('active');
        target.closest('header').classList.toggle('active');
        document.querySelector('[data-header-menu]').classList.toggle('active');
        document.body.classList.toggle('hidden');
    }

    if (target.closest('[data-menu-link]')) {
        document.body.classList.remove('hidden');
        document.querySelector('[data-burger-menu]').classList.remove('active');
        document.querySelector('[data-header-menu]').classList.remove('active');
        document.querySelector('header.active').classList.remove('active');

    }
});
// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7} (000) 000-00-00'
    });
});






const siteForms = document.querySelectorAll('form');

siteForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(form);
        form.classList.add('_sending')
        let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            let result = await response.json();
            console.log(result.message);
            form.reset();
            //вывести модалку об успешной отправке
            form.classList.remove('_sending');
            form.classList.add('sent');
            setTimeout(() => {
                form.closest('.modal-wrapper').classList.remove('show');
            }, 3000);
        } else {
            form.classList.remove('_sending');
            alert('Произошла ошибка, попробуйте позднее.');
            form.closest('.modal-wrapper').classList.remove('show');
        }
    });
});

// Открыть / закрыть модалку с формой 
document.body.addEventListener('click', (e) => {
    const target = e.target;
    //открытие модалки с формой
    if (target.closest('[data-modal-btn]')) {
        e.preventDefault();
        let dataModalBtnId = target.closest('[data-modal-btn]').dataset.modalBtn;
        document.querySelector(`[data-modal-form='${dataModalBtnId}']`).classList.add('show');
    }
    //закрытие модалки с формой
    if (target.closest('[data-close-modal]')) {
        document.querySelector('[data-modal-form].show').classList.remove('show');
    }
    if (target.closest('[data-modal-form].show') && !target.closest('.modal-form')) {
        document.querySelector('[data-modal-form].show').classList.remove('show');
    }
});










