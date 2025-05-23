//© EduardoX - Código libre no comercial

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundMusic();
  startAnimationSequence();
});

// Orquesta la secuencia de animación completa
function startAnimationSequence() {
  animateIntroHearts();

  setTimeout(() => {
    const nameIntro = document.getElementById('name-intro');
    if (!nameIntro) return;

    nameIntro.classList.add('move-to-header');

    setTimeout(() => {
      const header = document.getElementById('main-header');
      if (header) header.classList.add('visible');
      animateHeaderHearts();

      setTimeout(() => {
        nameIntro.classList.add('fade-out');

        setTimeout(() => {
          nameIntro.style.display = 'none';
          loadTreeSVG();
        }, 800);
      }, 200);
    }, 1800);
  }, 2000);
}

// Genera corazones animados para la intro
function animateIntroHearts() {
  const heartsContainer = document.getElementById('intro-hearts');
  if (!heartsContainer) return;

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤';
      heart.style.position = 'absolute';
      heart.style.color = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, ${Math.floor(100 + Math.random() * 155)}, 0.8)`;
      heart.style.fontSize = `${Math.floor(15 + Math.random() * 25)}px`;
      heart.style.left = `${Math.floor(Math.random() * 100)}%`;
      heart.style.top = `${Math.floor(Math.random() * 100)}%`;
      heart.style.animation = `floatHeart ${1 + Math.random() * 2}s ease-out forwards`;
      heartsContainer.appendChild(heart);
    }, i * 200);
  }
}

// Genera corazones continuamente en el header
function animateHeaderHearts() {
  const heartsContainer = document.getElementById('header-hearts');
  if (!heartsContainer) return;

  function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.position = 'absolute';
    heart.style.color = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, ${Math.floor(100 + Math.random() * 155)}, 0.8)`;
    heart.style.fontSize = `${Math.floor(8 + Math.random() * 16)}px`;
    heart.style.left = `${Math.floor(Math.random() * 100)}%`;
    heart.style.top = `${Math.floor(Math.random() * 100)}%`;
    heart.style.animation = `floatHeart ${1 + Math.random() * 2}s ease-out forwards`;
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode === heartsContainer) {
        heartsContainer.removeChild(heart);
      }
    }, 3000);
  }

  function spawnHearts() {
    createHeart();
    setTimeout(spawnHearts, 500 + Math.random() * 1000);
  }

  spawnHearts();
}

// Inicializa la música de fondo
function initBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.preload = 'auto';
  audio.volume = 1.0;
  audio.loop = true;

  playBackgroundMusic();
}

// Carga y anima el SVG del árbol
function loadTreeSVG() {
  fetch('Img/treelove.svg')
    .then(res => res.text())
    .then(svgText => {
      const container = document.getElementById('tree-container');
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (!svg) return;

      // Dibuja el árbol progresivamente
      const allPaths = Array.from(svg.querySelectorAll('path'));
      allPaths.forEach(path => {
        path.style.stroke = '#222';
        path.style.strokeWidth = '2.5';
        path.style.fillOpacity = '0';
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'none';
      });

      setTimeout(() => {
        allPaths.forEach((path, i) => {
          path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
          path.style.strokeDashoffset = 0;
          setTimeout(() => {
            path.style.fillOpacity = '1';
            path.style.stroke = '';
            path.style.strokeWidth = '';
          }, 1200 + i * 80);
        });

        // Después de dibujar, anima la posición
        const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
        setTimeout(() => {
          svg.classList.add('move-and-scale');
          setTimeout(() => {
            showDedicationText();
            startFloatingObjects();
            showCountdown();
            playBackgroundMusic();
          }, 1200);
        }, totalDuration);
      }, 50);

      // Anima los corazones del árbol
      const heartPaths = allPaths.filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('#FC6F58') || style.includes('#C1321F');
      });
      heartPaths.forEach(path => {
        path.classList.add('animated-heart');
      });
    });
}

// Obtiene parámetros de la URL
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Muestra el texto con efecto máquina de escribir
function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para Carolina, el amor de mi vida:\n\nDesde el primer momento supe que era usted. Su sonrisa, su voz, su forma de ser… todo en usted me enamora.\n\nGracias por acompañarme en cada paso, por comprenderme incluso en silencio y por llenar mis días de amor.\n\nLe amo más de lo que las palabras pueden expresar.
`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      const delay = (i > 1 && text[i - 2] === '\n') ? 350 : 45;
      setTimeout(type, delay);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Muestra la firma con animación
function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Ing. Eduardo Xuyá";
  signature.classList.add('visible');
}

// Genera pétalos flotantes animados
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

const config = {
  defaultStartDate: '2024-12-03',
  defaultEventDate: '2025-06-03'
};

// Muestra y actualiza la cuenta regresiva
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date(config.defaultStartDate + 'T00:00:00');
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date(config.defaultEventDate + 'T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro próximo aniversario: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// Controla la reproducción de música
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }

  const attemptPlay = () => {
    audio.play().then(() => {
      btn.textContent = '🔊 Música';
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
    }).catch(() => {
      btn.textContent = '▶️ Música';
    });
  };

  attemptPlay();

  ['click', 'touchstart', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, attemptPlay, { once: true });
  });

  btn.onclick = (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música pausada';
    }
  };
}
