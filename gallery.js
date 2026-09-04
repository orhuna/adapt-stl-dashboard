/* ADAPT-STL Design Studio — board gallery
   Redraws every submitted dashboard from its JSON, with the notes people wrote.
   Read-only. Everything happens in this browser; nothing is uploaded. */

(function () {
  'use strict';

  var CFG = window.ADAPT_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var boards = [];

  /* ---------------- preview markup (mirrors app.js) ---------------- */

  var NOTE_MOCK = '<div class="mk mk-pad" style="display:grid;gap:8px;align-content:start">' +
    '<span class="mk-txt" style="width:84%"></span><span class="mk-txt" style="width:96%"></span>' +
    '<span class="mk-txt" style="width:72%"></span>' +
    '<span class="mk-txt" style="width:46%;background:var(--color-primary)"></span></div>';

  function previewFor(w) {
    if (!w) return '';
    if (w.img) {
      return '<img src="' + w.img + '" alt="' + esc(w.name) + ' example" loading="lazy" decoding="async">' +
        (w.caption ? '<span class="widget-caption">' + esc(w.caption) + '</span>' : '');
    }
    if (w.isNote) return NOTE_MOCK;
    return PREVIEWS[w.preview] ? PREVIEWS[w.preview]() : '';
  }

  /* ---------------- board rendering ---------------- */

  function panelHtml(p, opts) {
    var w = WIDGET_BY_ID[p.type];
    var need = (p.need || '').trim();
    var meta = [
      p.geography, p.freshness,
      p.priority ? 'priority: ' + p.priority : '',
      p.dataAvailability ? 'data: ' + p.dataAvailability : ''
    ].filter(Boolean).join(' · ');
    var style = opts && opts.free
      ? 'left:' + (p.x || 0) + 'px;top:' + (p.y || 0) + 'px;width:' + (p.widthPx || 300) + 'px;min-height:' + (p.heightPx || 240) + 'px;'
      : 'flex:' + (p.widthCols || 3) + ' 1 0;';
    var noteBlock = '<div class="widget-note gw-note ' + (need ? '' : 'is-empty') + '">' +
        '<label><span class="wn-dot" aria-hidden="true"></span>' +
          (w && w.isNote ? 'Their note' : 'What they need this panel to show') + '</label>' +
        '<p>' + (need ? esc(need) : '<em>left blank</em>') + '</p>' +
        (p.dataNeeded ? '<p class="gw-sub"><b>Data named:</b> ' + esc(p.dataNeeded) + '</p>' : '') +
        (meta ? '<p class="gw-sub">' + esc(meta) + '</p>' : '') +
      '</div>';
    return '<article class="widget gw ' + (opts && opts.free ? 'is-free' : '') + ' ' + (w && w.isNote ? 'is-note' : '') + '" style="' + style + '">' +
      '<header class="widget-head"><h4>' + esc(p.title || (w ? w.name : p.typeName || p.type)) + '</h4>' +
      '<span class="gw-ord">' + esc(p.order) + '</span></header>' +
      '<div class="widget-body">' + (w && w.isNote ? esc(p.need || '') : previewFor(w)) + '</div>' +
      (opts && opts.free ? '' : noteBlock) + '</article>';
  }

  /* Free-layout boards are redrawn at the exact size and position the
     participant chose, so the notes go in a list underneath rather than inside
     the panels, where they would overlap the neighbouring windows. */
  function freeNotesHtml(panels) {
    return '<ol class="gb-notes">' + panels.map(function (p) {
      var w = WIDGET_BY_ID[p.type];
      var need = (p.need || '').trim();
      var meta = [p.geography, p.freshness, p.priority ? 'priority: ' + p.priority : '',
        p.dataAvailability ? 'data: ' + p.dataAvailability : ''].filter(Boolean).join(' · ');
      return '<li><span class="gw-ord">' + esc(p.order) + '</span><div>' +
        '<b>' + esc(p.title || (w ? w.name : p.typeName || p.type)) + '</b>' +
        '<p>' + (need ? esc(need) : '<em>left blank</em>') + '</p>' +
        (p.dataNeeded ? '<p class="gw-sub"><b>Data named:</b> ' + esc(p.dataNeeded) + '</p>' : '') +
        (meta ? '<p class="gw-sub">' + esc(meta) + '</p>' : '') +
        '</div></li>';
    }).join('') + '</ol>';
  }

  function canvasHtml(b) {
    var panels = (b.panels || []).slice();
    if (!panels.length) return '<div class="gb-empty">This board has no panels.</div>';

    if (b.layoutMode === 'free') {
      var maxY = 0, maxX = 0;
      panels.forEach(function (p) {
        maxY = Math.max(maxY, (p.y || 0) + (p.heightPx || 240));
        maxX = Math.max(maxX, (p.x || 0) + (p.widthPx || 300));
      });
      var srcW = b.surfaceWidthPx || maxX || 1000;
      var ordered = panels.slice().sort(function (a, c) { return (a.order || 0) - (c.order || 0); });
      return '<div class="gb-free-wrap"><div class="gb-free" style="width:' + srcW + 'px;height:' + (maxY + 24) + 'px">' +
        panels.map(function (p) { return panelHtml(p, { free: true }); }).join('') +
        '</div></div>' + freeNotesHtml(ordered);
    }

    var rows = {};
    panels.forEach(function (p) {
      var r = p.rowIndex || p.order;
      (rows[r] = rows[r] || []).push(p);
    });
    return Object.keys(rows).sort(function (a, c) { return a - c; }).map(function (r) {
      var members = rows[r].sort(function (a, c) { return (a.colIndex || 0) - (c.colIndex || 0); });
      return '<div class="crow gb-row">' + members.map(function (p) { return panelHtml(p, {}); }).join('') + '</div>';
    }).join('');
  }

  function briefHtml(b) {
    var br = b.brief || {};
    var items = [
      ['Decision this tool supports', br.decision],
      ['Action that follows', br.action],
      ['Who else would open it', br.who],
      ['How often', br.frequency],
      ['Data or capability missing today', br.missing],
      ['What stops them using a tool like this', br.barrier]
    ].filter(function (x) { return (x[1] || '').trim(); });
    if (!items.length) return '<div class="gb-brief"><p class="gb-none">No decision brief written.</p></div>';
    return '<div class="gb-brief">' + items.map(function (x) {
      return '<div><h5>' + esc(x[0]) + '</h5><p>' + esc(x[1]) + '</p></div>';
    }).join('') + '</div>';
  }

  function boardHtml(b, i) {
    var when = b.submittedAt ? new Date(b.submittedAt).toLocaleString() : '';
    var chips = [
      b.hazardLabel || b.hazard,
      b.purposeLabel || b.purpose,
      b.templateLabel || b.template,
      b.layoutMode === 'free' ? 'free layout' : 'rows & columns',
      (b.panels || []).length + ' panel' + ((b.panels || []).length === 1 ? '' : 's')
    ].filter(Boolean);
    return '<section class="gb" data-i="' + i + '">' +
      '<header class="gb-head">' +
        '<div><h2>' + esc(b.appTitle || 'Untitled tool') + '</h2>' +
        '<p class="gb-by">' + esc(b.boardCode || '') +
          (b.role ? ' · ' + esc(b.role) : '') + (b.organization ? ' · ' + esc(b.organization) : '') +
          (when ? ' · ' + esc(when) : '') + '</p></div>' +
        '<div class="gb-chips">' + chips.map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('') + '</div>' +
      '</header>' +
      '<div class="gb-canvas">' + canvasHtml(b) + '</div>' +
      briefHtml(b) +
    '</section>';
  }

  /* ---------------- filters, sorting, render ---------------- */

  function visible() {
    var hz = $('#g-f-hazard').value, pu = $('#g-f-purpose').value, sort = $('#g-sort').value;
    var out = boards.filter(function (b) {
      return (!hz || (b.hazardLabel || b.hazard) === hz) && (!pu || (b.purposeLabel || b.purpose) === pu);
    });
    out.sort(function (a, b) {
      if (sort === 'panels') return (b.panels || []).length - (a.panels || []).length;
      var ta = Date.parse(a.submittedAt || 0) || 0, tb = Date.parse(b.submittedAt || 0) || 0;
      return sort === 'old' ? ta - tb : tb - ta;
    });
    return out;
  }

  function fillFilter(id, key) {
    var seen = [];
    boards.forEach(function (b) {
      var v = b[key + 'Label'] || b[key];
      if (v && seen.indexOf(v) < 0) seen.push(v);
    });
    var s = $(id), cur = s.value;
    s.innerHTML = '<option value="">All</option>' + seen.map(function (v) {
      return '<option value="' + esc(v) + '">' + esc(v) + '</option>';
    }).join('');
    s.value = cur;
  }

  function render() {
    var list = visible();
    $('#g-count').innerHTML = '<strong>' + list.length + '</strong> board' + (list.length === 1 ? '' : 's') +
      (list.length !== boards.length ? ' <span>of ' + boards.length + '</span>' : '') +
      ' · <strong>' + list.reduce(function (n, b) { return n + (b.panels || []).length; }, 0) + '</strong> panels';
    $('#g-boards').innerHTML = list.length
      ? list.map(boardHtml).join('')
      : '<div class="gb-empty">Nothing matches those filters.</div>';
    scaleFree();
  }

  /* Free-layout boards were drawn at the participant's screen width. Scale them
     down so they fit this page without a horizontal scrollbar. */
  function scaleFree() {
    Array.prototype.forEach.call(document.querySelectorAll('.gb-free'), function (el) {
      var wrap = el.parentNode;
      var srcW = parseFloat(el.style.width) || 1000;
      var k = Math.min(1, (wrap.clientWidth - 2) / srcW);
      el.style.transform = 'none';
      el.style.height = 'auto';
      // panels grow taller than their placed height once the notes are shown,
      // so measure the real bottom edge before scaling.
      var bottom = 0;
      Array.prototype.forEach.call(el.children, function (c) {
        bottom = Math.max(bottom, c.offsetTop + c.offsetHeight);
      });
      el.style.height = (bottom + 16) + 'px';
      el.style.transform = 'scale(' + k + ')';
      el.style.transformOrigin = 'top left';
      wrap.style.height = ((bottom + 16) * k) + 'px';
    });
  }
  window.addEventListener('resize', scaleFree);

  /* ---------------- loading ---------------- */

  function status(msg, bad) {
    var el = $('#g-status');
    el.textContent = msg || '';
    el.className = 'g-hint' + (bad ? ' is-bad' : '');
  }

  function ingest(raw, label) {
    var added = 0, list = Array.isArray(raw) ? raw : [raw];
    list.forEach(function (b) {
      if (!b || !b.schema || !b.panels) return;
      if (boards.some(function (x) { return x.boardCode === b.boardCode && x.submittedAt === b.submittedAt; })) return;
      boards.push(b); added += 1;
    });
    if (!boards.length) { status('No ADAPT-STL boards found in ' + (label || 'that data') + '.', true); return; }
    $('#g-load').hidden = true;
    $('#g-results').hidden = false;
    fillFilter('#g-f-hazard', 'hazard');
    fillFilter('#g-f-purpose', 'purpose');
    render();
    status(added + ' board' + (added === 1 ? '' : 's') + ' added.');
  }

  function parseLoose(text) {
    var t = text.trim();
    if (!t) return [];
    try { return JSON.parse(t); } catch (e) { /* maybe one JSON object per line */ }
    var out = [];
    t.split(/\r?\n/).forEach(function (line) {
      line = line.trim().replace(/^"+|"+$/g, '');
      if (!line) return;
      try { out.push(JSON.parse(line)); } catch (e) { /* skip */ }
    });
    return out;
  }

  $('#g-fetch').addEventListener('click', function () {
    var url = $('#g-url').value.trim(), key = $('#g-key').value.trim();
    if (!url) { status('Paste your Apps Script /exec URL first.', true); return; }
    status('Loading…');
    var full = url + (url.indexOf('?') > -1 ? '&' : '?') + 'boards=1&key=' + encodeURIComponent(key);
    fetch(full).then(function (r) { return r.json(); }).then(function (d) {
      if (!d.ok) { status(d.error || 'The collector refused that request.', true); return; }
      if (!d.boards || !d.boards.length) { status('The sheet has no submissions yet.', true); return; }
      ingest(d.boards, 'the sheet');
    }).catch(function (err) {
      status('Could not reach the collector: ' + err.message + '. Check the URL, and that the web app is deployed with access set to Anyone.', true);
    });
  });

  var drop = $('#g-drop'), fileInput = $('#g-file');
  drop.addEventListener('click', function () { fileInput.click(); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  ['dragenter', 'dragover'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) { readFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', function () { readFiles(fileInput.files); });

  function readFiles(files) {
    var all = [], left = files.length;
    if (!left) return;
    Array.prototype.forEach.call(files, function (f) {
      var fr = new FileReader();
      fr.onload = function () {
        var got = parseLoose(String(fr.result));
        all = all.concat(Array.isArray(got) ? got : [got]);
        if (--left === 0) ingest(all, 'those files');
      };
      fr.onerror = function () { if (--left === 0) ingest(all, 'those files'); };
      fr.readAsText(f);
    });
  }

  $('#g-paste-go').addEventListener('click', function () {
    ingest(parseLoose($('#g-paste').value), 'that text');
  });

  $('#g-reset').addEventListener('click', function () {
    boards = [];
    $('#g-results').hidden = true;
    $('#g-load').hidden = false;
    status('');
  });

  ['#g-f-hazard', '#g-f-purpose', '#g-sort'].forEach(function (s) {
    $(s).addEventListener('change', render);
  });

  /* ---------------- combined CSV ---------------- */

  var COLS = ['board_code', 'event', 'submitted_at', 'app_title', 'purpose', 'hazard', 'template',
    'role', 'organization', 'decision', 'action', 'audience', 'open_frequency', 'missing_data',
    'barrier', 'contact', 'panel_order', 'panel_type', 'panel_type_name', 'panel_category',
    'panel_hazard_tag', 'panel_title', 'need_text', 'data_needed', 'geography', 'freshness',
    'data_availability', 'priority', 'layout_mode', 'row_index', 'col_index', 'width_cols',
    'height_rows', 'pos_x', 'pos_y', 'width_px', 'height_px'];

  function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }

  $('#g-csv').addEventListener('click', function () {
    var lines = [COLS.join(',')];
    visible().forEach(function (b) {
      var br = b.brief || {};
      (b.panels || []).forEach(function (p) {
        lines.push([b.boardCode, b.event, b.submittedAt, b.appTitle, b.purposeLabel || b.purpose,
          b.hazardLabel || b.hazard, b.templateLabel || b.template, b.role, b.organization,
          br.decision, br.action, br.who, br.frequency, br.missing, br.barrier, br.contact,
          p.order, p.type, p.typeName, p.category, p.hazardTag, p.title, p.need, p.dataNeeded,
          p.geography, p.freshness, p.dataAvailability, p.priority, b.layoutMode,
          p.rowIndex, p.colIndex, p.widthCols, p.heightRows, p.x, p.y, p.widthPx, p.heightPx
        ].map(q).join(','));
      });
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'adapt-stl-all-boards.csv';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  });

  /* ---------------- chrome ---------------- */

  $('#g-print').addEventListener('click', function () { window.print(); });
  $('#g-theme').addEventListener('click', function () {
    var r = document.documentElement;
    r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark';
  });

  if (CFG.collectUrl) $('#g-url').value = CFG.collectUrl;
  if (CFG.viewKey) $('#g-key').value = CFG.viewKey;
})();
