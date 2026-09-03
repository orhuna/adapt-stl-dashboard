/* ADAPT-STL Design Studio — widget catalog, previews, and intake options */

/* ---------- responsive HTML/CSS preview mocks ---------- */

const LINE = (d, color, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" vector-effect="non-scaling-stroke" ${extra}/>`;
const PLOT = (inner) => `<div class="mk-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${inner}</svg>`;

const MAPBASE = `<div class="mk-map"></div>
  <div class="mk-roads">
    <i style="left:0;right:0;top:38%;height:3px"></i>
    <i style="left:0;right:0;top:72%;height:2px"></i>
    <i style="left:34%;top:0;bottom:0;width:3px"></i>
    <i style="left:68%;top:0;bottom:0;width:2px"></i></div>
  <div class="mk-blocks">
    <i style="left:6%;top:8%;width:13%;height:16%"></i><i style="left:26%;top:6%;width:16%;height:12%"></i>
    <i style="left:6%;top:44%;width:12%;height:20%"></i><i style="left:52%;top:52%;width:15%;height:16%"></i>
    <i style="left:74%;top:18%;width:14%;height:14%"></i><i style="left:30%;top:74%;width:18%;height:14%"></i>
    <i style="left:78%;top:66%;width:12%;height:18%"></i></div>`;

const PIN = (l, t, color = 'var(--color-primary)') =>
  `<svg class="mk-pin" style="left:${l};top:${t};color:${color}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
     <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"/>
     <circle cx="12" cy="9" r="2.6" fill="#fff"/></svg>`;

const WARN = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
  <path d="M12 3l10 18H2L12 3z"/><path d="M11.1 9h1.8l-.25 6h-1.3L11.1 9zm.9 8.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#fff"/></svg>`;

const PREVIEWS = {
  basemap: () => `<div class="mk">${MAPBASE}
    ${PIN('52%', '58%')}
    <span class="mk-dot" style="left:30%;top:30%;width:8px;height:8px;background:var(--color-heat)"></span>
    <span class="mk-dot" style="left:70%;top:48%;width:8px;height:8px;background:var(--color-heat)"></span>
    <span class="mk-dot" style="left:62%;top:78%;width:8px;height:8px;background:var(--color-heat)"></span>
    <span class="mk-chip-abs" style="left:10px;top:10px">City assets</span></div>`,

  nearme: () => `<div class="mk">${MAPBASE}
    <span class="mk-ring" style="left:50%;top:50%;width:150px;height:150px"></span>
    <span class="mk-ring" style="left:50%;top:50%;width:98px;height:98px"></span>
    <span class="mk-ring" style="left:50%;top:50%;width:52px;height:52px"></span>
    <span class="mk-dot" style="left:50%;top:50%;width:12px;height:12px;background:var(--color-primary);box-shadow:0 0 0 3px var(--color-surface)"></span>
    <span class="mk-dot" style="left:28%;top:26%;width:7px;height:7px;background:var(--color-heat)"></span>
    <span class="mk-dot" style="left:74%;top:62%;width:7px;height:7px;background:var(--color-heat)"></span>
    <span class="mk-chip-abs" style="left:10px;bottom:10px">5 / 10 / 15 min walk</span></div>`,

  swipe: () => `<div class="mk">${MAPBASE}
    <span style="position:absolute;inset:0 50% 0 0;background:var(--color-flood);opacity:.34"></span>
    <span class="mk-dot" style="left:70%;top:32%;width:52px;height:52px;background:var(--color-heat);opacity:.42;filter:blur(3px)"></span>
    <span class="mk-dot" style="left:86%;top:66%;width:38px;height:38px;background:var(--color-heat);opacity:.42;filter:blur(3px)"></span>
    <span class="mk-swipe-handle"></span>
    <span class="mk-chip-abs" style="left:10px;top:10px">Today</span>
    <span class="mk-chip-abs" style="right:10px;top:10px">2050</span></div>`,

  facilities: () => `<div class="mk">${MAPBASE}
    ${PIN('26%', '32%')}${PIN('58%', '62%')}${PIN('80%', '26%', 'var(--color-text-faint)')}
    <div class="mk-overlay-card">
      <div style="font-size:11px;font-weight:700;margin-bottom:5px">Nearest open site · 1.2 mi</div>
      <div class="mk-txt" style="width:76%"></div>
      <div class="mk-txt" style="width:54%;margin-top:5px"></div></div></div>`,

  draw: () => `<div class="mk">${MAPBASE}
    <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="22,24 66,18 82,58 46,84 26,62" fill="var(--color-primary)" fill-opacity=".16"
        stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/></svg>
    ${['22%,24%', '66%,18%', '82%,58%', '46%,84%', '26%,62%'].map((c) => {
      const [x, y] = c.split(',');
      return `<span class="mk-dot" style="left:${x};top:${y};width:9px;height:9px;border-radius:2px;background:var(--color-surface);border:2px solid var(--color-primary)"></span>`;
    }).join('')}
    <span class="mk-chip-abs" style="right:10px;bottom:10px;background:var(--color-surface);color:var(--color-primary);border:1px solid var(--color-border)">2.4 sq mi selected</span></div>`,

  kpi: () => `<div class="mk mk-kpi">
    <div class="mk-lbl">Heat index · now</div>
    <div class="mk-kpi-v">104°F</div>
    <div class="mk-kpi-d">▲ 6° above action threshold</div>
    <div class="mk-kpi-track"><span class="mk-kpi-fill"></span><span class="mk-kpi-mark"></span></div></div>`,

  gauge: () => `<div class="mk mk-gauge">
    <svg viewBox="0 0 120 78" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path d="M12 60a48 48 0 0 1 96 0" fill="none" stroke="var(--color-surface-3)" stroke-width="12" stroke-linecap="round"/>
      <path d="M12 60a48 48 0 0 1 74 -37" fill="none" stroke="var(--color-heat)" stroke-width="12" stroke-linecap="round"/>
      <line x1="60" y1="60" x2="86" y2="34" stroke="var(--color-text)" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="60" cy="60" r="5" fill="var(--color-text)"/>
      <text x="60" y="76" text-anchor="middle" font-size="15" font-weight="800"
        fill="var(--color-text)" letter-spacing="-.4">3.7 / 5</text>
      <text x="12" y="74" font-size="8" font-weight="700" fill="var(--color-text-faint)">LOW</text>
      <text x="108" y="74" font-size="8" font-weight="700" text-anchor="end" fill="var(--color-text-faint)">HIGH</text>
    </svg>
    <div class="mk-lbl mk-gauge-cap">Vulnerability index</div></div>`,

  timeseries: () => `<div class="mk mk-chart">
    <div class="mk-row"><span class="mk-lbl">Observed vs. normal</span></div>
    ${PLOT(`${LINE('M2 78 L16 66 L30 70 L44 42 L58 50 L72 26 L86 34 L98 14', 'var(--color-primary)')}
      ${LINE('M2 86 L16 80 L30 82 L44 66 L58 70 L72 56 L86 60 L98 48', 'var(--color-text-faint)', 'stroke-dasharray="5 4" stroke-width="1.6"')}`)}
      <span class="mk-grid-l" style="top:0"></span><span class="mk-grid-l" style="top:50%"></span><span class="mk-grid-l" style="bottom:0"></span>
    </div>
    <div class="mk-axis"><span>Jun 1</span><span>Jul</span><span>Aug</span><span>Sep 30</span></div></div>`,

  heatdays: () => `<div class="mk mk-chart">
    <div class="mk-row"><span class="mk-lbl">7-day heat index forecast</span></div>
    <div class="mk-plot">
      <div class="mk-bars">
        <i style="height:38%"></i><i style="height:50%"></i><i style="height:64%;background:var(--color-warning)"></i>
        <i style="height:84%;background:var(--color-heat)"></i><i style="height:94%;background:var(--color-heat)"></i>
        <i style="height:72%;background:var(--color-warning)"></i><i style="height:46%"></i></div>
      <span class="mk-thresh" style="top:26%"><b>threshold 103°F</b></span>
    </div>
    <div class="mk-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>`,

  hydrograph: () => `<div class="mk mk-chart">
    <div class="mk-row"><span class="mk-lbl">River stage · gauge 07010000</span></div>
    ${PLOT(`${LINE('M2 82 L18 78 L32 70 L46 48 L58 24 L70 30 L84 52 L98 70', 'var(--color-flood)')}`)}
      <span class="mk-band" style="top:0;height:26%;background:color-mix(in srgb, var(--color-heat) 14%, transparent)"><b style="color:var(--color-heat)">MAJOR</b></span>
      <span class="mk-band" style="top:26%;height:24%;background:color-mix(in srgb, var(--color-warning) 16%, transparent)"><b style="color:var(--color-warning)">MODERATE</b></span>
      <span class="mk-band" style="top:50%;height:24%;background:color-mix(in srgb, var(--color-flood) 14%, transparent)"><b style="color:var(--color-flood)">MINOR</b></span>
      <span style="position:absolute;left:58%;top:0;bottom:0;width:1px;border-left:1px dashed var(--color-text-muted)"></span>
    </div>
    <div class="mk-axis"><span>−24h</span><span>now</span><span>+24h</span><span>+48h</span></div></div>`,

  exceedance: () => `<div class="mk mk-chart">
    <div class="mk-row"><span class="mk-lbl">Exceedance probability</span></div>
    ${PLOT(`${LINE('M2 84 C26 80 48 62 68 40 S92 18 98 12', 'var(--color-flood)')}
      ${LINE('M2 90 C28 86 52 72 72 52 S94 32 98 26', 'var(--color-text-faint)', 'stroke-dasharray="5 4" stroke-width="1.6"')}`)}
      <span class="mk-thresh" style="top:66%;border-color:var(--color-flood)"><b style="color:var(--color-flood)">2-yr</b></span>
      <span class="mk-thresh" style="top:40%;border-color:var(--color-warning)"><b style="color:var(--color-warning)">10-yr</b></span>
      <span class="mk-thresh" style="top:14%"><b>100-yr</b></span>
    </div>
    <div class="mk-axis"><span>50%</span><span>10%</span><span>2%</span><span>1%</span></div></div>`,

  table: () => `<div class="mk mk-table">
    <div class="mk-thead"><span class="n">NEIGHBORHOOD</span><span class="r">RISK SCORE</span><span class="v">POP</span></div>
    ${[[62, 92, 'var(--color-heat)'], [54, 78, 'var(--color-heat)'], [70, 62, 'var(--color-warning)'], [50, 44, 'var(--color-warning)'], [58, 28, 'var(--color-text-faint)']]
      .map(([n, r, c]) => `<div class="mk-trow">
        <span class="n"><span class="mk-txt" style="width:${n}%"></span></span>
        <span class="r"><span class="mk-bar" style="display:block;width:${r}%;background:${c}"></span></span>
        <span class="v"><span class="mk-txt" style="width:100%"></span></span></div>`).join('')}</div>`,

  sensor: () => `<div class="mk">
    <div class="mk-feed">
      <span class="sun"></span>
      <i style="left:8%;width:14%;height:38%"></i><i style="left:26%;width:11%;height:52%"></i>
      <i style="left:44%;width:16%;height:32%"></i><i style="left:66%;width:12%;height:46%"></i>
      <span style="position:absolute;left:0;right:0;bottom:0;height:26%;background:rgba(255,255,255,.07)"></span>
      <span class="mk-live">LIVE</span></div>
    <div class="mk-pad" style="flex:0 0 auto;padding:9px 12px">
      <div style="font-size:12px;font-weight:700">Surface temp 118°F</div>
      <div style="font-size:10px;color:var(--color-text-muted)">Sensor STL-07 · updated 4 min ago</div></div></div>`,

  alert: () => `<div class="mk mk-alert">
    <span class="mk-alert-ico">${WARN}</span>
    <span style="min-width:0">
      <b class="mk-alert-t mk-nowrap">Excessive heat warning</b>
      <b class="mk-alert-s mk-nowrap">In effect until 8 PM · trigger: HI ≥ 103°F for 2 days</b></span>
    <span class="mk-alert-b">View actions</span></div>`,

  timeline: () => `<div class="mk mk-tl">
    <div class="mk-tl-track">
      <span class="mk-tl-step"><u>NOW</u><i style="background:var(--color-primary)"></i><s>monitor</s></span>
      <span class="mk-tl-step"><u>+12h</u><i style="background:var(--color-warning)"></i><s>pre-position</s></span>
      <span class="mk-tl-step"><u>PEAK</u><i style="background:var(--color-heat);width:16px;height:16px"></i><s>open centers</s></span>
      <span class="mk-tl-step"><u>+48h</u><i></i><s>stand down</s></span></div></div>`,

  search: () => `<div class="mk mk-pad">
    <div class="mk-searchbar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>
      <span class="mk-sq">Enter your address…</span>
      <span class="mk-locate"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.4"/><path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22"/></svg></span></div>
    <div class="mk-res">
      <span class="mk-txt" style="width:72%"></span><span class="mk-txt" style="width:54%"></span>
      <span class="mk-txt" style="width:64%"></span><span class="mk-txt" style="width:44%"></span></div></div>`,

  filter: () => `<div class="mk mk-pad">
    <div class="mk-lbl">Filters</div>
    <div class="mk-slider" style="margin-top:12px"><i style="width:62%"></i><b style="left:62%"></b></div>
    <div class="mk-slider"><i style="width:34%"></i><b style="left:34%"></b></div>
    <div class="mk-legend-row"><span class="mk-check on"></span><span class="mk-txt" style="width:46%"></span></div>
    <div class="mk-legend-row"><span class="mk-check"></span><span class="mk-txt" style="width:58%"></span></div></div>`,

  legend: () => `<div class="mk mk-pad">
    <div class="mk-lbl">Layers &amp; legend</div>
    ${[['var(--color-flood)', 74, 1], ['var(--color-heat)', 58, 1], ['var(--color-warning)', 66, 0], ['var(--color-success)', 48, 0]]
      .map(([c, w, on]) => `<div class="mk-legend-row"><span class="mk-sw" style="background:${c}"></span>
        <span class="mk-txt" style="width:${w}%"></span><span class="mk-toggle ${on ? 'on' : ''}"></span></div>`).join('')}</div>`,

  report: () => `<div class="mk mk-pad" style="gap:8px">
    <div style="font-size:12px;font-weight:700">Report flooding on your street</div>
    <div class="mk-input">Where is it? (tap the map)</div>
    <div class="mk-row" style="flex:1 1 auto;min-height:44px;align-items:stretch">
      <div class="mk-drop" style="flex:0 0 44%">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="12" cy="13.5" r="3.4"/><path d="M8.5 7 10 4.5h4L15.5 7"/></svg></div>
      <div class="mk-input" style="flex:1 1 auto">How deep? What is blocked?</div></div>
    <div class="mk-btn" style="width:46%">Submit report</div></div>`,

  assistant: () => `<div class="mk mk-pad" style="gap:8px">
    <div class="mk-bub them">Which blocks in Baden are above 100°F today?</div>
    <div class="mk-bub you">14 block groups exceed 100°F. 3 have no cooling site within a 10-minute walk.</div>
    <div class="mk-row" style="margin-top:auto">
      <div class="mk-input" style="flex:1 1 auto;border-radius:999px">Ask about your block…</div>
      <span class="mk-locate"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h13M13 7l5 5-5 5"/></svg></span></div></div>`,

  share: () => `<div class="mk mk-pad" style="gap:10px">
    <div style="font-size:12px;font-weight:700">Share this view</div>
    <div class="mk-share-btns"><i>Print</i><i>PDF</i><i>Link</i></div>
    <div class="mk-input mk-nowrap">adapt-stl.org/app/heat-watch?id=…</div>
    <div class="mk-btn" style="width:44%">Copy link</div></div>`,

  header: () => `<div class="mk">
    <div class="mk-hdr-top">
      <span class="mk-hdr-logo"></span>
      <span style="min-width:0"><span class="mk-hdr-t mk-nowrap" style="display:block">Heat Watch St. Louis</span>
      <span class="mk-hdr-s mk-nowrap" style="display:block">City of St. Louis · ADAPT-STL</span></span></div>
    <div class="mk-pad" style="display:grid;gap:7px;align-content:start">
      <span class="mk-txt" style="width:88%"></span><span class="mk-txt" style="width:96%"></span>
      <span class="mk-txt" style="width:62%"></span></div></div>`,

  note: () => null,
};

/* Widget catalog. img = preset reference photo, preview = synthetic SVG mock. */
const WIDGETS = [
  // --- Maps & scenes ---
  { id: 'heat-map', group: 'Maps & scenes', name: 'Heat exposure hotspot map', hint: 'Where it is hottest', hazard: 'heat', img: 'assets/heat-map.jpg', caption: 'Example: urban heat hotspot surface, St. Louis', w: 4, h: 2 },
  { id: 'flood-map', group: 'Maps & scenes', name: 'Flood extent & depth map', hint: 'Inundation depth zones', hazard: 'flood', img: 'assets/flood-map.jpg', caption: 'Example: modeled flood depth zones', w: 4, h: 2 },
  { id: 'route-map', group: 'Maps & scenes', name: 'Route / evacuation network map', hint: 'Best path, closures, access', img: 'assets/route-map.jpg', caption: 'Example: routing & network map', w: 3, h: 2 },
  { id: 'hazard-map', group: 'Maps & scenes', name: 'Susceptibility / classification map', hint: 'Modeled risk classes', img: 'assets/hazard-map.jpg', caption: 'Example: hazard susceptibility classification', w: 3, h: 2 },
  { id: 'basemap', group: 'Maps & scenes', name: 'Locator / asset map', hint: 'Basemap with points of interest', preview: 'basemap', w: 3, h: 2 },
  { id: 'nearme', group: 'Maps & scenes', name: 'Near-me / walk-time map', hint: 'Buffers & travel-time rings', preview: 'nearme', w: 3, h: 2 },
  { id: 'swipe', group: 'Maps & scenes', name: 'Before / after swipe compare', hint: 'Two scenarios side by side', preview: 'swipe', w: 3, h: 2 },
  { id: 'facilities', group: 'Maps & scenes', name: 'Cooling center / shelter finder', hint: 'Open sites + status list', hazard: 'heat', preview: 'facilities', w: 3, h: 2 },

  // --- Charts & indicators ---
  { id: 'kpi', group: 'Charts & indicators', name: 'KPI / threshold card', hint: 'One number that matters', preview: 'kpi', w: 2, h: 1 },
  { id: 'gauge', group: 'Charts & indicators', name: 'Risk index gauge', hint: 'Composite score dial', preview: 'gauge', w: 2, h: 1 },
  { id: 'timeseries', group: 'Charts & indicators', name: 'Time series / trend chart', hint: 'Observed vs. normal', preview: 'timeseries', w: 3, h: 1 },
  { id: 'heatdays', group: 'Charts & indicators', name: 'Heat index forecast bars', hint: '7-day forecast vs. threshold', hazard: 'heat', preview: 'heatdays', w: 3, h: 1 },
  { id: 'hydrograph', group: 'Charts & indicators', name: 'River gauge / stage hydrograph', hint: 'Stage vs. flood stages', hazard: 'flood', preview: 'hydrograph', w: 3, h: 1 },
  { id: 'exceedance', group: 'Charts & indicators', name: 'Flood exceedance / return period', hint: '2-, 10-, 100-year context', hazard: 'flood', preview: 'exceedance', w: 3, h: 1 },
  { id: 'pie-chart', group: 'Charts & indicators', name: 'Breakdown / share chart', hint: 'Who or what is affected', img: 'assets/pie-chart.jpg', caption: 'Example: composition breakdown', w: 2, h: 1 },
  { id: 'calendar-grid', group: 'Charts & indicators', name: 'Seasonal / climate normals grid', hint: 'Month-by-month severity', img: 'assets/calendar-grid.jpg', caption: 'Example: monthly climate normals matrix', w: 4, h: 1 },
  { id: 'table', group: 'Charts & indicators', name: 'Ranked table / priority list', hint: 'Sortable list of places', preview: 'table', w: 3, h: 2 },
  { id: 'sensor', group: 'Charts & indicators', name: 'Camera / sensor feed', hint: 'Live ground truth', preview: 'sensor', w: 2, h: 2 },

  // --- Alerts & timing ---
  { id: 'alert', group: 'Alerts & timing', name: 'Alert / threshold banner', hint: 'What is active right now', preview: 'alert', w: 4, h: 1 },
  { id: 'timeline', group: 'Alerts & timing', name: 'Timeline / action lead time', hint: 'When to act, and what', preview: 'timeline', w: 4, h: 1 },

  // --- Tools & interaction ---
  { id: 'search', group: 'Tools & interaction', name: 'Address search + locate me', hint: 'Find my place', preview: 'search', w: 2, h: 1 },
  { id: 'filter', group: 'Tools & interaction', name: 'Filter / query panel', hint: 'Narrow by attribute', preview: 'filter', w: 2, h: 2 },
  { id: 'legend', group: 'Tools & interaction', name: 'Layer list & legend', hint: 'Turn layers on and off', preview: 'legend', w: 2, h: 2 },
  { id: 'draw', group: 'Tools & interaction', name: 'Draw / measure area', hint: 'Sketch a study area', preview: 'draw', w: 3, h: 2 },
  { id: 'report', group: 'Tools & interaction', name: 'Report-a-problem form', hint: 'Crowdsourced field input', preview: 'report', w: 2, h: 2 },
  { id: 'assistant', group: 'Tools & interaction', name: 'Ask-a-question assistant', hint: 'Plain-language querying', preview: 'assistant', w: 2, h: 2 },
  { id: 'share', group: 'Tools & interaction', name: 'Print / share / export', hint: 'Take it into a meeting', preview: 'share', w: 2, h: 1 },

  // --- Text & notes ---
  { id: 'header', group: 'Text & notes', name: 'Title & intro text block', hint: 'Name and frame the tool', preview: 'header', w: 4, h: 1 },
  { id: 'note', group: 'Text & notes', name: 'Decision note (text only)', hint: 'Anything the widgets miss', isNote: true, w: 2, h: 1 },
];

const WIDGET_BY_ID = Object.fromEntries(WIDGETS.map((w) => [w.id, w]));
const GROUP_ORDER = ['Maps & scenes', 'Charts & indicators', 'Alerts & timing', 'Tools & interaction', 'Text & notes'];

/* ---------- Intake options ---------- */

const ICON = {
  eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
  route: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><path d="M8 18.5h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6"/></svg>',
  pin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  decide: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v6M12 9 6.5 14M12 9l5.5 5"/><circle cx="12" cy="3" r="0"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  plan: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/></svg>',
  bell: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 6 1.5 6H4.5S6 13 6 9z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  people: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6.4M17 14.8c2.4.6 4 2.6 4 5.2"/></svg>',
  sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/></svg>',
  wave: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 8c2.5-2.4 5-2.4 7.5 0S17 10.4 22 8M2 14c2.5-2.4 5-2.4 7.5 0s5 2.4 12.5 0M2 20c2.5-2.4 5-2.4 7.5 0s5 2.4 12.5 0"/></svg>',
  both: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>',
};

const PURPOSES = [
  { id: 'visualize', icon: 'eye', name: 'See the situation', sub: 'Visualization & situational awareness', desc: 'A dashboard that shows where the hazard is, who is exposed, and how bad it is right now or under a scenario.' },
  { id: 'routing', icon: 'route', name: 'Move people & resources', sub: 'Routing, access & logistics', desc: 'Find safe routes, road closures, service areas and drive times for crews, buses, transit or evacuation.' },
  { id: 'nearme', icon: 'pin', name: 'Answer "what about my address?"', sub: 'Near-me / public lookup', desc: 'A public-facing tool where a resident types an address and learns their risk and nearest help.' },
  { id: 'decide', icon: 'decide', name: 'Decide and trigger action', sub: 'Operational decision support', desc: 'Thresholds, triggers and checklists that tell an operator what to do and when to do it.' },
  { id: 'plan', icon: 'plan', name: 'Prioritize investment', sub: 'Planning & capital prioritization', desc: 'Compare neighborhoods or projects, rank need, and justify where money and interventions go.' },
  { id: 'monitor', icon: 'bell', name: 'Watch and warn', sub: 'Monitoring & early warning', desc: 'Continuous monitoring of gauges, forecasts and sensors that pushes alerts when limits are crossed.' },
  { id: 'engage', icon: 'people', name: 'Engage the community', sub: 'Communication & reporting', desc: 'Explain risk to the public, collect lived-experience reports, and build trust in the data.' },
];

const HAZARDS = [
  { id: 'heat', icon: 'sun', name: 'Extreme heat', desc: 'Heat index, hotspots, cooling centers, vulnerable residents.' },
  { id: 'flood', icon: 'wave', name: 'Flooding', desc: 'Flash & riverine flooding, stormwater, depth, closures.' },
  { id: 'both', icon: 'both', name: 'Both / compound', desc: 'Heat and flooding together, including back-to-back events.' },
];

const ROLES = ['', 'Emergency manager / EOC staff', 'City or county planner', 'Public works / stormwater engineer', 'Public health department', 'Transportation / transit / logistics', 'Utility operator', 'Community-based organization', 'Neighborhood resident / advocate', 'Researcher / academic', 'GIS analyst / data staff', 'Elected official or executive', 'Other'];

const LATENCY = ['', 'Live (minutes)', 'Hourly', 'Daily', 'Weekly', 'Seasonal', 'Annual / static', 'Not sure'];

const GEOGRAPHY = ['', 'Address / parcel', 'Street segment or intersection', 'Census block group', 'Neighborhood / ward', 'City of St. Louis', 'County', 'Metro region', 'Watershed / sewershed', 'Not sure'];

const AVAILABILITY = [
  { id: 'have', label: 'We have it' },
  { id: 'partial', label: 'Partly / messy' },
  { id: 'missing', label: 'Does not exist' },
  { id: 'unsure', label: 'Not sure' },
];

const PRIORITY = [
  { id: 'must', label: 'Must have' },
  { id: 'should', label: 'Important' },
  { id: 'nice', label: 'Nice to have' },
];

/* Layout templates: slot list with size, hint, and a preferred starter panel.
   Tokens beginning with @ resolve against the chosen hazard / purpose. */
const TEMPLATES = [
  {
    id: 'focus-map', name: 'Focus map + side rail',
    desc: 'One dominant map with supporting indicators down the right side. The Experience Builder classic.',
    thumb: [[4, 3, 1], [2, 1], [2, 1], [2, 1]],
    slots: [
      { w: 4, h: 3, hint: 'main map', pick: '@hazmap' },
      { w: 2, h: 1, hint: 'KPI or alert', pick: 'kpi' },
      { w: 2, h: 1, hint: 'chart', pick: '@hazchart' },
      { w: 2, h: 1, hint: 'legend or list', pick: 'legend' },
    ],
  },
  {
    id: 'kpi-strip', name: 'Indicator strip + map',
    desc: 'Three headline numbers across the top, map below, detail charts at the bottom. Good for operations rooms.',
    thumb: [[2, 1], [2, 1], [2, 1], [6, 2, 1], [3, 1], [3, 1]],
    slots: [
      { w: 2, h: 1, hint: 'KPI', pick: 'kpi' },
      { w: 2, h: 1, hint: 'risk index', pick: 'gauge' },
      { w: 2, h: 1, hint: 'alert or KPI', pick: 'alert' },
      { w: 6, h: 2, hint: 'main map', pick: '@hazmap' },
      { w: 3, h: 1, hint: 'chart', pick: '@hazchart' },
      { w: 3, h: 1, hint: 'chart', pick: '@hazchart2' },
    ],
  },
  {
    id: 'compare', name: 'Side-by-side compare',
    desc: 'Two equal panels for heat vs. flood, today vs. 2050, or two neighborhoods, with shared context below.',
    thumb: [[3, 2, 1], [3, 2, 1], [3, 1], [3, 1]],
    slots: [
      { w: 3, h: 2, hint: 'map A', pick: '@hazmap' },
      { w: 3, h: 2, hint: 'map B', pick: '@hazmap2' },
      { w: 3, h: 1, hint: 'chart A', pick: '@hazchart' },
      { w: 3, h: 1, hint: 'chart B', pick: '@hazchart2' },
    ],
  },
  {
    id: 'public-mobile', name: 'Public / phone-first',
    desc: 'A stacked, single-column tool a resident can use on a phone: search, answer, then what to do.',
    thumb: [[6, 1], [6, 1], [6, 2, 1], [6, 1]],
    slots: [
      { w: 6, h: 1, hint: 'title & intro', pick: 'header' },
      { w: 6, h: 1, hint: 'address search', pick: 'search' },
      { w: 6, h: 2, hint: 'map or answer', pick: '@hazmap' },
      { w: 6, h: 1, hint: 'what to do next', pick: 'alert' },
    ],
  },
  {
    id: 'ops', name: 'Operations console',
    desc: 'Alert banner up top, map plus timeline, and a task or route panel. Built around acting, not browsing.',
    thumb: [[6, 1], [4, 2, 1], [2, 2], [3, 1], [3, 1]],
    slots: [
      { w: 6, h: 1, hint: 'alert banner', pick: 'alert' },
      { w: 4, h: 2, hint: 'map', pick: '@hazmap' },
      { w: 2, h: 2, hint: 'filter or list', pick: 'table' },
      { w: 3, h: 1, hint: 'timeline', pick: 'timeline' },
      { w: 3, h: 1, hint: 'note', pick: 'note' },
    ],
  },
  {
    id: 'blank', name: 'Blank canvas (tidy grid)',
    desc: 'Start empty and build the layout yourself. Panels snap into a neat grid so nothing overlaps.',
    thumb: [[3, 1], [3, 1]],
    slots: [
      { w: 3, h: 2, hint: 'anything' },
      { w: 3, h: 2, hint: 'anything' },
    ],
  },
  {
    id: 'freeform', name: 'Build my own — free layout',
    free: true,
    desc: 'A completely open canvas. Drag every window exactly where you want it, resize it, overlap it. Closest to sketching the app on a whiteboard.',
    thumb: [[3, 2, 1], [2, 1], [2, 2], [3, 1]],
    slots: [],
  },
];

/* Free-layout design surface, in CSS pixels. Panels store x/y/w/h in this space. */
const FREE = { width: 1180, minHeight: 760, grid: 20, minW: 220, minH: 190, pad: 16 };

/* Token resolution for template picks */
const TOKENS = {
  '@hazmap': { heat: 'heat-map', flood: 'flood-map', both: 'heat-map' },
  '@hazmap2': { heat: 'facilities', flood: 'hazard-map', both: 'flood-map' },
  '@hazchart': { heat: 'heatdays', flood: 'hydrograph', both: 'heatdays' },
  '@hazchart2': { heat: 'timeseries', flood: 'exceedance', both: 'hydrograph' },
};
/* Purpose overrides for the main map slot */
const PURPOSE_MAP = { routing: 'route-map', nearme: 'nearme', engage: 'nearme' };

function resolvePick(token, hazard, purpose, hint) {
  if (!token) return null;
  if (token[0] !== '@') return token;
  if (token === '@hazmap' && PURPOSE_MAP[purpose] && /map|answer/.test(hint || '')) return PURPOSE_MAP[purpose];
  const t = TOKENS[token];
  return t ? (t[hazard] || t.both) : null;
}

/* Recommended starter widgets per purpose + hazard */
const SUGGESTIONS = {
  visualize: ['header', 'kpi', 'timeseries', 'legend'],
  routing: ['route-map', 'search', 'timeline', 'table'],
  nearme: ['header', 'search', 'nearme', 'facilities'],
  decide: ['alert', 'kpi', 'timeline', 'note'],
  plan: ['table', 'pie-chart', 'gauge', 'draw'],
  monitor: ['alert', 'sensor', 'timeseries', 'kpi'],
  engage: ['header', 'report', 'nearme', 'assistant'],
};
const HAZARD_SUGGEST = {
  heat: ['heat-map', 'heatdays', 'facilities'],
  flood: ['flood-map', 'hydrograph', 'exceedance'],
  both: ['heat-map', 'flood-map', 'calendar-grid'],
};
