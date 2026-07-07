/* ============================================================
   SHESTAY GIRLS HOSTEL — MAIN SCRIPT
   Backend: Firebase Firestore + Authentication
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ============================================================
   FIREBASE CONFIG — shestay-hostel project
   ============================================================ */
const firebaseConfig = {
  apiKey:            "AIzaSyDBrnfcBlLI9yBq7Ht0vJQo9SQgioJkafM",
  authDomain:        "shestay-hostel.firebaseapp.com",
  projectId:         "shestay-hostel",
  storageBucket:     "shestay-hostel.firebasestorage.app",
  messagingSenderId: "383576925428",
  appId:             "1:383576925428:web:7bd92a6b6408bfedc62aa1"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

/* ============================================================
   ROOM DATA
   ============================================================ */
const ROOMS = {
  single: {
    title:"Single Sharing Room", price:6000, beds:2,
    rating:"⭐⭐⭐⭐⭐ 4.8", type:"Single occupancy",
    description:"A private cosy room with attached washroom, study table, wardrobe, fast WiFi and 24x7 security. Mess plan available separately at ₹5,000/month.",
    facilities:["📶 WiFi","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water Supply","🚨 Panic Button","🍽 Mess Plan Optional"],
    popular:false
  },
  double: {
    title:"Double Sharing Room", price:4500, beds:4,
    rating:"⭐⭐⭐⭐⭐ 4.9", type:"Two occupants",
    description:"Our most loved room — balcony access, co-working desk, high-speed WiFi and 24x7 security. Mess plan available separately at ₹5,000/month.",
    facilities:["📶 High-Speed WiFi","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water","🌿 Balcony","🚨 Panic Button","🍽 Mess Plan Optional"],
    popular:true
  },
  triple: {
    title:"Triple Sharing Room", price:4000, beds:6,
    rating:"⭐⭐⭐⭐ 4.5", type:"Three occupants",
    description:"Smart budget option with common lounge, high-speed WiFi and warm community. Mess plan available separately at ₹5,000/month.",
    facilities:["📶 WiFi","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water","🚨 Panic Button","🍽 Mess Plan Optional"],
    popular:false
  }
};

/* ============================================================
   SAVE TO FIRESTORE — saves to cloud + localStorage backup
   ============================================================ */
async function saveRecord(col, data) {
  const record = { ...data, timestamp: serverTimestamp() };

  /* Always save to localStorage as backup */
  const localRecord = { ...data, timestamp: new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) };
  const list = JSON.parse(localStorage.getItem(col)||"[]");
  list.push(localRecord);
  localStorage.setItem(col, JSON.stringify(list));

  /* Save to Firestore cloud */
  try {
    await addDoc(collection(db, col), record);
    console.log(`✅ Saved to Firestore: ${col}`);
  } catch(e) {
    console.warn(`⚠️ Firestore save failed for ${col}:`, e.message);
  }
}

/* ============================================================
   PAGE INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  trackPageVisit();
  setupSOS();
  highlightActiveNavLink();
  setupRoomSearch();
  setupRoomFilters();
  loadRoomDetails();
  setupBookingForm();
  setupLoginForm();
  setupRegisterForm();
  setupContactForm();
});

/* ============================================================
   TRACK PAGE VISIT
   ============================================================ */
async function trackPageVisit() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if(page === "admin.html") return;
  await saveRecord("visits", {
    page,
    referrer: document.referrer || "direct",
    time:     new Date().toLocaleString("en-IN")
  });
}

/* ============================================================
   SOS MODAL
   ============================================================ */
function setupSOS() {
  const btn     = document.getElementById("sosBtn");
  const overlay = document.getElementById("sosOverlay");
  const close   = document.getElementById("sosClose");
  if(!btn) return;
  btn.addEventListener("click",   () => overlay.classList.add("open"));
  close.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", e => { if(e.target===overlay) overlay.classList.remove("open"); });
}

/* ============================================================
   NAVBAR ACTIVE LINK
   ============================================================ */
function highlightActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if(link.getAttribute("href") === current) link.classList.add("active");
  });
}

/* ============================================================
   ROOM SEARCH & FILTER
   ============================================================ */
function setupRoomSearch() {
  const input = document.getElementById("searchInput");
  if(!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(".room-card").forEach(card => {
      card.style.display = card.querySelector("h3").textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

function setupRoomFilters() {
  const btns = document.querySelectorAll(".filter-buttons button");
  if(!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".room-card").forEach(card => {
        card.style.display = (f==="all" || card.dataset.roomType===f) ? "" : "none";
      });
      const inp = document.getElementById("searchInput");
      if(inp) inp.value = "";
    });
  });
}

/* ============================================================
   ROOM DETAILS PAGE
   ============================================================ */
function loadRoomDetails() {
  if(!document.getElementById("roomDetails")) return;
  const key  = new URLSearchParams(window.location.search).get("room") || "single";
  const room = ROOMS[key] || ROOMS.single;

  const IMAGES = { single:"images/room1.jpg", double:"images/room2.jpg", triple:"images/room3.jpg" };

  document.getElementById("roomTitle").textContent       = room.title;
  document.getElementById("roomPriceTag").textContent    = "₹" + room.price.toLocaleString() + " / Month";
  document.getElementById("roomDescription").textContent = room.description;
  document.getElementById("sideRent").textContent        = "₹" + room.price.toLocaleString() + "/mo";
  document.getElementById("sideBeds").textContent        = room.beds + " available";
  document.getElementById("sideRating").textContent      = room.rating;
  document.getElementById("sideType").textContent        = room.type;
  document.getElementById("bookNowBtn").href             = "booking.html?room=" + key;

  const img = document.getElementById("roomImage");
  if(img) img.src = IMAGES[key] || "images/room1.jpg";

  const fac = document.getElementById("facilityTags");
  if(fac) {
    fac.innerHTML = "";
    room.facilities.forEach(f => {
      const sp = document.createElement("span");
      sp.textContent = f;
      fac.appendChild(sp);
    });
  }

  const banner = document.getElementById("popularBanner");
  if(banner) banner.style.display = room.popular ? "block" : "none";
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if(!form) return;

  const key = new URLSearchParams(window.location.search).get("room");
  if(key && ROOMS[key]) {
    const sel = document.getElementById("roomType");
    if(sel) sel.value = ROOMS[key].title;
  }

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Saving...";
    btn.disabled = true;

    await saveRecord("bookings", {
      name:          document.getElementById("fullName").value.trim(),
      email:         document.getElementById("email").value.trim(),
      phone:         document.getElementById("phone").value.trim(),
      guardianName:  document.getElementById("guardianName").value.trim(),
      guardianPhone: document.getElementById("guardianPhone").value.trim(),
      roomType:      document.getElementById("roomType").value,
      moveInDate:    document.getElementById("moveInDate").value,
      duration:      document.getElementById("duration").value,
      messPlan:      document.getElementById("messOpt") ? document.getElementById("messOpt").value : "No",
      status:        "pending"
    });

    window.location.href = "booking-success.html";
  });
}

/* ============================================================
   LOGIN — Firebase Auth
   ============================================================ */
function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if(!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errBox   = document.getElementById("loginError");
    const btn      = form.querySelector("button[type=submit]");

    btn.textContent = "Logging in...";
    btn.disabled = true;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await saveRecord("loginActivity", { email, uid: cred.user.uid, action: "login" });
      localStorage.setItem("pgCurrentUser", JSON.stringify({ email, uid: cred.user.uid }));
      window.location.href = "index.html";
    } catch(err) {
      errBox.textContent = "Invalid email or password. Please register first.";
      btn.textContent = "Login →";
      btn.disabled = false;
    }
  });
}

/* ============================================================
   REGISTER — Firebase Auth + Firestore
   ============================================================ */
function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  if(!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const password  = document.getElementById("regPassword").value;
    const confirm   = document.getElementById("regConfirmPassword").value;
    const consent   = document.getElementById("regConsent").checked;
    const errBox    = document.getElementById("registerError");
    const btn       = form.querySelector("button[type=submit]");

    if(!consent)             { errBox.textContent = "Please agree to SheStay's safety rules."; return; }
    if(password !== confirm) { errBox.textContent = "Passwords do not match."; return; }

    btn.textContent = "Creating account...";
    btn.disabled = true;

    const email = document.getElementById("regEmail").value.trim();

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await saveRecord("users", {
        name:          document.getElementById("regName").value.trim(),
        email,
        phone:         document.getElementById("regPhone").value.trim(),
        guardianName:  document.getElementById("regGuardianName").value.trim(),
        guardianPhone: document.getElementById("regGuardianPhone").value.trim(),
        relation:      document.getElementById("regRelation").value,
        uid:           cred.user.uid,
        status:        "pending_verification"
      });

      window.location.href = "login.html";
    } catch(err) {
      if(err.code === "auth/email-already-in-use") {
        errBox.textContent = "An account with this email already exists.";
      } else {
        errBox.textContent = "Registration failed. Please try again.";
      }
      btn.textContent = "Create My Account →";
      btn.disabled = false;
    }
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if(!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Sending...";
    btn.disabled = true;

    await saveRecord("enquiries", {
      name:    document.getElementById("contactName").value.trim(),
      email:   document.getElementById("contactEmail").value.trim(),
      phone:   document.getElementById("contactPhone").value.trim(),
      subject: document.getElementById("contactSubject")?.value || "",
      message: document.getElementById("contactMessage").value.trim(),
      status:  "unread"
    });

    const box = document.getElementById("contactSuccess");
    box.textContent = "✅ Message received! Our team will respond within 24 hours.";
    box.style.display = "block";
    form.reset();
    btn.textContent = "Submit";
    btn.disabled = false;
  });
}
