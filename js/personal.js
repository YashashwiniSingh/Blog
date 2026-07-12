/* =====================
   BOOK DATA
===================== */
const books = [
  {
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    reaction: "I walked into it blind and it blew me away. Tolstoy's ability to be unbiased towards his characters and to capture the inner turmoil of life is commendable. A novel where each character is aware of the grief they are going to cause and they do it anyway."
  },
  {
    title: "Near to the wild heart",
    author: "Clarice Lispector",
    reaction: "A fever dream, the stream of subconciousness is captured in its raw and unedited form. Keeping a track of thoughts in a haywire mind is as difficult as calming the mind. It was unapologetic and truly unique, I have never read anything like it before."
  },
  {
    title: "Hour of the Star",
    author: "Clarice Lispector",
    reaction: "The ground reality of human lives in the world is captured in this novella. Not every human makes it big, but this book is proof that all stories are equally special. Dark, tragic and poetic."
  },
  {
    title: "1984",
    author: "George Orwell",
    reaction: "I cannot apologise enough for how late I am to this. A very well deserved classic, it is written with clarity of mind and the ideas discussed is a sign of heightened awareness by the author. A realistic ending to a hopelessly unrealsitic world."
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    reaction: "Bold for it's time and this is much closer to the real world than 1984. It also felt like reading the fantasy of a teenage boy but I cannot criticise that because seems like the world is being run by people with the same mentality."
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    reaction: "This has been the best book I have read in years, I have highlighted the entire book. The best example of dark satire, every character has a seductive charm which makes the reader's moral compass swirl in a frenzy. Easily my favorite book by a European author, the wit and the writing style is unmatched and it is a masterpiece in its own right."
  },
  {
    title: "Eternal Husband",
    author: "Fyodor Dostoevsky",
    reaction: "A Dostoevsky plot never disappoints, twisted and dark story that is unimaginable but believable."
  },
  {
    title: "A Nasty Anecdote",
    author: "Fyodor Dostoevsky",
    reaction: "Funny, satirical and an open challenge to the aristocratic society that continues to exploit the poor. It is relevant until today."
  },
  {
    title: "Letters to a Young Poet",
    author: "Rainer Maria Rilke",
    reaction: "I wish I could write something like this for a younger version of me. It felt like talking to my grandfather in poetic language, the only motivation you need to create and explore. This book was a warm hug at the time I needed it the most."
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    reaction: "Like other American Literature, this book was overrated too. The concept was promising but the execution was bland and it was a challenge getting through this, skip it if you can."
  },
  {
    title: "East of Eden",
    author: "John Steinbeck",
    reaction: "The best American book I have ever read, I know this is going to be one of my favorites. The writing explores creative feelings inspired by nature or the life of people. A random thought on a Tuesday evening? That is what this book captures perfectly. "
  }
];

let activeBook = 0;

function selectBook(idx) {
  const books_el = document.querySelectorAll('.p-book');
  const card = document.getElementById('p-book-card');

  if (activeBook === idx && card.classList.contains('active')) {
    card.classList.remove('active');
    books_el[idx].classList.remove('active');
    activeBook = -1;
    return;
  }

  books_el.forEach(b => b.classList.remove('active'));
  books_el[idx].classList.add('active');
  activeBook = idx;

  const b = books[idx];
  document.getElementById('bc-title').textContent = b.title;
  document.getElementById('bc-author').textContent = b.author;
  document.getElementById('bc-reaction').textContent = b.reaction;
  card.classList.add('active');
}

document.querySelectorAll('.p-book').forEach(b => {
  b.addEventListener('click', () => selectBook(+b.dataset.index));
});

// Pre-select first book
selectBook(0);

/* =====================
   MIND MAP
===================== */
const clusters = {
  intellect: { color: '#246800', nodes: ['Philosophy','Technology','Books'] },
  creative:  { color: '#723dc2', nodes: ['Fashion','Music','Writing'] },
  lifestyle: { color: '#e80f8a', nodes: ['Travel','Swimming', 'Badminton', 'Chess', 'Cycling'] }
};

const tooltips = {
  'Philosophy': 'From Stoicism to phenomenology — the questions that don\'t resolve.',
  'Technology': 'Watching this field transform in real time, with equal parts excitement and curiosity.',
  'Books': 'Reading across classics, history, fiction, science. Always going at once.',
  'Fashion': 'The craft that shapes how we are perceived. and what we stand for on the stage.',
  'Music': 'Pop, Instrumental, Qawalli. The record player as ritual object.',
  'Writing': 'The only way I actually understand what I think and to keep an honest document of life,',
  'Travel': 'Slow travel. Long stays. Getting to know a neighborhood.',
  'Swimming': 'An adult hobby that reminds me to keep pushing, all limits are created by the mind.',
  'Badminton': 'A childhood passion, maybe in another universe we would be forever.',
  'Chess': 'A love-hate relationship, mercurial wave of thrill, addiction and sorrow.',
  'Cycling': 'Started as a habit, aspiring to stay consistent.'
};

const edges = [
  {a:'Philosophy',b:'Technology',w:2},{a:'Philosophy',b:'Books',w:3},
  {a:'Philosophy',b:'Writing',w:2},{a:'Technology',b:'Fashion',w:1},
  {a:'Fashion',b:'Writing',w:2},{a:'Fashion',b:'Music',w:1},{a:'Travel',b:'Writing',w:2},
  {a:'Books',b:'Writing',w:3},{a:'Books',b:'Philosophy',w:2},{a:'Music',b:'Writing',w:2},
  {a:'Travel',b:'Swimming',w:1},{a:'Swimming',b:'Cycling',w:1},{a:'Swimming',b:'Badminton',w:1},
  {a:'Cycling',b:'Badminton',w:1},{a:'Cycling',b:'Travel',w:2},{a:'Chess',b:'Writing',w:1},{a:'Chess',b:'Philosophy',w:1}
];

const nodeCluster = {};
Object.entries(clusters).forEach(([cl, {nodes}]) => {
  nodes.forEach(n => nodeCluster[n] = cl);
});
const allNodes = Object.values(clusters).flatMap(c => c.nodes);

const adj = {};
allNodes.forEach(n => adj[n] = []);
edges.forEach(({a,b,w}) => { adj[a].push({node:b,w}); adj[b].push({node:a,w}); });

// Layout: circular per cluster with offsets
const svg = document.getElementById('p-mindmap-svg');
let W, H, positions, drifts;

function buildMap() {
  W = svg.parentElement.offsetWidth;
  H = svg.parentElement.offsetHeight;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = '';

  const cx = W/2, cy = H/2;
  const R = Math.min(W,H) * 0.32;

  const clusterMult = { intellect:0.6, creative:1.05, lifestyle:1.2 };

  // Assign angular positions
  const total = allNodes.length;
  const clusterAngles = { intellect:[], creative:[], lifestyle:[]};
  let base = 0;
  Object.entries(clusters).forEach(([cl, {nodes}]) => {
    const span = (nodes.length / total) * 2 * Math.PI;
    nodes.forEach((n, i) => {
      clusterAngles[cl].push(base + (i / (nodes.length - 0.5)) * span);
    });
    base += span + 0.3;
  });

  positions = {};
  Object.entries(clusters).forEach(([cl, {nodes}]) => {
    const mult = clusterMult[cl];
    nodes.forEach((n, i) => {
      const a = clusterAngles[cl][i];
      positions[n] = {
        bx: cx + Math.cos(a) * R * mult,
        by: cy + Math.sin(a) * R * mult,
        x: 0, y: 0
      };
    });
  });

  drifts = {};
  allNodes.forEach(n => {
    drifts[n] = {
      r: 12 + Math.random()*8,
      spd: 0.0006 + Math.random()*0.0006,
      off: Math.random()*Math.PI*2
    };
  });

  // Draw edge group
  const edgeG = document.createElementNS('http://www.w3.org/2000/svg','g');
  edgeG.id = 'p-edges';
  svg.appendChild(edgeG);

  edges.forEach(({a,b,w}) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('stroke', '#3a322a');
    line.setAttribute('stroke-opacity', 0.12 + w * 0.05);
    line.setAttribute('stroke-width', w);
    line.setAttribute('stroke-linecap', 'round');
    line.dataset.a = a;
    line.dataset.b = b;
    edgeG.appendChild(line);
  });

  // Draw node group
  const nodeG = document.createElementNS('http://www.w3.org/2000/svg','g');
  nodeG.id = 'p-nodes';
  svg.appendChild(nodeG);

  allNodes.forEach(n => {
    const cl = nodeCluster[n];
    const color = clusters[cl].color;
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.dataset.node = n;
    g.style.cursor = 'pointer';

    const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
    ring.setAttribute('r', 28);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', color);
    ring.setAttribute('stroke-opacity', 0.25);
    ring.setAttribute('stroke-width', 1);
    ring.classList.add('p-ring');

    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r', 10);
    dot.setAttribute('fill', color);
    dot.setAttribute('fill-opacity', 0.85);
    dot.classList.add('p-dot');

    const label = document.createElementNS('http://www.w3.org/2000/svg','text');
    label.setAttribute('font-family', 'Fraunces, Georgia, serif');
    label.setAttribute('font-style', 'italic');
    label.setAttribute('font-size', 14);
    label.setAttribute('fill', '#3a322a');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('y', -22);
    label.textContent = n;

    g.appendChild(ring);
    g.appendChild(dot);
    g.appendChild(label);
    nodeG.appendChild(g);

    g.addEventListener('mouseenter', (e) => highlightNode(n, e));
    g.addEventListener('mouseleave', () => resetHighlight());
  });
}

let tooltipTimer;

function highlightNode(name, evt) {
  const allG = svg.querySelectorAll('[data-node]');
  const connected = new Set(adj[name].map(x=>x.node));
  connected.add(name);

  allG.forEach(g => {
    const n = g.dataset.node;
    const ring = g.querySelector('.p-ring');
    const dot = g.querySelector('.p-dot');
    if (connected.has(n)) {
      g.style.opacity = 1;
      ring.setAttribute('stroke-opacity', 0.7);
      dot.setAttribute('fill-opacity', 1);
    } else {
      g.style.opacity = 0.25;
    }
  });

  svg.querySelectorAll('#p-edges line').forEach(l => {
    const a = l.dataset.a, b = l.dataset.b;
    if (a === name || b === name) {
      const cl = nodeCluster[name];
      l.setAttribute('stroke', clusters[cl].color);
      l.setAttribute('stroke-opacity', 0.85);
    } else {
      l.setAttribute('stroke-opacity', 0.05);
    }
  });

  // Tooltip
  const tip = document.getElementById('p-tooltip');
  const rect = svg.parentElement.getBoundingClientRect();
  const pos = positions[name];
  tip.style.left = Math.min(pos.x + 14, W - 234) + 'px';
  tip.style.top = (pos.y - 40) + 'px';
  tip.textContent = tooltips[name] || name;
  tip.style.opacity = 1;
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => { tip.style.opacity = 0; }, 3500);
}

function resetHighlight() {
  svg.querySelectorAll('[data-node]').forEach(g => {
    g.style.opacity = 1;
    g.querySelector('.p-ring').setAttribute('stroke-opacity', 0.25);
    g.querySelector('.p-dot').setAttribute('fill-opacity', 0.85);
  });
  svg.querySelectorAll('#p-edges line').forEach(l => {
    const w = +l.getAttribute('stroke-width');
    l.setAttribute('stroke', '#3a322a');
    l.setAttribute('stroke-opacity', 0.12 + w*0.05);
  });
}

function animateMap(t) {
  allNodes.forEach(n => {
    const d = drifts[n];
    const p = positions[n];
    p.x = p.bx + Math.sin(t * d.spd + d.off) * d.r;
    p.y = p.by + Math.cos(t * d.spd * 0.8 + d.off) * d.r;

    const g = svg.querySelector(`[data-node="${n}"]`);
    if (g) g.setAttribute('transform', `translate(${p.x},${p.y})`);
  });

  svg.querySelectorAll('#p-edges line').forEach(l => {
    const pa = positions[l.dataset.a];
    const pb = positions[l.dataset.b];
    if (pa && pb) {
      l.setAttribute('x1', pa.x); l.setAttribute('y1', pa.y);
      l.setAttribute('x2', pb.x); l.setAttribute('y2', pb.y);
    }
  });

  requestAnimationFrame(animateMap);
}

buildMap();
requestAnimationFrame(animateMap);
window.addEventListener('resize', buildMap);

/* =====================
   FADE-IN OBSERVER
===================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.p-fade').forEach(el => observer.observe(el));

/* =====================
   SMOOTH SCROLL
===================== */
const navH = document.querySelector('.p-nav').offsetHeight;
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =====================
   MODE SWITCHER REDIRECT
===================== */
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('change', () => {
  if (modeToggle.checked) {
     window.location.href = 'professional.html'; 
   }
});

/* =====================
   NAV ACTIVE STATE
===================== */
const sections = document.querySelectorAll('section[id], #hero');
const navLinks = document.querySelectorAll('.p-nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));
