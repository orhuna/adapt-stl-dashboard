/* ADAPT-STL Design Studio — widget catalog, previews, and intake options */

const SV = (body, ratio) =>
  `<svg viewBox="0 0 160 ${ratio || 100}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">${body}</svg>`;

const streets = (op = 1) => `
  <g stroke="var(--color-border)" stroke-width="1.4" opacity="${op}" fill="none">
    <path d="M0 22H160M0 44H160M0 66H160M0 88H160"/>
    <path d="M24 0V100M52 0V100M80 0V100M108 0V100M136 0V100"/>
  </g>
  <path d="M0 33 Q40 30 70 44 T160 52" stroke="var(--color-flood)" stroke-width="3.4" fill="none" opacity=".5"/>`;

const PREVIEWS = {
  basemap: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface-2)"/>
    <g fill="var(--color-surface-3)">
      <rect x="6" y="6" width="14" height="12" rx="1"/><rect x="30" y="6" width="18" height="12" rx="1"/>
      <rect x="6" y="26" width="14" height="14" rx="1"/><rect x="58" y="26" width="16" height="14" rx="1"/>
      <rect x="86" y="60" width="18" height="12" rx="1"/><rect x="114" y="26" width="18" height="14" rx="1"/>
      <rect x="30" y="72" width="16" height="14" rx="1"/>
    </g>
    ${streets()}
    <g><circle cx="86" cy="46" r="9" fill="var(--color-primary)" opacity=".18"/>
    <path d="M86 38c-3.6 0-6.5 2.9-6.5 6.5 0 4.6 6.5 11 6.5 11s6.5-6.4 6.5-11c0-3.6-2.9-6.5-6.5-6.5z" fill="var(--color-primary)"/>
    <circle cx="86" cy="44.5" r="2.3" fill="var(--color-surface)"/></g>`),

  nearme: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface-2)"/>${streets(.75)}
    <circle cx="80" cy="50" r="38" fill="var(--color-primary)" opacity=".07" stroke="var(--color-primary)" stroke-dasharray="3 3" stroke-width="1"/>
    <circle cx="80" cy="50" r="25" fill="var(--color-primary)" opacity=".1" stroke="var(--color-primary)" stroke-dasharray="3 3" stroke-width="1"/>
    <circle cx="80" cy="50" r="13" fill="var(--color-primary)" opacity=".16" stroke="var(--color-primary)" stroke-width="1"/>
    <circle cx="80" cy="50" r="4.5" fill="var(--color-primary)"/>
    <g fill="var(--color-heat)"><circle cx="56" cy="34" r="3"/><circle cx="104" cy="62" r="3"/><circle cx="98" cy="30" r="3"/></g>
    <text x="80" y="93" text-anchor="middle" font-size="8" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif">5 / 10 / 15 min</text>`),

  swipe: () => SV(`
    <defs><linearGradient id="swA" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(--color-flood)" stop-opacity=".55"/><stop offset="1" stop-color="var(--color-flood)" stop-opacity=".2"/></linearGradient></defs>
    <rect width="160" height="100" fill="var(--color-surface-2)"/>
    <rect width="80" height="100" fill="url(#swA)"/>
    <g fill="var(--color-heat)" opacity=".5"><circle cx="104" cy="34" r="13"/><circle cx="128" cy="62" r="10"/><circle cx="96" cy="72" r="8"/></g>
    ${streets(.5)}
    <line x1="80" y1="0" x2="80" y2="100" stroke="var(--color-surface)" stroke-width="2.5"/>
    <circle cx="80" cy="50" r="9" fill="var(--color-surface)" stroke="var(--color-border)"/>
    <path d="M77 46l-3 4 3 4M83 46l3 4-3 4" stroke="var(--color-text-muted)" stroke-width="1.4" fill="none"/>
    <text x="8" y="14" font-size="7.5" font-weight="700" fill="var(--color-surface)" font-family="sans-serif">2020</text>
    <text x="132" y="14" font-size="7.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif">2050</text>`),

  facilities: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface-2)"/>${streets(.7)}
    <g>
      <g transform="translate(38,28)"><circle r="8" fill="var(--color-primary)"/><path d="M-3.5 1.5v-3h7v3z" fill="#fff"/><path d="M0-4.5l4.5 3.5h-9z" fill="#fff"/></g>
      <g transform="translate(96,58)"><circle r="8" fill="var(--color-primary)"/><path d="M-3.5 1.5v-3h7v3z" fill="#fff"/><path d="M0-4.5l4.5 3.5h-9z" fill="#fff"/></g>
      <g transform="translate(118,26)"><circle r="7" fill="var(--color-text-faint)"/><path d="M-3 1v-2.5h6V1z" fill="#fff"/><path d="M0-4l4 3h-8z" fill="#fff"/></g>
    </g>
    <rect x="6" y="70" width="88" height="24" rx="3" fill="var(--color-surface)" opacity=".95"/>
    <rect x="10" y="74" width="42" height="4" rx="2" fill="var(--color-text-muted)"/>
    <rect x="10" y="82" width="66" height="3" rx="1.5" fill="var(--color-text-faint)"/>
    <rect x="10" y="88" width="52" height="3" rx="1.5" fill="var(--color-text-faint)"/>`),

  kpi: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <text x="14" y="26" font-size="9" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif" letter-spacing="1">HEAT INDEX</text>
    <text x="14" y="60" font-size="30" font-weight="800" fill="var(--color-heat)" font-family="sans-serif">104°F</text>
    <text x="14" y="74" font-size="9" font-weight="600" fill="var(--color-text-muted)" font-family="sans-serif">▲ 6° over threshold</text>
    <rect x="14" y="82" width="132" height="6" rx="3" fill="var(--color-surface-3)"/>
    <rect x="14" y="82" width="104" height="6" rx="3" fill="var(--color-heat)"/>
    <line x1="122" y1="79" x2="122" y2="91" stroke="var(--color-text)" stroke-width="1.4"/>`),

  timeseries: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <g stroke="var(--color-divider)" stroke-width="1"><path d="M18 22H150M18 44H150M18 66H150"/></g>
    <path d="M18 14V84H152" stroke="var(--color-border)" stroke-width="1.2" fill="none"/>
    <path d="M22 70 L40 62 L58 66 L76 44 L94 50 L112 30 L130 36 L148 22" fill="none" stroke="var(--color-primary)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M22 78 L40 74 L58 76 L76 62 L94 66 L112 54 L130 58 L148 48" fill="none" stroke="var(--color-text-faint)" stroke-width="1.6" stroke-dasharray="4 3"/>
    <g fill="var(--color-primary)"><circle cx="112" cy="30" r="2.6"/><circle cx="148" cy="22" r="2.6"/></g>
    <text x="18" y="95" font-size="7" fill="var(--color-text-faint)" font-family="sans-serif">Jun</text>
    <text x="140" y="95" font-size="7" fill="var(--color-text-faint)" font-family="sans-serif">Sep</text>`),

  heatdays: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <line x1="16" y1="34" x2="152" y2="34" stroke="var(--color-heat)" stroke-width="1.2" stroke-dasharray="4 3"/>
    <text x="118" y="30" font-size="7" font-weight="700" fill="var(--color-heat)" font-family="sans-serif">threshold</text>
    <g>
      <rect x="20" y="56" width="13" height="28" rx="2" fill="var(--color-text-faint)"/>
      <rect x="39" y="48" width="13" height="36" rx="2" fill="var(--color-text-faint)"/>
      <rect x="58" y="38" width="13" height="46" rx="2" fill="var(--color-warning)"/>
      <rect x="77" y="24" width="13" height="60" rx="2" fill="var(--color-heat)"/>
      <rect x="96" y="18" width="13" height="66" rx="2" fill="var(--color-heat)"/>
      <rect x="115" y="30" width="13" height="54" rx="2" fill="var(--color-warning)"/>
      <rect x="134" y="46" width="13" height="38" rx="2" fill="var(--color-text-faint)"/>
    </g>
    <line x1="14" y1="84" x2="152" y2="84" stroke="var(--color-border)"/>
    <g font-size="6.5" fill="var(--color-text-faint)" font-family="sans-serif" text-anchor="middle">
      <text x="26" y="94">Mon</text><text x="64" y="94">Wed</text><text x="102" y="94">Fri</text><text x="140" y="94">Sun</text></g>`),

  hydrograph: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <rect x="16" y="14" width="136" height="16" fill="var(--color-heat)" opacity=".14"/>
    <rect x="16" y="30" width="136" height="16" fill="var(--color-warning)" opacity=".16"/>
    <rect x="16" y="46" width="136" height="16" fill="var(--color-flood)" opacity=".14"/>
    <g font-size="6" font-weight="700" font-family="sans-serif">
      <text x="122" y="22" fill="var(--color-heat)">MAJOR</text>
      <text x="112" y="40" fill="var(--color-warning)">MODERATE</text>
      <text x="124" y="57" fill="var(--color-flood)">MINOR</text></g>
    <path d="M18 76 L34 74 L48 70 L62 58 L76 40 L90 26 L104 30 L118 42 L132 56 L150 66" fill="none" stroke="var(--color-flood)" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M90 26 L104 30 L118 42 L132 56 L150 66" fill="none" stroke="var(--color-flood)" stroke-width="2.6" stroke-dasharray="4 3"/>
    <line x1="90" y1="14" x2="90" y2="84" stroke="var(--color-text-muted)" stroke-width="1" stroke-dasharray="2 2"/>
    <text x="93" y="92" font-size="6.5" fill="var(--color-text-muted)" font-family="sans-serif">forecast</text>
    <path d="M16 14V84H152" stroke="var(--color-border)" fill="none"/>
    <text x="4" y="50" font-size="6.5" fill="var(--color-text-faint)" font-family="sans-serif" transform="rotate(-90 8 50)">stage ft</text>`),

  exceedance: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <path d="M20 16V82H152" stroke="var(--color-border)" fill="none"/>
    <path d="M22 74 C50 72 78 60 106 40 S140 20 150 18" fill="none" stroke="var(--color-flood)" stroke-width="2.6"/>
    <path d="M22 78 C52 76 80 68 108 50 S142 30 150 26" fill="none" stroke="var(--color-text-faint)" stroke-width="1.4" stroke-dasharray="3 3"/>
    <g stroke-width="1.2" stroke-dasharray="4 3">
      <line x1="20" y1="60" x2="152" y2="60" stroke="var(--color-flood)"/>
      <line x1="20" y1="42" x2="152" y2="42" stroke="var(--color-warning)"/>
      <line x1="20" y1="26" x2="152" y2="26" stroke="var(--color-heat)"/></g>
    <g font-size="6" font-weight="700" font-family="sans-serif">
      <text x="24" y="58" fill="var(--color-flood)">2-yr</text><text x="24" y="40" fill="var(--color-warning)">10-yr</text><text x="24" y="24" fill="var(--color-heat)">100-yr</text></g>
    <text x="60" y="94" font-size="6.5" fill="var(--color-text-faint)" font-family="sans-serif">annual exceedance probability</text>`),

  gauge: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <path d="M42 78a38 38 0 0 1 76 0" fill="none" stroke="var(--color-surface-3)" stroke-width="12" stroke-linecap="round"/>
    <path d="M42 78a38 38 0 0 1 60 -30" fill="none" stroke="var(--color-heat)" stroke-width="12" stroke-linecap="round"/>
    <line x1="80" y1="78" x2="104" y2="52" stroke="var(--color-text)" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="80" cy="78" r="4" fill="var(--color-text)"/>
    <text x="80" y="70" text-anchor="middle" font-size="16" font-weight="800" fill="var(--color-text)" font-family="sans-serif">3.7</text>
    <text x="80" y="94" text-anchor="middle" font-size="7.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif" letter-spacing=".8">VULNERABILITY INDEX</text>`),

  table: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <rect x="0" y="0" width="160" height="16" fill="var(--color-surface-2)"/>
    <g font-size="6.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif">
      <text x="8" y="11">NEIGHBORHOOD</text><text x="96" y="11">RISK</text><text x="128" y="11">POP</text></g>
    ${[0, 1, 2, 3, 4].map((i) => {
      const y = 24 + i * 15;
      const w = [46, 40, 34, 27, 20][i];
      const c = i < 2 ? 'var(--color-heat)' : i < 4 ? 'var(--color-warning)' : 'var(--color-text-faint)';
      return `<rect x="8" y="${y}" width="${[52, 44, 60, 48, 40][i]}" height="4" rx="2" fill="var(--color-text-faint)"/>
      <rect x="96" y="${y - 1}" width="${w}" height="6" rx="3" fill="${c}"/>
      <rect x="140" y="${y}" width="14" height="4" rx="2" fill="var(--color-text-faint)"/>
      <line x1="0" y1="${y + 9}" x2="160" y2="${y + 9}" stroke="var(--color-divider)"/>`;
    }).join('')}`),

  alert: () => SV(`
    <rect width="160" height="100" fill="var(--color-heat-soft)"/>
    <rect x="0" y="0" width="4" height="100" fill="var(--color-heat)"/>
    <path d="M28 30 L40 52 H16 Z" fill="var(--color-heat)"/>
    <rect x="19.5" y="38" width="1.6" height="0" fill="#fff"/>
    <text x="28" y="49" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="sans-serif">!</text>
    <text x="50" y="42" font-size="11" font-weight="800" fill="var(--color-heat)" font-family="sans-serif">EXCESSIVE HEAT</text>
    <text x="50" y="55" font-size="8" font-weight="600" fill="var(--color-heat)" font-family="sans-serif" opacity=".85">Warning in effect until 8 PM</text>
    <rect x="16" y="66" width="128" height="1" fill="var(--color-heat)" opacity=".25"/>
    <text x="16" y="80" font-size="7.5" fill="var(--color-heat)" font-family="sans-serif" opacity=".8">Trigger: HI ≥ 103°F for 2+ days</text>`),

  timeline: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <line x1="16" y1="50" x2="146" y2="50" stroke="var(--color-border)" stroke-width="2"/>
    <g>
      <circle cx="24" cy="50" r="6" fill="var(--color-primary)"/>
      <circle cx="62" cy="50" r="5" fill="var(--color-warning)"/>
      <circle cx="100" cy="50" r="7" fill="var(--color-heat)"/>
      <circle cx="138" cy="50" r="5" fill="var(--color-text-faint)"/></g>
    <g font-size="7" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif" text-anchor="middle">
      <text x="24" y="34">NOW</text><text x="62" y="34">+12h</text><text x="100" y="34">PEAK</text><text x="138" y="34">+48h</text></g>
    <g font-size="6.5" fill="var(--color-text-faint)" font-family="sans-serif" text-anchor="middle">
      <text x="24" y="70">monitor</text><text x="62" y="70">pre-position</text><text x="100" y="70">open centers</text><text x="138" y="70">stand down</text></g>`),

  filter: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <text x="12" y="18" font-size="7.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif" letter-spacing=".8">FILTERS</text>
    <g>
      <rect x="12" y="28" width="136" height="4" rx="2" fill="var(--color-surface-3)"/>
      <rect x="12" y="28" width="82" height="4" rx="2" fill="var(--color-primary)"/>
      <circle cx="94" cy="30" r="6" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2"/>
      <rect x="12" y="48" width="136" height="4" rx="2" fill="var(--color-surface-3)"/>
      <rect x="12" y="48" width="46" height="4" rx="2" fill="var(--color-primary)"/>
      <circle cx="58" cy="50" r="6" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2"/></g>
    <g>
      <rect x="12" y="66" width="10" height="10" rx="2" fill="var(--color-primary)"/>
      <path d="M14.5 71l2 2 3.5-3.5" stroke="#fff" stroke-width="1.4" fill="none"/>
      <rect x="28" y="69" width="44" height="4" rx="2" fill="var(--color-text-faint)"/>
      <rect x="12" y="82" width="10" height="10" rx="2" fill="none" stroke="var(--color-border)" stroke-width="1.5"/>
      <rect x="28" y="85" width="56" height="4" rx="2" fill="var(--color-text-faint)"/></g>`),

  search: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <rect x="10" y="14" width="116" height="20" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)"/>
    <circle cx="24" cy="24" r="4.5" fill="none" stroke="var(--color-text-muted)" stroke-width="1.6"/>
    <line x1="27.5" y1="27.5" x2="31" y2="31" stroke="var(--color-text-muted)" stroke-width="1.6"/>
    <text x="36" y="27" font-size="7.5" fill="var(--color-text-faint)" font-family="sans-serif">Enter your address…</text>
    <circle cx="140" cy="24" r="10" fill="var(--color-primary)"/>
    <circle cx="140" cy="24" r="3.2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <path d="M140 17v3M140 28v3M133 24h3M144 24h3" stroke="#fff" stroke-width="1.5"/>
    <g>
      <rect x="10" y="44" width="90" height="4" rx="2" fill="var(--color-text-faint)"/>
      <rect x="10" y="56" width="70" height="4" rx="2" fill="var(--color-text-faint)"/>
      <rect x="10" y="68" width="82" height="4" rx="2" fill="var(--color-text-faint)"/>
      <rect x="10" y="80" width="58" height="4" rx="2" fill="var(--color-text-faint)"/></g>`),

  legend: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <text x="12" y="18" font-size="7.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif" letter-spacing=".8">LAYERS &amp; LEGEND</text>
    ${['var(--color-flood)', 'var(--color-heat)', 'var(--color-warning)', 'var(--color-success)'].map((c, i) =>
      `<rect x="12" y="${28 + i * 16}" width="12" height="12" rx="2" fill="${c}"/>
       <rect x="32" y="${32 + i * 16}" width="${[74, 58, 66, 48][i]}" height="4" rx="2" fill="var(--color-text-faint)"/>
       <rect x="136" y="${31 + i * 16}" width="14" height="7" rx="3.5" fill="${i < 2 ? 'var(--color-primary)' : 'var(--color-surface-3)'}"/>
       <circle cx="${i < 2 ? 146.5 : 139.5}" cy="${34.5 + i * 16}" r="2.6" fill="var(--color-surface)"/>`).join('')}`),

  draw: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface-2)"/>${streets(.7)}
    <path d="M36 26 L104 20 L128 58 L74 82 L40 62 Z" fill="var(--color-primary)" opacity=".16" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="5 3"/>
    <g fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.8">
      <rect x="32" y="22" width="8" height="8"/><rect x="100" y="16" width="8" height="8"/>
      <rect x="124" y="54" width="8" height="8"/><rect x="70" y="78" width="8" height="8"/><rect x="36" y="58" width="8" height="8"/></g>
    <rect x="90" y="66" width="60" height="16" rx="3" fill="var(--color-surface)" opacity=".95"/>
    <text x="96" y="77" font-size="8" font-weight="700" fill="var(--color-primary)" font-family="sans-serif">2.4 sq mi</text>`),

  report: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <text x="12" y="18" font-size="8" font-weight="700" fill="var(--color-text)" font-family="sans-serif">Report flooding here</text>
    <rect x="12" y="26" width="136" height="14" rx="3" fill="var(--color-surface-2)" stroke="var(--color-border)"/>
    <rect x="18" y="31" width="52" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="12" y="44" width="66" height="26" rx="3" fill="var(--color-surface-2)" stroke="var(--color-border)" stroke-dasharray="3 3"/>
    <g transform="translate(45,57)"><rect x="-9" y="-5" width="18" height="12" rx="2" fill="none" stroke="var(--color-text-muted)" stroke-width="1.4"/><circle r="3" fill="none" stroke="var(--color-text-muted)" stroke-width="1.4"/></g>
    <rect x="84" y="44" width="64" height="26" rx="3" fill="var(--color-surface-2)" stroke="var(--color-border)"/>
    <rect x="90" y="50" width="40" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="90" y="59" width="30" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="12" y="76" width="60" height="16" rx="8" fill="var(--color-primary)"/>
    <text x="42" y="87" text-anchor="middle" font-size="8" font-weight="700" fill="var(--color-text-inverse)" font-family="sans-serif">Submit</text>`),

  assistant: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <rect x="42" y="12" width="106" height="22" rx="8" fill="var(--color-surface-2)"/>
    <rect x="50" y="19" width="76" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="50" y="27" width="52" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="12" y="40" width="112" height="28" rx="8" fill="var(--color-primary)" opacity=".16"/>
    <rect x="20" y="47" width="90" height="4" rx="2" fill="var(--color-primary)"/>
    <rect x="20" y="55" width="70" height="4" rx="2" fill="var(--color-primary)" opacity=".7"/>
    <rect x="12" y="76" width="102" height="16" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)"/>
    <text x="20" y="87" font-size="7.5" fill="var(--color-text-faint)" font-family="sans-serif">Ask about your block…</text>
    <circle cx="136" cy="84" r="10" fill="var(--color-primary)"/>
    <path d="M131 84h9M136 79l5 5-5 5" stroke="#fff" stroke-width="1.6" fill="none"/>`),

  sensor: () => SV(`
    <rect width="160" height="100" fill="#101a24"/>
    <rect x="0" y="0" width="160" height="66" fill="#1b2c3a"/>
    <path d="M0 52 L44 40 L86 50 L124 34 L160 42 V66 H0Z" fill="#2a4256"/>
    <rect x="18" y="30" width="16" height="26" fill="#39566d"/><rect x="52" y="22" width="14" height="34" fill="#436079"/>
    <rect x="94" y="26" width="18" height="30" fill="#39566d"/>
    <circle cx="128" cy="14" r="6" fill="#f0b429" opacity=".8"/>
    <rect x="8" y="8" width="46" height="12" rx="3" fill="rgba(0,0,0,.5)"/>
    <circle cx="16" cy="14" r="3" fill="#e0524c"/>
    <text x="24" y="18" font-size="7" font-weight="700" fill="#fff" font-family="sans-serif">LIVE</text>
    <rect x="0" y="66" width="160" height="34" fill="var(--color-surface)"/>
    <text x="10" y="80" font-size="8" font-weight="700" fill="var(--color-text)" font-family="sans-serif">Surface temp 118°F</text>
    <text x="10" y="92" font-size="7" fill="var(--color-text-muted)" font-family="sans-serif">Sensor STL-07 · updated 4 min ago</text>`),

  share: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <text x="12" y="20" font-size="8" font-weight="700" fill="var(--color-text)" font-family="sans-serif">Share this view</text>
    ${['Print', 'PDF', 'Link'].map((t, i) =>
      `<rect x="${12 + i * 48}" y="30" width="42" height="22" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)"/>
       <text x="${33 + i * 48}" y="44" text-anchor="middle" font-size="7.5" font-weight="700" fill="var(--color-text-muted)" font-family="sans-serif">${t}</text>`).join('')}
    <rect x="12" y="62" width="136" height="16" rx="4" fill="var(--color-surface-2)"/>
    <text x="18" y="73" font-size="7" fill="var(--color-text-faint)" font-family="sans-serif">adapt-stl.org/app/heat-watch?id=…</text>
    <rect x="12" y="84" width="52" height="10" rx="5" fill="var(--color-primary)"/>
    <text x="38" y="92" text-anchor="middle" font-size="6.5" font-weight="700" fill="var(--color-text-inverse)" font-family="sans-serif">Copy link</text>`),

  header: () => SV(`
    <rect width="160" height="100" fill="var(--color-surface)"/>
    <rect x="0" y="0" width="160" height="40" fill="var(--color-primary)"/>
    <circle cx="20" cy="20" r="9" fill="rgba(255,255,255,.28)"/>
    <text x="36" y="18" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">Heat Watch STL</text>
    <text x="36" y="30" font-size="7" fill="rgba(255,255,255,.8)" font-family="sans-serif">City of St. Louis · ADAPT-STL</text>
    <rect x="12" y="52" width="104" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="12" y="62" width="132" height="4" rx="2" fill="var(--color-text-faint)"/>
    <rect x="12" y="72" width="86" height="4" rx="2" fill="var(--color-text-faint)"/>`),

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

/* Layout templates: slot list with size + suggested widget group */
const TEMPLATES = [
  {
    id: 'focus-map', name: 'Focus map + side rail', desc: 'One dominant map with supporting indicators down the right side. The Experience Builder classic.',
    thumb: [[4, 3, 1], [2, 1], [2, 1], [2, 1]],
    slots: [{ w: 4, h: 3, hint: 'main map' }, { w: 2, h: 1, hint: 'KPI or alert' }, { w: 2, h: 1, hint: 'chart' }, { w: 2, h: 1, hint: 'list or legend' }],
  },
  {
    id: 'kpi-strip', name: 'Indicator strip + map', desc: 'Three headline numbers across the top, map below, detail charts at the bottom. Good for operations rooms.',
    thumb: [[2, 1], [2, 1], [2, 1], [6, 2, 1], [3, 1], [3, 1]],
    slots: [{ w: 2, h: 1, hint: 'KPI' }, { w: 2, h: 1, hint: 'KPI' }, { w: 2, h: 1, hint: 'KPI' }, { w: 6, h: 2, hint: 'main map' }, { w: 3, h: 1, hint: 'chart' }, { w: 3, h: 1, hint: 'chart' }],
  },
  {
    id: 'compare', name: 'Side-by-side compare', desc: 'Two equal panels for heat vs. flood, today vs. 2050, or two neighborhoods, with shared context below.',
    thumb: [[3, 2, 1], [3, 2, 1], [3, 1], [3, 1]],
    slots: [{ w: 3, h: 2, hint: 'map A' }, { w: 3, h: 2, hint: 'map B' }, { w: 3, h: 1, hint: 'chart A' }, { w: 3, h: 1, hint: 'chart B' }],
  },
  {
    id: 'public-mobile', name: 'Public / phone-first', desc: 'A stacked, single-column tool a resident can use on a phone: search, answer, then what to do.',
    thumb: [[6, 1], [6, 1], [6, 2, 1], [6, 1]],
    slots: [{ w: 6, h: 1, hint: 'title & intro' }, { w: 6, h: 1, hint: 'address search' }, { w: 6, h: 2, hint: 'map or answer' }, { w: 6, h: 1, hint: 'what to do' }],
  },
  {
    id: 'ops', name: 'Operations console', desc: 'Alert banner up top, map plus timeline, and a task or route panel. Built around acting, not browsing.',
    thumb: [[6, 1], [4, 2, 1], [2, 2], [3, 1], [3, 1]],
    slots: [{ w: 6, h: 1, hint: 'alert banner' }, { w: 4, h: 2, hint: 'map' }, { w: 2, h: 2, hint: 'filter or list' }, { w: 3, h: 1, hint: 'timeline' }, { w: 3, h: 1, hint: 'note' }],
  },
  {
    id: 'blank', name: 'Blank canvas', desc: 'Start empty and build the layout yourself. Add, resize and remove panels freely.',
    thumb: [[3, 1], [3, 1]],
    slots: [{ w: 3, h: 2, hint: 'anything' }, { w: 3, h: 2, hint: 'anything' }],
  },
];

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
