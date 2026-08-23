/* ============================================================
   RSVP STORAGE — Firebase Firestore
   The ONLY file that needs a one-time setup. Both
   LeensWeddingInvitation.html (guests submit their name) and
   admin.html (the bride views the list) load this same file, so
   credentials only go in once, here.

   Why this instead of running a server: this project is meant to be
   delivered as two plain links (the invitation + the admin page) that
   just work, forever, with nobody keeping a terminal open anywhere.
   That means the guest list has to live somewhere reachable directly
   from a static HTML file — a small always-on cloud database, not a
   server we'd have to run ourselves. Firestore's free tier is exactly
   that: no server, no hosting bill, no maintenance.

   SETUP (about 5 minutes, do this once):
     1. Go to https://console.firebase.google.com, sign in with any
        Google account, click "Add project" (any name is fine, e.g.
        "leen-tareq-wedding") and create it.
     2. In the left sidebar: Build -> Firestore Database -> Create
        database -> "Start in production mode" -> pick any region ->
        Enable.
     3. Click the gear icon (top left, next to "Project Overview") ->
        Project settings -> General tab -> scroll to "Your apps" ->
        click the "</>" (Web) icon -> give it any nickname -> Register
        app. It shows a firebaseConfig object — copy those six values
        into the object below, replacing the placeholders.
     4. Back in Firestore -> the "Rules" tab -> replace everything with:

          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              match /rsvps/{doc} {
                allow create: if true;
                allow read: if true;
                allow update, delete: if false;
              }
            }
          }

        then click "Publish". (This lets guests add their name and lets
        the admin page read the list — nobody can edit or delete an
        entry once it's saved.)

   That's it. From here on, LeensWeddingInvitation.html and admin.html
   are both plain static files — host them anywhere over http/https and
   they'll work. One real limitation: this file is a <script
   type="module">, and browsers refuse to load a module script over a
   bare file:// path (a CORS restriction with no workaround) — so double-
   clicking the HTML file directly will NOT work, even after everything
   above is set up correctly. Testing needs an actual http:// URL — any
   static file server does it, e.g. from this folder:
     npx serve .
   then open the http://localhost:... URL it prints.
   ============================================================ */

// Loaded straight from Firebase's CDN — no npm/bundler involved, so the
// import specifiers have to be full URLs like this rather than the bare
// "firebase/app" style the Firebase console's own snippet shows you
// (that style only resolves inside a bundled/npm project; a plain
// browser <script type="module"> can't look up a bare package name on
// its own). Analytics isn't imported here at all — this project only
// needs Firestore (the database), not the separate Analytics product.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your real project's config (from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCm3Fz_4bNnZso3OiEa_EGif_X9spdvWdM",
  authDomain: "leen-tareq-wedding.firebaseapp.com",
  projectId: "leen-tareq-wedding",
  storageBucket: "leen-tareq-wedding.firebasestorage.app",
  messagingSenderId: "349191050991",
  appId: "1:349191050991:web:7fe742aa7d6eb087052d1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// window is the bridge between this module script and the plain
// (non-module) scripts on each page — LeensWeddingInvitation.js calls
// window.submitRSVP(), admin.html calls window.fetchRSVPs().
window.submitRSVP = function (name) {
  return addDoc(collection(db, "rsvps"), {
    name,
    timestamp: new Date().toISOString()
  });
};

window.fetchRSVPs = function () {
  return getDocs(collection(db, "rsvps")).then((snapshot) => {
    const names = [];
    snapshot.forEach((doc) => names.push(doc.data().name));
    return names;
  });
};
