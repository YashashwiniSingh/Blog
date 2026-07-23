const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  function animRing() {
    rx = lerp(rx, mx, 0.15);
    ry = lerp(ry, my, 0.15);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }

  animRing();

  document.querySelectorAll('a, button, label, .blog-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

const toggle = document.getElementById('modeToggle');
const labelPersonal = document.getElementById('label-personal');
const labelPro = document.getElementById('label-pro');
if (toggle) {
  toggle.addEventListener('change', () => {
    if (!toggle.checked) {
      labelPersonal.classList.add('active');
      labelPro.classList.remove('active');
      window.location.href = 'index.html';
    }
  });
}

function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', triggerReveals);
