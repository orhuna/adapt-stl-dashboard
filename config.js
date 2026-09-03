/* ============================================================
   ADAPT-STL Design Studio — facilitator configuration
   Edit this file only. Nothing else needs to change.
   ============================================================ */

window.ADAPT_CONFIG = {
  /* Event label stored with every submission. */
  eventName: 'Saint Louis Forum 2026',

  /* WHERE SUBMISSIONS GO -------------------------------------
     Leave collectUrl as an empty string to run fully offline:
     "Submit" then saves a JSON + CSV file to the participant's
     own device and they hand it to a facilitator.

     To collect centrally, paste the /exec URL of the Google Apps
     Script web app described in DEPLOY.md (or any endpoint that
     accepts a POST with a JSON body — Formspree, Basin, an
     Airtable webhook, your own relay).                          */
  collectUrl: '',

  /* 'cors'    — normal. The app can tell whether the POST worked
                 and falls back to a device download if it didn't.
     'no-cors' — fire-and-forget. Use this ONLY if submissions are
                 landing in your sheet but the app still shows the
                 "could not reach the server" message. In this mode
                 the app cannot detect failures, so set
                 alwaysDownload: true as a safety net.            */
  collectMode: 'cors',

  /* If true, participants also get a file download after a
     successful POST (belt-and-braces backup). */
  alwaysDownload: false,
};
