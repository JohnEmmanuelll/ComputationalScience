// ecoreduce.js - EcoReduce Waste Analysis
// Same computation pa rin sa original, inayos lang yung dobleng onclick

const $ = (id) => document.getElementById(id);
const ids = ['plastic', 'paper', 'glass', 'metal', 'organic', 'residual'];
let wasteData = {};

// Count-up animation para sa mga numero
function countUp(el, end, suffix) {
  const start = performance.now();
  const duration = 900;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (end * eased).toFixed(2) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Set ng progress bar na may animation
function setBar(id, pct) {
  const bar = $(id);
  bar.style.width = '0%';
  void bar.offsetWidth; // reflow para gumana ang transition
  bar.style.width = pct + '%';
}

function calculate() {
  const values = {};
  let total = 0;

  // Kunin at i-validate ang mga input
  for (const id of ids) {
    const v = parseFloat($(id).value) || 0;
    if (v < 0) { alert('Values cannot be negative.'); return; }
    values[id] = v;
    total += v;
  }
  if (total === 0) { alert('Please enter at least one value.'); return; }

  const monthly = total * 30;
  const annual = total * 365;

  const pct = {};
  ids.forEach((id) => (pct[id] = (values[id] / total) * 100));
  wasteData = { ...values, total, monthly, annual, percentages: pct };

  // Mga formula (same sa original)
  const recyclable = values.plastic + values.paper + values.glass + values.metal;
  const recyclingRate = (recyclable / total) * 100;
  const compostPotential = (values.organic / total) * 100;
  const goal = total * 0.75;
  const residualPenalty = 100 - pct.residual;
  const score = recyclingRate * 0.4 + compostPotential * 0.3 + residualPenalty * 0.3;

  // Pinakamalaking waste
  const largest = Object.entries(values).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  // Ipakita ang results
  $('placeholder').style.display = 'none';
  $('analysisResults').style.display = 'block';

  countUp($('total'), total, ' kg');
  countUp($('monthly'), monthly, ' kg');
  countUp($('annual'), annual, ' kg');
  countUp($('recycle'), recyclingRate, '%');
  countUp($('compost'), compostPotential, '%');
  countUp($('goal'), goal, ' kg/day');
  countUp($('score'), score, '%');
  $('largest').textContent = largest.charAt(0).toUpperCase() + largest.slice(1);

  setBar('recycleBar', recyclingRate);
  setBar('compostBar', compostPotential);
  setBar('scoreBar', score);

  $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('analyzeBtn').addEventListener('click', calculate);
ids.forEach((id) =>
  $(id).addEventListener('keydown', (e) => { if (e.key === 'Enter') calculate(); })
);
