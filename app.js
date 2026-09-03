/* ADAPT-STL Design Studio — application logic */

const CFG = window.ADAPT_CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let uid = 0;
const nextId = () => `s${++uid}`;
const makeCode = () => 'STL-' + Math.random().toString(36).slice(2, 6).toUpperCase();

const state = {
  screen: 'welcome',
  code: makeCode(),
  startedAt: new Date().toISOString(),
  purpose: null,
  hazard: null,
  role: '',
  org: '',
  template: null,
  layoutMode: 'grid',
  appTitle: 'My ADAPT-STL tool',
  slots: [],
  selected: null,
  pendingSlot: null,
  tab: 'panel',
  search: '',
  brief: { decision: '', action: '', who: '', frequency: '', missing: '', barrier: '', contact: '' },
  submitted: false,
};

const SCREENS = ['welcome', 'purpose', 'template', 'build', 'review', 'done'];
const STEP_LABELS = [
  { key: 'purpose', label: 'Purpose' },
  { key: 'template', label: 'Layout' },
  { key: 'build', label: 'Build' },
  { key: 'review', label: 'Submit' },
];

/* ---------------- previews ---------------- */

const NOTE_MOCK = `<div class="mk mk-pad" style="display:grid;gap:8px;align-content:start">
  <span class="mk-txt" style="width:84%"></span><span class="mk-txt" style="width:96%"></span>
  <span class="mk-txt" style="width:72%"></span>
  <span class="mk-txt" style="width:46%;background:var(--color-primary)"></span></div>`;

const SCALES = { thumb: 0.375, review: 0.3 };

function previewMarkup(w, mode) {
  if (w.img) {
    return `<img src="${w.img}" alt="${esc(w.name)} example" loading="lazy" decoding="async">` +
      (mode === 'canvas' && w.caption ? `<span class="widget-caption">${esc(w.caption)}</span>` : '');
  }
  const html = w.isNote ? NOTE_MOCK : (PREVIEWS[w.preview] ? PREVIEWS[w.preview]() : '');
  if (mode === 'canvas') return html;
  return `<div class="mk-scale" style="--mk-s:${SCALES[mode] || 0.375}"><div class="mk-inner">${html}</div></div>`;
}

/* ---------------- toast ---------------- */

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-open');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-open'), 2600);
}

/* ---------------- navigation ---------------- */

function renderHeroStrip() {
  const el = $('#hero-strip');
  if (!el) return;
  const ids = [
    ['heat-map', 'Heat hotspot map'], ['flood-map', 'Flood depth map'],
    ['heatdays', 'Forecast vs. threshold'], ['hydrograph', 'River stage'],
    ['alert', 'Threshold alert'], ['nearme', 'Walk-time to help'],
  ];
  el.innerHTML = ids.map(([id, label]) => {
    const w = WIDGET_BY_ID[id];
    if (!w) return '';
    return `<figure><span class="hs-view">${previewMarkup(w, 'canvas')}</span>
      <figcaption>${esc(label)}</figcaption></figure>`;
  }).join('');
}

function goto(screen) {
  const _t = $('#toast'); if (_t) _t.classList.remove('is-open');
  state.screen = screen;
  SCREENS.forEach((s) => $('#screen-' + s).classList.toggle('is-active', s === screen));
  const build = screen === 'build';
  $('#btn-open-rail').hidden = !build;
  $('#btn-open-panel').hidden = !build;
  closeSheets();
  renderStepper();
  if (screen === 'build') renderBuild();
  if (screen === 'review') renderReview();
  if (screen === 'done') $('#done-code').textContent = state.code;
  window.scrollTo({ top: 0, behavior: 'auto' });
  const active = $('#screen-' + screen);
  if (active) { const sc = active.querySelector('.canvas-scroll'); if (sc) sc.scrollTop = 0; }
}

function renderStepper() {
  const idx = SCREENS.indexOf(state.screen);
  $('#stepper').innerHTML = STEP_LABELS.map((s, i) => {
    const si = SCREENS.indexOf(s.key);
    const cls = si === idx ? 'is-active' : si < idx ? 'is-done' : '';
    return `<div class="step-dot ${cls}"><b>${si < idx ? '✓' : i + 1}</b><span>${s.label}</span></div>` +
      (i < STEP_LABELS.length - 1 ? '<div class="step-rule"></div>' : '');
  }).join('');
}

/* ---------------- theme ---------------- */

let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  $('#icon-theme').innerHTML = theme === 'dark'
    ? '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>'
    : '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/>';
}

/* ---------------- step 1: purpose ---------------- */

function renderPurpose() {
  $('#purpose-grid').innerHTML = PURPOSES.map((p) => `
    <button class="choice ${state.purpose === p.id ? 'is-selected' : ''}" data-purpose="${p.id}" type="button">
      <span class="choice-icon">${ICON[p.icon]}</span>
      <span><h3>${esc(p.name)}</h3><span class="choice-sub">${esc(p.sub)}</span>
      <p>${esc(p.desc)}</p></span>
    </button>`).join('');

  $('#hazard-grid').innerHTML = HAZARDS.map((h) => `
    <button class="choice hazard-choice ${state.hazard === h.id ? 'is-selected' : ''}" data-hazard="${h.id}" type="button">
      <span class="choice-icon">${ICON[h.icon]}</span>
      <span><h3>${esc(h.name)}</h3><p>${esc(h.desc)}</p></span>
    </button>`).join('');

  const sel = $('#in-role');
  if (!sel.options.length) {
    sel.innerHTML = ROLES.map((r) => `<option value="${esc(r)}">${r ? esc(r) : 'Select a role…'}</option>`).join('');
  }
  const ok = state.purpose && state.hazard;
  $('#btn-to-template').disabled = !ok;
  $('#purpose-note').textContent = ok ? 'You can change either of these later.' : 'Select a purpose and a hazard to continue.';
}

/* ---------------- step 2: templates ---------------- */

function renderTemplates() {
  $('#template-grid').innerHTML = TEMPLATES.map((t) => `
    <button class="template-card ${state.template === t.id ? 'is-selected' : ''}" data-template="${t.id}" type="button">
      <div class="template-thumb">
        ${t.thumb.map((c) => `<i style="grid-column:span ${c[0]};grid-row:span ${c[1]}" class="${c[2] ? 'accent' : ''}"></i>`).join('')}
      </div>
      <h4>${esc(t.name)}</h4><p>${esc(t.desc)}</p>
    </button>`).join('');
  $('#btn-to-build').disabled = !state.template;
}

function applyTemplate() {
  const t = TEMPLATES.find((x) => x.id === state.template);
  state.layoutMode = t.free ? 'free' : 'grid';
  if (t.free) {
    state.slots = [];
    state.selected = null;
    if ($('#in-prefill').checked) {
      const picks = [...new Set([...(SUGGESTIONS[state.purpose] || []), ...(HAZARD_SUGGEST[state.hazard] || [])])].slice(0, 4);
      picks.forEach((id) => {
        const w = WIDGET_BY_ID[id];
        if (!w) return;
        state.slots.push({ id: nextId(), x: null, y: null, fw: null, fh: null, w: w.w, h: w.h, widget: makeWidget(id) });
      });
      state.selected = state.slots.length ? state.slots[0].id : null;
    }
    return;
  }
  state.slots = t.slots.map((s) => ({ id: nextId(), w: s.w, h: s.h, hint: s.hint, widget: null }));
  if ($('#in-prefill').checked) {
    const fallback = [...(SUGGESTIONS[state.purpose] || []), ...(HAZARD_SUGGEST[state.hazard] || [])];
    let fi = 0;
    state.slots.forEach((slot, i) => {
      let id = resolvePick(t.slots[i].pick, state.hazard, state.purpose, t.slots[i].hint);
      while (!id && fi < fallback.length) { id = fallback[fi++]; }
      if (id && WIDGET_BY_ID[id]) slot.widget = makeWidget(id);
    });
  }
  state.selected = state.slots.find((s) => s.widget) ? state.slots.find((s) => s.widget).id : null;
}

function makeWidget(typeId) {
  return { type: typeId, title: WIDGET_BY_ID[typeId].name, need: '', data: '', geo: '', freq: '', priority: 'must', avail: '', text: '' };
}

/* ---------------- step 3: build ---------------- */

function renderBuild() {
  const p = PURPOSES.find((x) => x.id === state.purpose);
  const h = HAZARDS.find((x) => x.id === state.hazard);
  $('#chip-purpose').textContent = p ? p.sub : '—';
  $('#chip-hazard').textContent = h ? h.name : '—';
  $('#chip-hazard').className = 'chip ' + (state.hazard === 'heat' ? 'heat' : state.hazard === 'flood' ? 'flood' : '');
  $('#in-app-title').value = state.appTitle;
  syncLayoutMode();
  renderPalette();
  renderCanvas();
  renderPanel();
}

function renderPalette() {
  const hz = state.hazard;
  const q = (state.search || '').trim().toLowerCase();
  const match = (w) => !q || (w.name + ' ' + w.hint + ' ' + w.group + ' ' + (w.hazard || '')).toLowerCase().includes(q);
  const sorted = [...WIDGETS].filter(match).sort((a, b) => {
    const rel = (w) => (w.hazard && (hz === 'both' || w.hazard === hz) ? 0 : w.hazard ? 2 : 1);
    return rel(a) - rel(b);
  });
  $('#palette').innerHTML = GROUP_ORDER.map((g) => {
    const items = sorted.filter((w) => w.group === g);
    if (!items.length) return '';
    return `<section class="palette-group"><h4>${esc(g)}</h4>${items.map((w) => `
      <button class="palette-item" type="button" draggable="true" data-new="${w.id}" title="Add ${esc(w.name)}">
        <span class="palette-thumb">${previewMarkup(w, 'thumb')}</span>
        <span class="palette-label"><b>${esc(w.name)}</b><span>${esc(w.hint)}</span>${
          w.hazard ? `<span class="tag-hazard ${w.hazard}">${w.hazard}</span>` : ''}</span>
      </button>`).join('')}</section>`;
  }).join('') || `<p class="palette-empty">No panels match \u201c${esc(state.search)}\u201d. Clear the search to see all ${WIDGETS.length}.</p>`;
}


/* ---------------- canvas rendering ---------------- */

let zTop = 10;
const isNarrow = () => window.matchMedia('(max-width: 880px)').matches;
const snapTo = (v) => Math.round(v / FREE.grid) * FREE.grid;
/* the free surface is fluid — geometry is clamped to whatever width it actually has */
function surfW() {
  const el = document.getElementById('free-surface');
  const w = el && el.clientWidth ? el.clientWidth : FREE.width;
  return Math.max(FREE.minW + FREE.pad * 2, w);
}

function noteMarkup(slot) {
  const w = WIDGET_BY_ID[slot.widget.type];
  const val = w.isNote ? (slot.widget.text || '') : (slot.widget.need || '');
  const filled = val.trim().length > 0;
  const label = w.isNote ? 'Your note' : 'What do you need this panel to show you?';
  const ph = w.isNote
    ? 'Anything the other panels can\u2019t express\u2026'
    : 'e.g. which blocks are over 100\u00b0F right now, refreshed hourly';
  return `<div class="widget-note ${filled ? '' : 'is-empty'}" data-note="${slot.id}">
    <label for="wn-${slot.id}"><span class="wn-dot" aria-hidden="true"></span>${label}</label>
    <textarea id="wn-${slot.id}" data-note-input="${slot.id}"
      placeholder="${esc(ph)}" spellcheck="true">${esc(val)}</textarea>
  </div>`;
}

function widgetMarkup(slot, free) {
  const w = WIDGET_BY_ID[slot.widget.type];
  const isSel = state.selected === slot.id;
  const style = free
    ? `left:${slot.x}px;top:${slot.y}px;width:${slot.fw}px;height:${slot.fh}px;z-index:${slot.z || 1}`
    : '';
  const tools = free
    ? `<button class="widget-tool" data-act="front" data-id="${slot.id}" title="Bring to front" aria-label="Bring to front">\u2b1a</button>
       <button class="widget-tool" data-act="del" data-id="${slot.id}" title="Remove" aria-label="Remove">\u2715</button>`
    : `<button class="widget-tool" data-act="up" data-id="${slot.id}" title="Move up" aria-label="Move up">\u2191</button>
       <button class="widget-tool" data-act="down" data-id="${slot.id}" title="Move down" aria-label="Move down">\u2193</button>
       <button class="widget-tool" data-act="del" data-id="${slot.id}" title="Remove" aria-label="Remove">\u2715</button>`;
  return `<article class="widget ${free ? 'is-free' : ''} ${isSel ? 'is-selected' : ''} ${w.isNote ? 'is-note' : ''}"
           data-widget="${slot.id}" style="${style}" tabindex="0">
      <header class="widget-head" ${free ? `data-drag="${slot.id}"` : 'draggable="true"'}>
        <h4>${esc(slot.widget.title || w.name)}</h4>
        <div class="widget-tools">${tools}</div>
      </header>
      <div class="widget-body">${w.isNote
        ? esc(slot.widget.text || 'Type your note in the box below\u2026')
        : previewMarkup(w, 'canvas')}</div>
      ${noteMarkup(slot)}
      ${free ? `<button class="fw-resize" data-resize="${slot.id}" aria-label="Resize panel"></button>` : ''}
    </article>`;
}

function renderCanvas() {
  const free = state.layoutMode === 'free';
  $('#canvas').hidden = free;
  $('#free-wrap').hidden = !free;
  $('#btn-add-slot').hidden = free;
  const hint = $('#canvas-hint');
  if (hint) hint.textContent = free
    ? 'Tip: write in the box under each panel \u2014 those notes are what the Forum writes up. The layout alone isn\u2019t enough.'
    : 'Tip: click a panel to set its details, and write what it must show in the box underneath. Notes are what the Forum writes up.';
  const fh = document.querySelector('.free-hint');
  if (fh) fh.textContent = isNarrow()
    ? 'On a phone the panels stack in one column. Open this on a laptop or tablet to drag them into any arrangement you like.'
    : 'Free layout: drag a panel\u2019s title bar to move it anywhere, drag its bottom-right corner to resize, and overlap them however you like. Nothing snaps into rows.';
  if (free) renderFreeCanvas(); else renderGridCanvas();
  const n = state.slots.filter((s) => s.widget).length;
  $('#chip-count').textContent = n === 1 ? '1 panel' : n + ' panels';
}

function renderGridCanvas() {
  $('#canvas').innerHTML = state.slots.map((slot) => {
    const style = `grid-column: span ${slot.w}; grid-row: span ${slot.h};`;
    if (!slot.widget) {
      return `<div class="slot" data-slot="${slot.id}" style="${style}">
        <button class="slot-empty" type="button" data-empty="${slot.id}">
          <span class="plus">\uff0b</span><b>Add a panel</b><span>suggested: ${esc(slot.hint || 'anything')}</span>
        </button></div>`;
    }
    return `<div class="slot" data-slot="${slot.id}" style="${style}">${widgetMarkup(slot, false)}</div>`;
  }).join('');
}

function renderFreeCanvas() {
  const surf = $('#free-surface');
  const filled = state.slots.filter((s) => s.widget);
  filled.forEach((s) => {
    if (s.x != null && s.fw != null) return;
    const size = defaultFreeSize(WIDGET_BY_ID[s.widget.type]);
    s.fw = size.fw; s.fh = size.fh;
    const at = findFreeSpot(s.fw, s.fh, s.id);
    s.x = at.x; s.y = at.y; s.z = ++zTop;
  });
  surf.innerHTML = `<div class="free-empty" id="free-empty" ${filled.length ? 'hidden' : ''}>
      <b>Empty canvas</b>
      <span>Drag a panel from the list on the left onto this space \u2014 or just tap one and it drops in.
      Then drag its title bar to move it and its bottom-right corner to resize it.</span>
    </div>` + filled.map((s) => widgetMarkup(s, true)).join('');
  reflowFree();
}

/* the surface width depends on the viewport, so re-clamp geometry after it is measurable */
function reflowFree() {
  if (state.layoutMode !== 'free') return;
  state.slots.forEach((s) => {
    if (!s.widget) return;
    clampFree(s);
    const el = document.querySelector(`[data-widget="${s.id}"]`);
    if (el) {
      el.style.left = s.x + 'px'; el.style.top = s.y + 'px';
      el.style.width = s.fw + 'px'; el.style.height = s.fh + 'px';
    }
  });
  growSurface();
}

function growSurface() {
  const surf = $('#free-surface');
  if (!surf) return;
  const bottom = state.slots.reduce((m, s) => (s.widget ? Math.max(m, (s.y || 0) + (s.fh || 0)) : m), 0);
  surf.style.minHeight = Math.max(FREE.minHeight, bottom + 120) + 'px';
}

/* ---------- free-layout geometry ---------- */

function defaultFreeSize(w) {
  return {
    fw: Math.max(FREE.minW, Math.min(surfW() - FREE.pad * 2, (w.w || 3) * 186)),
    fh: Math.max(FREE.minH, 120 + (w.h || 2) * 100),
  };
}

function overlaps(a, b) {
  return a.x < b.x + b.fw && a.x + a.fw > b.x && a.y < b.y + b.fh && a.y + a.fh > b.y;
}

function findFreeSpot(fw, fh, ignoreId) {
  const others = state.slots.filter((s) => s.widget && s.id !== ignoreId);
  for (let y = FREE.pad; y < 3000; y += FREE.grid * 2) {
    for (let x = FREE.pad; x + fw <= surfW() - FREE.pad; x += FREE.grid * 2) {
      const box = { x, y, fw, fh };
      if (!others.some((o) => overlaps(box, o))) return { x, y };
    }
  }
  return { x: FREE.pad, y: FREE.pad };
}

function clampFree(slot) {
  const W = surfW();
  slot.fw = Math.max(FREE.minW, Math.min(W - FREE.pad, slot.fw));
  slot.fh = Math.max(FREE.minH, slot.fh);
  slot.x = Math.max(0, Math.min(W - slot.fw, slot.x));
  slot.y = Math.max(0, slot.y);
}

/* convert between the two layout modes so nobody loses work */

function convertToFree() {
  const W = surfW();
  const colW = (W - FREE.pad * 2) / 6;
  let x = FREE.pad, y = FREE.pad, rowH = 0;
  state.slots.filter((s) => s.widget).forEach((s) => {
    const fw = Math.max(FREE.minW, Math.min(W - FREE.pad * 2, snapTo(Math.min(6, s.w || 3) * colW - 14)));
    const fh = Math.max(FREE.minH, snapTo(120 + (s.h || 2) * 100));
    if (x + fw > W - FREE.pad) { x = FREE.pad; y += rowH + FREE.grid; rowH = 0; }
    s.x = x; s.y = y; s.fw = fw; s.fh = fh; s.z = ++zTop;
    x += fw + FREE.grid;
    rowH = Math.max(rowH, fh);
  });
  state.slots = state.slots.filter((s) => s.widget);
}

function convertToGrid() {
  const colW = (surfW() - FREE.pad * 2) / 6;
  state.slots = state.slots.filter((s) => s.widget)
    .sort((a, b) => ((a.y || 0) - (b.y || 0)) || ((a.x || 0) - (b.x || 0)))
    .map((s) => {
      s.w = Math.max(1, Math.min(6, Math.round((s.fw || 380) / colW)));
      s.h = Math.max(1, Math.min(3, Math.round(((s.fh || 320) - 120) / 100)));
      s.hint = s.hint || 'anything';
      return s;
    });
}

function setLayoutMode(mode) {
  if (mode === state.layoutMode) return;
  if (mode === 'free') { $('#free-wrap').hidden = false; convertToFree(); } else convertToGrid();
  state.layoutMode = mode;
  syncLayoutMode();
  renderCanvas();
  renderPanel();
  toast(mode === 'free'
    ? 'Free layout on \u2014 drag panels anywhere, resize from the corner'
    : 'Back to the tidy grid \u2014 panels snap into rows');
}

function syncLayoutMode() {
  $$('#layout-mode button').forEach((b) => b.classList.toggle('is-active', b.dataset.val === state.layoutMode));
}

/* ---------- pointer drag + resize on the free canvas ---------- */

function beginFreeGesture(e, slotId, kind) {
  if (isNarrow()) return;
  const slot = state.slots.find((s) => s.id === slotId);
  const el = document.querySelector(`[data-widget="${slotId}"]`);
  if (!slot || !el) return;
  e.preventDefault();

  selectSlot(slotId, false);
  slot.z = ++zTop;
  el.style.zIndex = slot.z;
  $$('#free-surface .widget').forEach((x) => x.classList.toggle('is-selected', x === el));
  el.classList.add('is-dragging');
  try { el.setPointerCapture(e.pointerId); } catch (_) {}

  const sx = e.clientX, sy = e.clientY;
  const o = { x: slot.x, y: slot.y, fw: slot.fw, fh: slot.fh };
  let moved = false;

  const onMove = (ev) => {
    const dx = ev.clientX - sx, dy = ev.clientY - sy;
    if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
    moved = true;
    if (kind === 'move') { slot.x = snapTo(o.x + dx); slot.y = snapTo(o.y + dy); }
    else { slot.fw = snapTo(o.fw + dx); slot.fh = snapTo(o.fh + dy); }
    clampFree(slot);
    el.style.left = slot.x + 'px'; el.style.top = slot.y + 'px';
    el.style.width = slot.fw + 'px'; el.style.height = slot.fh + 'px';
    growSurface();
  };
  const onUp = () => {
    el.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    growSurface();
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}

function selectSlot(id, rerenderCanvas) {
  state.selected = id;
  state.pendingSlot = null;
  state.tab = 'panel';
  if (rerenderCanvas !== false) renderCanvas();
  renderPanel();
}

/* ---------- panel forms ---------- */

function sel(id, value, options, label, hint) {
  return `<div class="form-row"><label class="field-label" for="${id}">${label}</label>
    ${hint ? `<p class="field-hint">${hint}</p>` : ''}
    <div class="select-wrap"><select class="select-input" id="${id}">
      ${options.map((o) => `<option value="${esc(o)}"${o === value ? ' selected' : ''}>${o ? esc(o) : 'Select…'}</option>`).join('')}
    </select></div></div>`;
}

function seg(id, value, options, label, hint) {
  return `<div class="form-row"><label class="field-label">${label}</label>
    ${hint ? `<p class="field-hint">${hint}</p>` : ''}
    <div class="seg" id="${id}">${options.map((o) =>
      `<button type="button" data-val="${o.id}" class="${value === o.id ? 'is-active' : ''}">${esc(o.label)}</button>`).join('')}</div></div>`;
}

function renderPanel() {
  $$('.panel-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === state.tab));
  const body = $('#panel-body');

  if (state.tab === 'brief') {
    $('#panel-title').textContent = 'Decision brief';
    const b = state.brief;
    body.innerHTML = `
      <p class="panel-note">This is the part the Forum quotes. Write it as if you were briefing a colleague who has to act.</p>
      <div class="form-row"><label class="field-label" for="b-decision">What decision does this tool support?</label>
        <p class="field-hint">e.g. "Which blocks get the next cooling bus on a 100°F day."</p>
        <textarea class="textarea-input" id="b-decision">${esc(b.decision)}</textarea></div>
      <div class="form-row"><label class="field-label" for="b-action">What action follows from it?</label>
        <p class="field-hint">The concrete thing that changes because you looked at the screen.</p>
        <textarea class="textarea-input" id="b-action">${esc(b.action)}</textarea></div>
      <div class="form-row"><label class="field-label" for="b-who">Who else needs to see this?</label>
        <input class="text-input" id="b-who" value="${esc(b.who)}" placeholder="e.g. EOC, aldermen, residents, transit dispatch"></div>
      ${sel('b-frequency', b.frequency, LATENCY, 'How often would you open it?')}
      <div class="form-row"><label class="field-label" for="b-missing">What data or capability is missing today?</label>
        <p class="field-hint">Be blunt. Naming gaps is the single most useful thing you can write here.</p>
        <textarea class="textarea-input" id="b-missing">${esc(b.missing)}</textarea></div>
      <div class="form-row"><label class="field-label" for="b-barrier">What stops you from using a tool like this?</label>
        <p class="field-hint">Access, licensing, staff time, trust, training, connectivity…</p>
        <textarea class="textarea-input" id="b-barrier">${esc(b.barrier)}</textarea></div>
      <div class="form-row"><label class="field-label" for="b-contact">Email for follow-up <span style="font-weight:400;color:var(--color-text-muted)">(optional)</span></label>
        <input class="text-input" id="b-contact" type="email" inputmode="email" value="${esc(b.contact)}" placeholder="you@agency.org"></div>`;
    bindBrief();
    return;
  }

  const slot = state.slots.find((s) => s.id === state.selected);
  if (!slot || !slot.widget) {
    $('#panel-title').textContent = 'Selected panel';
    body.innerHTML = `<div class="panel-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M9 21V9"/></svg>
      <p>Select a panel on the canvas to describe what it needs to show, or drop in a new one from the palette.</p></div>`;
    return;
  }

  const w = WIDGET_BY_ID[slot.widget.type];
  const d = slot.widget;
  $('#panel-title').textContent = w.name;
  body.innerHTML = `
    <p class="panel-note">${esc(w.name)} — ${esc(w.hint)}. Previews are illustrative examples, not live data.</p>
    <div class="form-row"><label class="field-label" for="p-title">Panel title</label>
      <input class="text-input" id="p-title" value="${esc(d.title)}"></div>
    ${w.isNote
      ? `<div class="form-row"><label class="field-label" for="p-text">Your note</label>
         <p class="field-hint">Anything the panels above can't express.</p>
         <textarea class="textarea-input" id="p-text" style="min-height:160px">${esc(d.text)}</textarea></div>`
      : `<div class="form-row"><label class="field-label" for="p-need">What must this panel show you?</label>
         <p class="field-hint">The specific thing you'd look for here, in your own words.</p>
         <textarea class="textarea-input" id="p-need">${esc(d.need)}</textarea></div>
      <div class="form-row"><label class="field-label" for="p-data">Which data or layer would it take?</label>
        <p class="field-hint">Name sources if you know them — gauges, LST imagery, 311, parcels, AVL feeds…</p>
        <textarea class="textarea-input" id="p-data" style="min-height:70px">${esc(d.data)}</textarea></div>
      ${sel('p-geo', d.geo, GEOGRAPHY, 'At what geography?')}
      ${sel('p-freq', d.freq, LATENCY, 'How fresh must it be?')}
      ${seg('p-avail', d.avail, AVAILABILITY, 'Does this data exist today?', 'Your honest read — "not sure" is a real answer.')}
      ${seg('p-priority', d.priority, PRIORITY, 'How badly do you need it?')}`}

    <p class="panel-section-title">Panel size</p>
    ${state.layoutMode === 'free'
      ? `<p class="field-hint" style="margin-bottom:var(--space-2)">Drag the title bar to move this window and the bottom-right corner to resize it. These presets are a shortcut.</p>
         ${seg('p-fw', '', [{ id: '380', label: 'Narrow' }, { id: '560', label: 'Half' }, { id: '760', label: 'Wide' }, { id: '1148', label: 'Full' }], 'Width')}
         ${seg('p-fh', '', [{ id: '220', label: 'Short' }, { id: '340', label: 'Tall' }, { id: '520', label: 'Extra tall' }], 'Height')}`
      : `${seg('p-w', String(slot.w), [{ id: '2', label: 'Narrow' }, { id: '3', label: 'Half' }, { id: '4', label: 'Wide' }, { id: '6', label: 'Full' }], 'Width')}
         ${seg('p-h', String(slot.h), [{ id: '1', label: 'Short' }, { id: '2', label: 'Tall' }, { id: '3', label: 'Extra tall' }], 'Height')}`}
    <div class="form-row"><button class="btn btn-sm" id="p-remove" type="button">Remove this panel</button></div>`;
  bindPanel(slot);
}

function bindBrief() {
  const map = { 'b-decision': 'decision', 'b-action': 'action', 'b-who': 'who', 'b-frequency': 'frequency', 'b-missing': 'missing', 'b-barrier': 'barrier', 'b-contact': 'contact' };
  Object.entries(map).forEach(([id, key]) => {
    const el = $('#' + id);
    if (el) el.addEventListener('input', () => { state.brief[key] = el.value; });
  });
}

function bindPanel(slot) {
  const d = slot.widget;
  const domSlot = () => document.querySelector(`[data-widget="${slot.id}"]`);

  const t = $('#p-title');
  if (t) t.addEventListener('input', () => {
    d.title = t.value;
    const h = domSlot() && domSlot().querySelector('.widget-head h4');
    if (h) h.textContent = t.value || WIDGET_BY_ID[d.type].name;
    $('#panel-title').textContent = t.value || WIDGET_BY_ID[d.type].name;
  });

  const need = $('#p-need');
  if (need) need.addEventListener('input', () => {
    d.need = need.value;
    syncNoteBox(slot.id, need.value);
  });

  const txt = $('#p-text');
  if (txt) txt.addEventListener('input', () => {
    d.text = txt.value;
    const b = document.querySelector(`[data-widget="${slot.id}"] .widget-body`);
    if (b) b.textContent = txt.value || 'Type your note in the box below\u2026';
    syncNoteBox(slot.id, txt.value);
  });

  const dataEl = $('#p-data');
  if (dataEl) dataEl.addEventListener('input', () => { d.data = dataEl.value; });
  ['geo', 'freq'].forEach((k) => {
    const el = $('#p-' + k);
    if (el) el.addEventListener('change', () => { d[k] = el.value; });
  });

  bindSeg('#p-avail', (v) => { d.avail = v; });
  bindSeg('#p-priority', (v) => { d.priority = v; });
  bindSeg('#p-w', (v) => { slot.w = +v; renderCanvas(); });
  bindSeg('#p-h', (v) => { slot.h = +v; renderCanvas(); });
  bindSeg('#p-fw', (v) => { slot.fw = +v; clampFree(slot); renderCanvas(); });
  bindSeg('#p-fh', (v) => { slot.fh = +v; clampFree(slot); renderCanvas(); });

  const rm = $('#p-remove');
  if (rm) rm.addEventListener('click', () => removeWidget(slot.id));
}

/* keep the inline note box and the properties panel in step */

function syncNoteBox(slotId, value) {
  const box = document.querySelector(`[data-note="${slotId}"]`);
  if (!box) return;
  box.classList.toggle('is-empty', !value.trim());
  const ta = box.querySelector('textarea');
  if (ta && ta.value !== value && document.activeElement !== ta) ta.value = value;
}

function onNoteInput(slotId, value) {
  const slot = state.slots.find((s) => s.id === slotId);
  if (!slot || !slot.widget) return;
  const w = WIDGET_BY_ID[slot.widget.type];
  if (w.isNote) {
    slot.widget.text = value;
    const b = document.querySelector(`[data-widget="${slotId}"] .widget-body`);
    if (b) b.textContent = value || 'Type your note in the box below\u2026';
  } else {
    slot.widget.need = value;
  }
  const box = document.querySelector(`[data-note="${slotId}"]`);
  if (box) box.classList.toggle('is-empty', !value.trim());
  if (state.selected === slotId && state.tab === 'panel') {
    const mirror = $(w.isNote ? '#p-text' : '#p-need');
    if (mirror && mirror.value !== value) mirror.value = value;
  }
}

function bindSeg(sel_, cb) {
  const el = $(sel_);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-val]');
    if (!b) return;
    $$('button', el).forEach((x) => x.classList.toggle('is-active', x === b));
    cb(b.dataset.val);
  });
}

/* ---------------- canvas mutation ---------------- */

function placeWidget(typeId, slotId, pos) {
  const w = WIDGET_BY_ID[typeId];

  if (state.layoutMode === 'free') {
    const size = defaultFreeSize(w);
    const target = slotId ? state.slots.find((s) => s.id === slotId) : null;
    let slot;
    if (target && target.widget) {
      target.widget = makeWidget(typeId);
      slot = target;
    } else {
      let at = pos ? { x: snapTo(pos.x - size.fw / 2), y: snapTo(pos.y - 20) } : findFreeSpot(size.fw, size.fh);
      slot = { id: nextId(), x: at.x, y: at.y, fw: size.fw, fh: size.fh, w: w.w, h: w.h, z: ++zTop, widget: makeWidget(typeId) };
      clampFree(slot);
      state.slots.push(slot);
    }
    state.selected = slot.id;
    state.pendingSlot = null;
    state.tab = 'panel';
    renderCanvas();
    renderPanel();
    closeSheets();
    focusNote(slot.id);
    toast(isNarrow()
      ? `${w.name} added \u2014 write what it must show in the box underneath`
      : `${w.name} added \u2014 drag it where you want it, then say what it must show`);
    return;
  }

  let slot = slotId ? state.slots.find((s) => s.id === slotId) : null;
  if (!slot) slot = state.slots.find((s) => !s.widget);
  if (!slot) {
    slot = { id: nextId(), w: w.w, h: w.h, hint: 'anything', widget: null };
    state.slots.push(slot);
  }
  const wasEmpty = !slot.widget;
  slot.widget = makeWidget(typeId);
  if (wasEmpty) { slot.w = w.w; slot.h = w.h; }
  state.selected = slot.id;
  state.pendingSlot = null;
  state.tab = 'panel';
  renderCanvas();
  renderPanel();
  const el = $(`[data-slot="${slot.id}"]`);
  if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  closeSheets();
  focusNote(slot.id);
  toast(`${w.name} added \u2014 now say what it must show`);
}

function focusNote(slotId) {
  if (isNarrow()) return;
  requestAnimationFrame(() => {
    const t = document.querySelector(`[data-note-input="${slotId}"]`);
    if (t) { t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest' }); }
  });
}

function removeWidget(slotId) {
  const i = state.slots.findIndex((s) => s.id === slotId);
  if (i < 0) return;
  if (state.layoutMode === 'free') {
    state.slots.splice(i, 1);
    state.selected = null;
    renderCanvas();
    renderPanel();
    return;
  }
  state.slots[i].widget = null;
  if (state.slots.length > 1 && state.slots.filter((s) => !s.widget).length > 3) state.slots.splice(i, 1);
  state.selected = null;
  renderCanvas();
  renderPanel();
}

function moveSlot(slotId, dir) {
  const i = state.slots.findIndex((s) => s.id === slotId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= state.slots.length) return;
  [state.slots[i], state.slots[j]] = [state.slots[j], state.slots[i]];
  renderCanvas();
}

function swapWidgets(aId, bId) {
  const a = state.slots.find((s) => s.id === aId);
  const b = state.slots.find((s) => s.id === bId);
  if (!a || !b || a === b) return;
  [a.widget, b.widget] = [b.widget, a.widget];
  state.selected = bId;
  renderCanvas();
  renderPanel();
}

/* ---------------- review ---------------- */

function renderReview() {
  const p = PURPOSES.find((x) => x.id === state.purpose);
  const h = HAZARDS.find((x) => x.id === state.hazard);
  const t = TEMPLATES.find((x) => x.id === state.template);
  const filled = orderedSlots();
  const missingNotes = filled.filter((s) => {
    const w = WIDGET_BY_ID[s.widget.type];
    return w.isNote ? !s.widget.text.trim() : !s.widget.need.trim();
  });
  const b = state.brief;

  $('#review-body').innerHTML = `
    ${!b.decision.trim() || missingNotes.length
      ? `<div class="warn-box">Before you submit: ${[
          !b.decision.trim() ? 'the decision brief has no decision written yet' : '',
          missingNotes.length ? `${missingNotes.length} panel${missingNotes.length > 1 ? 's have' : ' has'} no written need` : '',
        ].filter(Boolean).join(' · ')}. The written parts are what we analyze.</div>`
      : ''}

    <div class="review-grid">
      <div class="summary-card"><h4>Tool</h4><p>${esc(state.appTitle)}</p></div>
      <div class="summary-card"><h4>Purpose</h4><p>${esc(p ? p.sub : '—')}</p></div>
      <div class="summary-card"><h4>Hazard</h4><p>${esc(h ? h.name : '—')}</p></div>
      <div class="summary-card"><h4>Layout</h4><p>${esc(t ? t.name : '—')}${state.layoutMode === 'free' ? ' · free placement' : ''}</p></div>
      <div class="summary-card"><h4>Role</h4><p>${esc(state.role || 'Not given')}${state.org ? ' · ' + esc(state.org) : ''}</p></div>
      <div class="summary-card"><h4>Board number</h4><p>${esc(state.code)}</p></div>
    </div>

    <h3 style="font-size:var(--text-lg);margin:var(--space-8) 0 var(--space-3)">Your ${filled.length} panel${filled.length === 1 ? '' : 's'}</h3>
    <ul class="review-list">${filled.map((s) => {
      const w = WIDGET_BY_ID[s.widget.type];
      const note = w.isNote ? s.widget.text : s.widget.need;
      const meta = [s.widget.geo, s.widget.freq, s.widget.avail ? 'data: ' + (AVAILABILITY.find((a) => a.id === s.widget.avail) || {}).label : '']
        .filter(Boolean).join(' · ');
      return `<li><span class="rl-thumb">${previewMarkup(w, 'review')}</span>
        <span style="min-width:0"><b>${esc(s.widget.title || w.name)}</b>
        <span>${note.trim() ? esc(note) : '⚠ no need written yet'}</span>
        ${meta ? `<span>${esc(meta)}</span>` : ''}</span></li>`;
    }).join('') || '<li><span>No panels yet — go back and add a few.</span></li>'}</ul>

    <h3 style="font-size:var(--text-lg);margin:var(--space-8) 0 var(--space-3)">Decision brief</h3>
    <div class="review-grid">
      <div>
        <div class="form-row"><label class="field-label" for="r-decision">What decision does this tool support?</label>
          <textarea class="textarea-input" id="r-decision">${esc(b.decision)}</textarea></div>
        <div class="form-row"><label class="field-label" for="r-action">What action follows from it?</label>
          <textarea class="textarea-input" id="r-action">${esc(b.action)}</textarea></div>
      </div>
      <div>
        <div class="form-row"><label class="field-label" for="r-missing">What data or capability is missing today?</label>
          <textarea class="textarea-input" id="r-missing">${esc(b.missing)}</textarea></div>
        <div class="form-row"><label class="field-label" for="r-barrier">What stops you from using a tool like this?</label>
          <textarea class="textarea-input" id="r-barrier">${esc(b.barrier)}</textarea></div>
      </div>
    </div>`;

  [['r-decision', 'decision'], ['r-action', 'action'], ['r-missing', 'missing'], ['r-barrier', 'barrier']].forEach(([id, key]) => {
    const el = $('#' + id);
    if (el) el.addEventListener('input', () => { state.brief[key] = el.value; });
  });
}

/* ---------------- payload, export, submit ---------------- */

function orderedSlots() {
  const filled = state.slots.filter((s) => s.widget);
  if (state.layoutMode !== 'free') return filled;
  return filled.slice().sort((a, b) => ((a.y || 0) - (b.y || 0)) || ((a.x || 0) - (b.x || 0)));
}

function payload() {
  const p = PURPOSES.find((x) => x.id === state.purpose);
  const h = HAZARDS.find((x) => x.id === state.hazard);
  const t = TEMPLATES.find((x) => x.id === state.template);
  return {
    schema: 'adapt-stl-design-studio/v3',
    event: CFG.eventName || '',
    boardCode: state.code,
    startedAt: state.startedAt,
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    appTitle: state.appTitle,
    purpose: state.purpose, purposeLabel: p ? p.sub : '',
    hazard: state.hazard, hazardLabel: h ? h.name : '',
    template: state.template, templateLabel: t ? t.name : '',
    layoutMode: state.layoutMode,
    surfaceWidthPx: state.layoutMode === 'free' ? surfW() : '',
    role: state.role, organization: state.org,
    brief: state.brief,
    panels: orderedSlots().map((s, i) => {
      const w = WIDGET_BY_ID[s.widget.type];
      return {
        order: i + 1, type: s.widget.type, typeName: w.name, category: w.group,
        hazardTag: w.hazard || '', title: s.widget.title,
        need: w.isNote ? s.widget.text : s.widget.need,
        dataNeeded: s.widget.data, geography: s.widget.geo, freshness: s.widget.freq,
        dataAvailability: s.widget.avail, priority: s.widget.priority,
        widthCols: s.w, heightRows: s.h,
        x: state.layoutMode === 'free' ? s.x : '', y: state.layoutMode === 'free' ? s.y : '',
        widthPx: state.layoutMode === 'free' ? s.fw : '', heightPx: state.layoutMode === 'free' ? s.fh : '',
      };
    }),
  };
}

function toCSV(d) {
  const head = ['board_code', 'event', 'submitted_at', 'app_title', 'purpose', 'hazard', 'template', 'role', 'organization',
    'decision', 'action', 'audience', 'open_frequency', 'missing_data', 'barrier', 'contact',
    'panel_order', 'panel_type', 'panel_type_name', 'panel_category', 'panel_hazard_tag', 'panel_title',
    'need_text', 'data_needed', 'geography', 'freshness', 'data_availability', 'priority',
    'layout_mode', 'width_cols', 'height_rows', 'pos_x', 'pos_y', 'width_px', 'height_px'];
  const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const base = [d.boardCode, d.event, d.submittedAt, d.appTitle, d.purposeLabel, d.hazardLabel, d.templateLabel, d.role, d.organization,
    d.brief.decision, d.brief.action, d.brief.who, d.brief.frequency, d.brief.missing, d.brief.barrier, d.brief.contact];
  const rows = d.panels.length ? d.panels.map((p) => base.concat([p.order, p.type, p.typeName, p.category, p.hazardTag, p.title,
    p.need, p.dataNeeded, p.geography, p.freshness, p.dataAvailability, p.priority,
    d.layoutMode, p.widthCols, p.heightRows, p.x, p.y, p.widthPx, p.heightPx])) : [base];
  return [head.map(q).join(','), ...rows.map((r) => r.map(q).join(','))].join('\r\n');
}

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function downloadBoard() {
  const d = payload();
  download(`adapt-stl-${d.boardCode}.json`, JSON.stringify(d, null, 2), 'application/json');
  setTimeout(() => download(`adapt-stl-${d.boardCode}.csv`, toCSV(d), 'text/csv'), 350);
  toast('Saved to your device — hand the files to a facilitator');
}

async function submitBoard() {
  const btn = $('#btn-submit');
  const d = payload();
  if (!CFG.collectUrl) { downloadBoard(); state.submitted = true; goto('done'); return; }
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  try {
    await fetch(CFG.collectUrl, {
      method: 'POST',
      mode: CFG.collectMode === 'no-cors' ? 'no-cors' : 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d),
    });
    state.submitted = true;
    if (CFG.alwaysDownload) downloadBoard();
    goto('done');
  } catch (err) {
    toast('Could not reach the server — saving a copy to your device instead');
    downloadBoard();
    state.submitted = true;
    goto('done');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit my design';
  }
}

/* ---------------- sheets (mobile) ---------------- */

function openSheet(which) {
  $('#' + which).classList.add('is-open');
  $('#backdrop').classList.add('is-open');
}
function closeSheets() {
  $('#rail').classList.remove('is-open');
  $('#panel').classList.remove('is-open');
  $('#backdrop').classList.remove('is-open');
}

/* ---------------- events ---------------- */

function init() {
  applyTheme();
  renderStepper();
  renderHeroStrip();
  renderPurpose();
  renderTemplates();

  $('#btn-theme').addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
  $('#backdrop').addEventListener('click', closeSheets);
  $('#btn-open-rail').addEventListener('click', () => openSheet('rail'));
  $('#btn-rail-2').addEventListener('click', () => openSheet('rail'));
  $('#btn-open-panel').addEventListener('click', () => openSheet('panel'));
  $('#btn-close-panel').addEventListener('click', closeSheets);
  $('#btn-close-rail').addEventListener('click', closeSheets);

  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => goto(b.dataset.goto)));

  $('#purpose-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-purpose]');
    if (!b) return;
    state.purpose = b.dataset.purpose;
    renderPurpose();
  });
  $('#hazard-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hazard]');
    if (!b) return;
    state.hazard = b.dataset.hazard;
    renderPurpose();
  });
  $('#in-role').addEventListener('change', (e) => { state.role = e.target.value; });
  $('#in-org').addEventListener('input', (e) => { state.org = e.target.value; });
  $('#btn-to-template').addEventListener('click', () => goto('template'));

  $('#template-grid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-template]');
    if (!b) return;
    state.template = b.dataset.template;
    renderTemplates();
  });
  $('#btn-to-build').addEventListener('click', () => { applyTemplate(); goto('build'); });

  $('#in-app-title').addEventListener('input', (e) => { state.appTitle = e.target.value; });
  $('#btn-add-slot').addEventListener('click', () => {
    state.slots.push({ id: nextId(), w: 3, h: 2, hint: 'anything', widget: null });
    renderCanvas();
    toast('Empty slot added at the bottom');
  });
  $('#btn-to-review').addEventListener('click', () => goto('review'));
  $('#btn-submit').addEventListener('click', submitBoard);
  $('#btn-download').addEventListener('click', downloadBoard);
  $('#btn-download-2').addEventListener('click', downloadBoard);
  $('#btn-restart').addEventListener('click', () => window.location.reload());

  $$('.panel-tab').forEach((t) => t.addEventListener('click', () => { state.tab = t.dataset.tab; renderPanel(); }));

  $('#layout-mode').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-val]');
    if (b) setLayoutMode(b.dataset.val);
  });

  const search = $('#in-palette-search');
  if (search) search.addEventListener('input', () => { state.search = search.value; renderPalette(); });

  /* inline note boxes under every panel — the whole point of the exercise */
  document.addEventListener('input', (e) => {
    const ta = e.target.closest('[data-note-input]');
    if (ta) onNoteInput(ta.dataset.noteInput, ta.value);
  });
  document.addEventListener('focusin', (e) => {
    const ta = e.target.closest('[data-note-input]');
    if (ta && state.selected !== ta.dataset.noteInput) selectSlot(ta.dataset.noteInput, false);
    if (ta) {
      const el = ta.closest('[data-widget]');
      if (el) {
        $$('.widget').forEach((x) => x.classList.toggle('is-selected', x === el));
      }
    }
  });

  /* free canvas: pointer move + resize */
  const surface = $('#free-surface');
  surface.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('[data-act]')) return;
    const rz = e.target.closest('[data-resize]');
    if (rz) { beginFreeGesture(e, rz.dataset.resize, 'resize'); return; }
    const dg = e.target.closest('[data-drag]');
    if (dg) beginFreeGesture(e, dg.dataset.drag, 'move');
  });
  surface.addEventListener('click', (e) => {
    const tool = e.target.closest('[data-act]');
    if (tool) {
      e.stopPropagation();
      const { act, id } = tool.dataset;
      if (act === 'del') removeWidget(id);
      if (act === 'front') {
        const sl = state.slots.find((x) => x.id === id);
        if (sl) { sl.z = ++zTop; renderCanvas(); }
      }
      return;
    }
    if (e.target.closest('[data-note]')) return;
    const wEl = e.target.closest('[data-widget]');
    if (wEl) {
      selectSlot(wEl.dataset.widget);
      if (isNarrow()) openSheet('panel');
    }
  });
  surface.addEventListener('dragover', (e) => {
    e.preventDefault();
    surface.classList.add('is-drop-target');
  });
  surface.addEventListener('dragleave', (e) => {
    if (e.target === surface) surface.classList.remove('is-drop-target');
  });
  surface.addEventListener('drop', (e) => {
    e.preventDefault();
    surface.classList.remove('is-drop-target');
    const data = e.dataTransfer.getData('text/plain') || '';
    const r = surface.getBoundingClientRect();
    const pos = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (data.startsWith('new:')) placeWidget(data.slice(4), null, pos);
    else if (data.startsWith('move:')) {
      const sl = state.slots.find((x) => x.id === data.slice(5));
      if (sl) { sl.x = snapTo(pos.x - (sl.fw || 300) / 2); sl.y = snapTo(pos.y - 20); clampFree(sl); renderCanvas(); }
    }
  });

  /* palette: click to place, drag to place */
  const palette = $('#palette');
  palette.addEventListener('click', (e) => {
    const b = e.target.closest('[data-new]');
    if (!b) return;
    placeWidget(b.dataset.new, state.pendingSlot);
  });
  palette.addEventListener('dragstart', (e) => {
    const b = e.target.closest('[data-new]');
    if (!b) return;
    e.dataTransfer.setData('text/plain', 'new:' + b.dataset.new);
    e.dataTransfer.effectAllowed = 'copy';
  });

  /* canvas interactions */
  const canvas = $('#canvas');
  canvas.addEventListener('click', (e) => {
    const tool = e.target.closest('[data-act]');
    if (tool) {
      e.stopPropagation();
      const { act, id } = tool.dataset;
      if (act === 'del') removeWidget(id);
      if (act === 'up') moveSlot(id, -1);
      if (act === 'down') moveSlot(id, 1);
      return;
    }
    const empty = e.target.closest('[data-empty]');
    if (empty) {
      state.pendingSlot = empty.dataset.empty;
      state.selected = null;
      state.tab = 'panel';
      renderPanel();
      if (window.matchMedia('(max-width: 880px)').matches) openSheet('rail');
      else toast('Now pick a panel from the palette on the left');
      return;
    }
    if (e.target.closest('[data-note]')) return;
    const wEl = e.target.closest('[data-widget]');
    if (wEl) {
      selectSlot(wEl.dataset.widget);
      if (isNarrow()) openSheet('panel');
    }
  });

  canvas.addEventListener('dragstart', (e) => {
    const wEl = e.target.closest('[data-widget]');
    if (!wEl) return;
    e.dataTransfer.setData('text/plain', 'move:' + wEl.dataset.widget);
    e.dataTransfer.effectAllowed = 'move';
  });
  canvas.addEventListener('dragover', (e) => {
    const slot = e.target.closest('[data-slot]');
    if (!slot) return;
    e.preventDefault();
    $$('.slot.is-drop-target', canvas).forEach((s) => s.classList.remove('is-drop-target'));
    slot.classList.add('is-drop-target');
  });
  canvas.addEventListener('dragleave', (e) => {
    const slot = e.target.closest('[data-slot]');
    if (slot) slot.classList.remove('is-drop-target');
  });
  canvas.addEventListener('drop', (e) => {
    const slot = e.target.closest('[data-slot]');
    if (!slot) return;
    e.preventDefault();
    slot.classList.remove('is-drop-target');
    const data = e.dataTransfer.getData('text/plain') || '';
    if (data.startsWith('new:')) placeWidget(data.slice(4), slot.dataset.slot);
    else if (data.startsWith('move:')) swapWidgets(data.slice(5), slot.dataset.slot);
  });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(reflowFree, 160); });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheets();
  });
  window.addEventListener('beforeunload', (e) => {
    if (state.screen === 'build' || (state.screen === 'review' && !state.submitted)) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
