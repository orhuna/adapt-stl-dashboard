/* ============================================================
   ADAPT-STL Design Studio — facilitator configuration
   Edit this file only. Nothing else needs to change.
   ============================================================ */

window.ADAPT_CONFIG = {
  /* Event label shown nowhere critical, but stored with every submission. */
  eventName: 'Saint Louis Forum 2026',

  /* WHERE SUBMISSIONS GO -------------------------------------
     Leave collectUrl as an empty string to run fully offline:
     "Submit" then saves a JSON + CSV file to the participant's
     own device and they hand it to a facilitator.

     To collect centrally, paste an endpoint that accepts a POST
     with a JSON body — e.g. a Google Apps Script web app URL, a
     Formspree/Basin endpoint, an Airtable/Sheets webhook, or your
     own ArcGIS/Survey123 relay. See FACILITATOR-GUIDE.md.        */
  collectUrl: '',

  /* If true, participants also get a file download after a
     successful POST (useful as a belt-and-braces backup). */
  alwaysDownload: false,
};
