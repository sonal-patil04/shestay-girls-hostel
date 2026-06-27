/* ============================================================
   SHESTAY GIRLS HOSTEL — MAIN SCRIPT
   Works instantly with localStorage.
   Switch to Firebase by setting FIREBASE_ENABLED = true
   and filling in firebaseConfig below.
   ============================================================ */

/* ============================================================
   STEP 1 — Set this to true after Firebase is set up
   ============================================================ */
const FIREBASE_ENABLED = false;

/* ============================================================
   STEP 2 — Paste your Firebase config here (from Firebase Console)
   ============================================================ */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

/* ============================================================
   ROOM DATA
   ============================================================ */
const ROOMS = {
  single: {
    title: "Single Sharing Room", price: 6000, beds: 2,
    rating: "⭐⭐⭐⭐⭐ 4.8", type: "Single occupancy",
    description: "A private cosy room with attached washroom, study table, wardrobe, fast WiFi and 24x7 security.",
    facilities: ["📶 WiFi","🍽 Food","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water Supply","🚨 Panic Button"],
    popular: false
  },
  double: {
    title: "Double Sharing Room", price: 4500, beds: 4,
    rating: "⭐⭐⭐⭐⭐ 4.9", type: "Two occupants",
    description: "Our most loved room — AC, balcony access, co-working desk, high-speed WiFi, meals, and 24x7 security.",
    facilities: ["📶 High-Speed WiFi","🍽 Meals Included","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water","❄️ AC","🌿 Balcony","🚨 Panic Button"],
    popular: true
  },
  triple: {
    title: "Triple Sharing Room", price: 3500, beds: 6,
    rating: "⭐⭐⭐⭐ 4.5", type: "Three occupants",
    description: "Smart budget option. Common lounge, high-speed WiFi, home-style food and warm community.",
    facilities: ["📶 WiFi","🍽 Food Included","🧺 Laundry","📹 CCTV","⚡ Power Backup","💧 Water","🚨 Panic Button"],
    popular: false
  }
};

/* ============================================================
   SAVE RECORD — localStorage (instant) or Firebase
   ============================================================ */
function saveRecord(collectionName, data) {
  const record = {
    ...data,
    timestamp: new Date().toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" })
  };

  /* Always save to localStorage so admin can read it instantly */
  const list = JSON.parse(localStorage.getItem(collectionName) || "[]");
  list.push(record);
  localStorage.setItem(collectionName, JSON.stringify(list));

  /* Also send to Firebase if enabled */
  if (FIREBASE_ENABLED) {
    sendToFirebase(collectionName, record);
  }
}

/* Firebase write — loaded dynamically only when needed */
function sendToFirebase(col, data) {
  import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(({ getFirestore, collection, addDoc, serverTimestamp }) => {
      try {
        const app = initializeApp(firebaseConfig, "shestay-app");
        const db  = getFirestore(app);
        addDoc(collection(db, col), { ...data, timestamp: serverTimestamp() });
      } catch(e) {
        console.warn("Firebase write error:", e.message);
      }
    });
  });
}

/* ============================================================
   PAGE INIT — runs as soon as DOM is ready
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
function trackPageVisit() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "admin.html") return;
  saveRecord("visits", {
    page:     page,
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
  if (!btn) return;
  btn.addEventListener("click",   () => overlay.classList.add("open"));
  close.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
}

/* ============================================================
   NAVBAR ACTIVE LINK
   ============================================================ */
function highlightActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

/* ============================================================
   ROOM SEARCH & FILTER
   ============================================================ */
function setupRoomSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(".room-card").forEach(card => {
      card.style.display = card.querySelector("h3").textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

function setupRoomFilters() {
  const btns = document.querySelectorAll(".filter-buttons button");
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".room-card").forEach(card => {
        card.style.display = (f === "all" || card.dataset.roomType === f) ? "" : "none";
      });
      const inp = document.getElementById("searchInput");
      if (inp) inp.value = "";
    });
  });
}

/* ============================================================
   ROOM DETAILS PAGE
   ============================================================ */
function loadRoomDetails() {
  if (!document.getElementById("roomDetails")) return;
  const key  = new URLSearchParams(window.location.search).get("room") || "single";
  const room = ROOMS[key] || ROOMS.single;

  document.getElementById("roomTitle").textContent       = room.title;
  document.getElementById("roomPriceTag").textContent    = "₹" + room.price.toLocaleString() + " / Month";
  document.getElementById("roomDescription").textContent = room.description;
  document.getElementById("sideRent").textContent        = "₹" + room.price.toLocaleString() + "/mo";
  document.getElementById("sideBeds").textContent        = room.beds + " available";
  document.getElementById("sideRating").textContent      = room.rating;
  document.getElementById("sideType").textContent        = room.type;
  document.getElementById("bookNowBtn").href             = "booking.html?room=" + key;

  const fac = document.getElementById("facilityTags");
  if (fac) {
    fac.innerHTML = "";
    room.facilities.forEach(f => {
      const sp = document.createElement("span");
      sp.textContent = f;
      fac.appendChild(sp);
    });
  }

  const banner = document.getElementById("popularBanner");
  if (banner) banner.style.display = room.popular ? "block" : "none";
}

/* ============================================================
   BOOKING FORM
   ============================================================ */
function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const key = new URLSearchParams(window.location.search).get("room");
  if (key && ROOMS[key]) {
    const sel = document.getElementById("roomType");
    if (sel) sel.value = ROOMS[key].title;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    saveRecord("bookings", {
      name:          document.getElementById("fullName").value.trim(),
      email:         document.getElementById("email").value.trim(),
      phone:         document.getElementById("phone").value.trim(),
      guardianName:  document.getElementById("guardianName").value.trim(),
      guardianPhone: document.getElementById("guardianPhone").value.trim(),
      roomType:      document.getElementById("roomType").value,
      moveInDate:    document.getElementById("moveInDate").value,
      duration:      document.getElementById("duration").value,
      status:        "pending"
    });
    window.location.href = "booking-success.html";
  });
}

/* ============================================================
   LOGIN
   ============================================================ */
function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errBox   = document.getElementById("loginError");
    const users    = JSON.parse(localStorage.getItem("pgUsers") || "[]");
    const user     = users.find(u => u.email === email && u.password === password);

    if (user) {
      saveRecord("loginActivity", { email, action: "login" });
      localStorage.setItem("pgCurrentUser", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      errBox.textContent = "Invalid email or password. Please register first.";
    }
  });
}

/* ============================================================
   REGISTER
   ============================================================ */
function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const password  = document.getElementById("regPassword").value;
    const confirm   = document.getElementById("regConfirmPassword").value;
    const consent   = document.getElementById("regConsent").checked;
    const errBox    = document.getElementById("registerError");

    if (!consent)          { errBox.textContent = "Please agree to SheStay's safety rules."; return; }
    if (password !== confirm) { errBox.textContent = "Passwords do not match."; return; }

    const newUser = {
      name:          document.getElementById("regName").value.trim(),
      email:         document.getElementById("regEmail").value.trim(),
      phone:         document.getElementById("regPhone").value.trim(),
      guardianName:  document.getElementById("regGuardianName").value.trim(),
      guardianPhone: document.getElementById("regGuardianPhone").value.trim(),
      relation:      document.getElementById("regRelation").value,
      password:      password,
      status:        "pending_verification"
    };

    const users = JSON.parse(localStorage.getItem("pgUsers") || "[]");
    if (users.some(u => u.email === newUser.email)) {
      errBox.textContent = "An account with this email already exists."; return;
    }
    users.push(newUser);
    localStorage.setItem("pgUsers", JSON.stringify(users));
    saveRecord("users", { ...newUser, password: "***" }); /* don't store password in records */
    window.location.href = "login.html";
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    saveRecord("enquiries", {
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
  });
}
