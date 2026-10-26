/* =========================================================
   CONFIG — edita aquí si cambia el equipo o la rotación
   ========================================================= */
const CONFIG = {
  // Orden de la rotación (el ciclo se repite en este orden)
  people: [
    { name: 'Alejandro', color: '#D9480F' },
    { name: 'Isaac',     color: '#0C8599' },
    { name: 'Bryan',     color: '#5F3DC4' },
    { name: 'Solano',    color: '#C2255C' },
    { name: 'Jorge',     color: '#2F9E44' },
  ],
  // Fecha ancla conocida: martes 27 de octubre de 2026 → le toca a "Solano"
  anchor: { year: 2026, month: 10, day: 27 },
  anchorPersonIndex: 3, // 0=Alejandro, 1=Isaac, 2=Bryan, 3=Solano, 4=Jorge
  eventWeekdays: [2, 5], // 2 = martes, 5 = viernes
  upcomingCount: 6,
};

/* =========================================================
   Utilidades de fecha (todo en UTC para evitar saltos de DST)
   ========================================================= */
const DAY = 86400000;
const PEOPLE = CONFIG.people;

const utc = (y, m, d) => Date.UTC(y, m - 1, d);
const ANCHOR_MS = utc(CONFIG.anchor.year, CONFIG.anchor.month, CONFIG.anchor.day);
const ANCHOR_INDEX = CONFIG.anchorPersonIndex;
const ANCHOR_SLOT = CONFIG.eventWeekdays.indexOf(new Date(ANCHOR_MS).getUTCDay());

const dowOf = (ms) => new Date(ms).getUTCDay();
const mondayOf = (ms) => ms - ((dowOf(ms) + 6) % 7) * DAY;

/** Índice (1, 2, 3...) del evento martes/viernes, o null si el día no es evento. */
function slotOf(ms) {
  const slot = CONFIG.eventWeekdays.indexOf(dowOf(ms));
  if (slot === -1) return null;
  const weeks = Math.round((mondayOf(ms) - mondayOf(ANCHOR_MS)) / (7 * DAY));
  return ANCHOR_INDEX + weeks * CONFIG.eventWeekdays.length + (slot - ANCHOR_SLOT);
}

function personFor(ms) {
  const slot = slotOf(ms);
  if (slot === null) return null;
  return PEOPLE[((slot % PEOPLE.length) + PEOPLE.length) % PEOPLE.length];
}

const isEvent = (ms) => slotOf(ms) !== null;

/** Hoy, como medianoche UTC del día local. */
function todayMs() {
  const n = new Date();
  return utc(n.getFullYear(), n.getMonth() + 1, n.getDate());
}

function nextEventFrom(ms) {
  for (let i = 0; i < 400; i++) {
    const d = ms + i * DAY;
    if (isEvent(d)) return d;
  }
  return ms;
}

const fmtLong = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
});
const fmtShort = new Intl.DateTimeFormat('es-MX', {
  weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
});
const fmtMonth = new Intl.DateTimeFormat('es-MX', {
  month: 'long', year: 'numeric', timeZone: 'UTC',
});

const clean = (s) => s.replace(/\.$/, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* =========================================================
   Render
   ========================================================= */
const el = (id) => document.getElementById(id);
const TODAY = todayMs();

function renderNext() {
  const next = nextEventFrom(TODAY);
  const person = personFor(next);
  const diff = Math.round((next - TODAY) / DAY);

  el('nextEyebrow').textContent = diff === 0 ? 'Hoy le toca a' : 'El próximo en traer es';
  el('nextName').textContent = person.name;
  el('nextName').style.setProperty('--c', person.color);
  el('nextDate').textContent = clean(fmtLong.format(new Date(next)));

  el('nextCountdown').textContent =
    diff === 0 ? '¡es hoy!' : diff === 1 ? 'mañana' : `en ${diff} días`;

  // Orden de rotación, empezando por el siguiente
  const startIndex = PEOPLE.indexOf(person);
  const ul = el('rotation');
  ul.innerHTML = '';
  for (let i = 0; i < PEOPLE.length; i++) {
    const p = PEOPLE[(startIndex + i) % PEOPLE.length];
    const li = document.createElement('li');
    li.style.setProperty('--c', p.color);
    if (i === 0) li.classList.add('is-next');
    li.innerHTML =
      `<span class="num">${i + 1}</span>` +
      `<span class="dot"></span>` +
      `<span>${p.name}</span>` +
      (i === 0 ? '<span class="tag">siguiente</span>' : '');
    ul.appendChild(li);
  }

  return next;
}

/* ---------- Calendario ---------- */
let view = (() => {
  const d = new Date(TODAY);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
})();

const DOW_LABELS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

function renderCalendar() {
  const first = Date.UTC(view.y, view.m, 1);
  const offset = (dowOf(first) + 6) % 7;
  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const cells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const next = nextEventFrom(TODAY);
  const grid = el('grid');
  grid.innerHTML = '';

  DOW_LABELS.forEach((label) => {
    const h = document.createElement('div');
    h.className = 'dow';
    h.textContent = label;
    grid.appendChild(h);
  });

  for (let i = 0; i < cells; i++) {
    const ms = first - offset * DAY + i * DAY;
    const d = new Date(ms);
    const inMonth = d.getUTCMonth() === view.m;
    const person = isEvent(ms) ? personFor(ms) : null;

    const cell = document.createElement('div');
    cell.className = 'cell';
    if (!inMonth) cell.classList.add('out');
    if (person && inMonth) cell.classList.add('event');
    if (ms === TODAY) cell.classList.add('today');
    if (ms === next && inMonth) cell.classList.add('next');

    const label = person
      ? `${clean(fmtLong.format(d))} — trae ${person.name}`
      : clean(fmtLong.format(d));
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', label);
    if (person) cell.title = label;

    const num = document.createElement('span');
    num.className = 'dnum';
    num.textContent = d.getUTCDate();
    cell.appendChild(num);

    if (person && inMonth) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.setProperty('--c', person.color);
      chip.innerHTML =
        `<span class="ini">${person.name[0]}</span>` +
        `<span class="nm">${person.name}</span>`;
      cell.appendChild(chip);
    }

    grid.appendChild(cell);
  }

  el('monthLabel').textContent = cap(fmtMonth.format(new Date(Date.UTC(view.y, view.m, 1))));
}

/* ---------- Próximas fechas ---------- */
function renderUpcoming() {
  const box = el('upcoming');
  box.innerHTML = '';
  let ms = nextEventFrom(TODAY);

  for (let i = 0; i < CONFIG.upcomingCount; i++) {
    const person = personFor(ms);
    const row = document.createElement('div');
    row.className = 'u-row' + (i === 0 ? ' is-next' : '');
    row.innerHTML =
      `<span class="u-date">${cap(clean(fmtShort.format(new Date(ms))))}</span>` +
      `<span class="chip" style="--c:${person.color}">` +
      `<span class="nm">${person.name}</span>` +
      `<span class="ini">${person.name[0]}</span>` +
      `</span>` +
      (i === 0 ? '<span class="u-tag">siguiente</span>' : '');
    box.appendChild(row);

    ms = nextEventFrom(ms + DAY);
  }
}

/* ---------- Navegación ---------- */
el('prevBtn').addEventListener('click', () => {
  view.m--;
  if (view.m < 0) { view.m = 11; view.y--; }
  renderCalendar();
});

el('nextBtn').addEventListener('click', () => {
  view.m++;
  if (view.m > 11) { view.m = 0; view.y++; }
  renderCalendar();
});

el('todayBtn').addEventListener('click', () => {
  const d = new Date(TODAY);
  view = { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  renderCalendar();
});

renderNext();
renderCalendar();
renderUpcoming();
