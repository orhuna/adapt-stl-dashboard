/**
 * ADAPT-STL Design Studio — free submission collector
 * =====================================================
 * Paste this whole file into a Google Apps Script project that is bound to a
 * Google Sheet (Extensions > Apps Script from inside the sheet), then deploy it
 * as a Web app with:
 *
 *     Execute as:      Me
 *     Who has access:  Anyone
 *
 * Copy the resulting .../exec URL into config.js as `collectUrl`.
 * See DEPLOY.md for the click-by-click version.
 *
 * It writes two tabs, created automatically on first submission:
 *   "boards" — one row per submitted design
 *   "panels" — one row per panel, ready for analysis in R or pandas
 */

var BOARD_HEADERS = [
  'received_at', 'board_code', 'event', 'schema', 'started_at', 'submitted_at',
  'app_title', 'purpose', 'hazard', 'template', 'layout_mode', 'panel_count',
  'role', 'organization',
  'decision', 'action', 'audience', 'open_frequency', 'missing_data', 'barrier', 'contact',
  'user_agent'
];

var PANEL_HEADERS = [
  'received_at', 'board_code', 'event', 'submitted_at', 'app_title',
  'purpose', 'hazard', 'template', 'layout_mode', 'role', 'organization',
  'decision', 'action', 'audience', 'open_frequency', 'missing_data', 'barrier', 'contact',
  'panel_order', 'panel_type', 'panel_type_name', 'panel_category', 'panel_hazard_tag',
  'panel_title', 'need_text', 'data_needed', 'geography', 'freshness',
  'data_availability', 'priority',
  'row_index', 'col_index',
  'width_cols', 'height_rows', 'pos_x', 'pos_y', 'width_px', 'height_px', 'surface_width_px'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = JSON.parse(e.postData.contents);
    var now = new Date();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var b = d.brief || {};
    var panels = d.panels || [];

    var boards = tab_(ss, 'boards', BOARD_HEADERS);
    boards.appendRow([
      now, d.boardCode, d.event, d.schema, d.startedAt, d.submittedAt,
      d.appTitle, d.purposeLabel || d.purpose, d.hazardLabel || d.hazard,
      d.templateLabel || d.template, d.layoutMode, panels.length,
      d.role, d.organization,
      b.decision, b.action, b.who, b.frequency, b.missing, b.barrier, b.contact,
      d.userAgent
    ]);

    var ptab = tab_(ss, 'panels', PANEL_HEADERS);
    var base = [
      now, d.boardCode, d.event, d.submittedAt, d.appTitle,
      d.purposeLabel || d.purpose, d.hazardLabel || d.hazard,
      d.templateLabel || d.template, d.layoutMode, d.role, d.organization,
      b.decision, b.action, b.who, b.frequency, b.missing, b.barrier, b.contact
    ];
    var rows = panels.map(function (p) {
      return base.concat([
        p.order, p.type, p.typeName, p.category, p.hazardTag,
        p.title, p.need, p.dataNeeded, p.geography, p.freshness,
        p.dataAvailability, p.priority,
        p.rowIndex, p.colIndex,
        p.widthCols, p.heightRows, p.x, p.y, p.widthPx, p.heightPx, d.surfaceWidthPx
      ]);
    });
    if (rows.length) {
      ptab.getRange(ptab.getLastRow() + 1, 1, rows.length, PANEL_HEADERS.length).setValues(rows);
    }

    // Keep the raw JSON too, so nothing is ever lost to a schema change.
    var raw = tab_(ss, 'raw_json', ['received_at', 'board_code', 'json']);
    raw.appendRow([now, d.boardCode, JSON.stringify(d)]);

    return json_({ ok: true, boardCode: d.boardCode, panels: panels.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var n = ss.getSheetByName('boards') ? ss.getSheetByName('boards').getLastRow() - 1 : 0;
  return json_({ ok: true, service: 'ADAPT-STL collector', boardsReceived: Math.max(0, n) });
}

function tab_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
