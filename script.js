const slides = [...document.querySelectorAll('.slide')];

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');

const slideNumber = document.getElementById('slideNumber');
const slideTotal = document.getElementById('slideTotal');
const slideName = document.getElementById('slideName');

const fullscreenBtn = document.getElementById('fullscreenBtn');

let current = 0;
let touchStartX = 0;

slideTotal.textContent = String(slides.length).padStart(2, '0');

function showSlide(index) {

  current = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {

    slide.classList.toggle('active', i === current);

    slide.setAttribute(
      'aria-hidden',
      i === current ? 'false' : 'true'
    );

  });

  slideNumber.textContent = String(current + 1).padStart(2, '0');

  slideName.textContent = slides[current].dataset.title || '';

  progressFill.style.width =
    `${((current + 1) / slides.length) * 100}%`;

  prevBtn.disabled = current === 0;

  nextBtn.disabled = current === slides.length - 1;

  nextBtn.innerHTML =
    current === slides.length - 1
      ? 'END <span>✓</span>'
      : 'NEXT <span>→</span>';

}

function nextSlide() {

  if (current < slides.length - 1) {
    showSlide(current + 1);
  }

}

function previousSlide() {

  if (current > 0) {
    showSlide(current - 1);
  }

}

// NEXT AND BACK BUTTONS

nextBtn.addEventListener('click', nextSlide);

prevBtn.addEventListener('click', previousSlide);

// KEYBOARD CONTROLS

document.addEventListener('keydown', (event) => {

  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {

    event.preventDefault();
    nextSlide();

  } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {

    event.preventDefault();
    previousSlide();

  } else if (event.key.toLowerCase() === 'f') {

    toggleFullscreen();

  } else if (event.key === 'Home') {

    showSlide(0);

  } else if (event.key === 'End') {

    showSlide(slides.length - 1);

  } else if (event.key === 'Escape' && document.fullscreenElement) {

    document.exitFullscreen?.();

  }

});

// FULLSCREEN

function toggleFullscreen() {

  if (!document.fullscreenElement) {

    document.documentElement
      .requestFullscreen?.()
      .catch(() => {});

  } else {

    document.exitFullscreen?.();

  }

}

fullscreenBtn.addEventListener('click', toggleFullscreen);

// TOUCH SWIPE CONTROLS

document.querySelector('.stage').addEventListener(
  'touchstart',
  (e) => {

    touchStartX = e.changedTouches[0].screenX;

  },
  { passive: true }
);

document.querySelector('.stage').addEventListener(
  'touchend',
  (e) => {

    const diff =
      e.changedTouches[0].screenX - touchStartX;

    if (Math.abs(diff) > 65) {

      diff < 0 ? nextSlide() : previousSlide();

    }

  },
  { passive: true }
);

// OFFLINE SERVICE WORKER

if (
  'serviceWorker' in navigator &&
  (
    location.protocol === 'https:' ||
    location.hostname === 'localhost'
  )
) {

  window.addEventListener('load', () => {

    navigator.serviceWorker
      .register('./sw.js')
      .catch((error) => {

        console.warn(
          'Offline setup could not be registered:',
          error
        );

      });

  });

}

// INITIAL SLIDE

showSlide(0);
