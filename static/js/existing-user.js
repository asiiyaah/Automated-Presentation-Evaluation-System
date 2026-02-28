import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =========================
   AUTH PROTECTION
========================== */

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    const nameElement = document.getElementById("userName");
    const emailElement = document.getElementById("userEmail");

    if (nameElement) {
      nameElement.textContent = user.displayName || "User";
    }

    if (emailElement) {
      emailElement.textContent = user.email;
    }

  } else {
    // Not logged in → redirect to login
    window.location.href = "/login";
  }
});


/* =========================
   SIDEBAR TOGGLE
========================== */

window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  const profile = document.getElementById("profilePanel");

  const isOpen = sidebar.classList.contains("active");

  // Close both first
  sidebar.classList.remove("active");
  profile.classList.remove("active");

  // Open only if it was closed
  if (!isOpen) {
    sidebar.classList.add("active");
  }
};


/* =========================
   PROFILE PANEL TOGGLE
========================== */

window.toggleProfile = function () {
  const sidebar = document.getElementById("sidebar");
  const profile = document.getElementById("profilePanel");

  const isOpen = profile.classList.contains("active");

  // Close both first
  sidebar.classList.remove("active");
  profile.classList.remove("active");

  // Open only if it was closed
  if (!isOpen) {
    profile.classList.add("active");
  }
};

/* =========================
   LOGOUT FUNCTION
========================== */

window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "/login";
    })
    .catch((error) => {
      alert(error.message);
    });
};