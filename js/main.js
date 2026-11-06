// main.js - shared sa lahat ng page (background, nav, reveal)

// Background: dahon na lumulutang + 2 malaking dahon
(function () {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 9; i++) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf';
    leaf.style.cssText =
      `left:${Math.random() * 100}vw;` +
      `--s:${14 + Math.random() * 26}px;` +
      `--d:${26 + Math.random() * 28}s;` +
      `--l:-${Math.random() * 40}s;` +
      `--x:${(Math.random() - 0.5) * 30}vw`;
    frag.appendChild(leaf);
  }
  ['a', 'b'].forEach((k) => {
    const big = document.createElement('span');
    big.className = 'bigleaf ' + k;
    frag.appendChild(big);
  });
  document.body.appendChild(frag);
})();

// Active link sa nav, base sa filename ng page
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav .link').forEach((a) => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// Reveal effect pag na-scroll na ang section
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
