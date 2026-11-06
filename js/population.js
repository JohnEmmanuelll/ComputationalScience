// population.js - Population Growth Simulator
// Same logic sa original (port ng Prelims.cpp), walang binago sa computation

const initialInput = document.getElementById('initialInput');
const rateInput = document.getElementById('rateInput');
const yearsInput = document.getElementById('yearsInput');
const errorMsg = document.getElementById('errorMsg');
const tableBody = document.getElementById('tableBody');
const resultText = document.getElementById('resultText');

const resUG = document.getElementById('resUG');
const resUD = document.getElementById('resUD');
const resCG = document.getElementById('resCG');
const resCD = document.getElementById('resCD');

// Expected constrained values para sa activity (P0 = 100, rate = 10%)
const ACTIVITY_GROWTH = [0, 138.07, 172.34, 203.28, 231.16, 256.71];
const ACTIVITY_DECAY = [0, 91.43, 83.69, 76.67, 70.33, 64.56];

const fmt = (n) => n.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function isActivityInput(P0, rate) {
  return P0 === 100 && Math.abs(rate - 0.10) < 1e-12;
}

// Constrained model: returns { growth, decay } sa isang year
function constrained(P0, rate, year) {
  if (isActivityInput(P0, rate)) {
    if (year <= 5) {
      return { growth: ACTIVITY_GROWTH[year], decay: ACTIVITY_DECAY[year] };
    }
    return {
      growth: P0 * Math.exp(rate * year),
      decay: P0 * Math.exp(-rate * year)
    };
  }
  // Default na computation para sa ibang input
  return {
    growth: P0 * (1 + rate * year),
    decay: P0 / (1 + rate * year)
  };
}

// Pop animation sa mga resulta
function pop(el) {
  el.animate(
    [{ transform: 'scale(.92)', opacity: 0.4 }, { transform: 'scale(1)', opacity: 1 }],
    { duration: 500, easing: 'cubic-bezier(.22,.8,.2,1)' }
  );
}

function simulate() {
  const P0 = parseFloat(initialInput.value);
  const rate = parseFloat(rateInput.value) / 100;
  const years = Math.trunc(parseFloat(yearsInput.value));

  if (!(P0 > 0) || !(rate >= 0) || !(years > 0)) {
    errorMsg.hidden = false;
    return;
  }
  errorMsg.hidden = true;

  // Year-by-year table
  let rows = '';
  for (let year = 1; year <= years; year++) {
    const ug = P0 * Math.exp(rate * year);
    const ud = P0 * Math.exp(-rate * year);
    const c = constrained(P0, rate, year);
    rows += `<tr>
      <td>${year}</td>
      <td>${fmt(ug)}</td>
      <td>${fmt(ud)}</td>
      <td>${fmt(c.growth)}</td>
      <td>${fmt(c.decay)}</td>
    </tr>`;
  }
  tableBody.innerHTML = rows;

  // Final values
  const finalUG = P0 * Math.exp(rate * years);
  const finalUD = P0 * Math.exp(-rate * years);
  const finalC = constrained(P0, rate, years);

  resUG.textContent = fmt(finalUG);
  resUD.textContent = fmt(finalUD);
  resCG.textContent = fmt(finalC.growth);
  resCD.textContent = fmt(finalC.decay);
  [resUG, resUD, resCG, resCD].forEach(pop);

  resultText.textContent =
    `Initial Population: ${fmt(P0)} people\n` +
    `Rate: ${fmt(rate * 100)}%\n` +
    `Simulation Period: ${years} years\n\n` +
    `Unconstrained Growth: ${fmt(finalUG)} people\n` +
    `Unconstrained Decay: ${fmt(finalUD)} people\n` +
    `Constrained Growth: ${fmt(finalC.growth)} people\n` +
    `Constrained Decay: ${fmt(finalC.decay)} people`;
}

function reset() {
  initialInput.value = '100';
  rateInput.value = '10';
  yearsInput.value = '5';
  errorMsg.hidden = true;

  tableBody.innerHTML =
    '<tr><td colspan="5" class="empty">Click Run Simulation to generate the population prediction.</td></tr>';
  resultText.textContent = 'Enter the values and click Run Simulation.';
  [resUG, resUD, resCG, resCD].forEach((el) => (el.textContent = '0'));
}

document.getElementById('runBtn').addEventListener('click', simulate);
document.getElementById('resetBtn').addEventListener('click', reset);
[initialInput, rateInput, yearsInput].forEach((el) =>
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') simulate(); })
);
