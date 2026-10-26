/**
 * Скрипт Scroll-Scrubbing: анимация, строго привязанная к прогрессу скролла.
 * При движении вниз элементы плавно выплывают.
 * При остановке — замирают ровно в текущем положении.
 * При скролле вверх — возвращаются обратно (реверс).
 */

(function () {
  'use strict';

  function updateScrub() {
    const vh = window.innerHeight;
    const elements = document.querySelectorAll('[data-scrub]');

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const type = el.dataset.scrub || 'fade-up';
      const delay = parseFloat(el.dataset.scrubDelay || '0');

      // Точки входа и завершения анимации
      // Начинается, когда элемент заходит в нижние 92% экрана
      // Полностью завершается, когда элемент достигает верхних 45% экрана
      const enterPoint = vh * 0.95;
      const finishPoint = vh * 0.42;

      // Нормализуем прогресс от 0 до 1
      let rawProgress = (enterPoint - rect.top) / (enterPoint - finishPoint);
      if (delay > 0) {
        rawProgress = (rawProgress - delay) / (1 - delay);
      }
      const progress = Math.min(1, Math.max(0, rawProgress));

      // Плавное сглаживание (easeOutQuad)
      const eased = progress * (2 - progress);

      switch (type) {
        case 'fade-up': {
          const y = (1 - eased) * 55;
          const scale = 0.93 + 0.07 * eased;
          el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          el.style.opacity = eased.toFixed(3);
          break;
        }
        case 'fade-left': {
          const x = (1 - eased) * -60;
          el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
          el.style.opacity = eased.toFixed(3);
          break;
        }
        case 'fade-right': {
          const x = (1 - eased) * 60;
          el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
          el.style.opacity = eased.toFixed(3);
          break;
        }
        case 'zoom-in': {
          const scale = 0.86 + 0.14 * eased;
          el.style.transform = `scale(${scale.toFixed(3)})`;
          el.style.opacity = eased.toFixed(3);
          break;
        }
        case 'parallax-img': {
          // Мягкий параллакс внутри фотоконтейнера
          const centerProgress = (vh - rect.top) / (vh + rect.height);
          const py = (centerProgress - 0.5) * -50;
          el.style.transform = `translate3d(0, ${py.toFixed(2)}px, 0) scale(1.08)`;
          break;
        }
      }
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrub();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('DOMContentLoaded', updateScrub);

  // Первый запуск сразу
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    updateScrub();
  }
})();
