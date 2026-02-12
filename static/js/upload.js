/* =========================
   FIREBASE AUTH PROTECTION
========================= */

import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    const emailEl = document.getElementById("userEmail");
    const nameEl = document.getElementById("userName");

    if (emailEl) emailEl.textContent = user.email;
    if (nameEl) nameEl.textContent = user.displayName || "User";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};


/* =========================
   VIDEO UPLOAD LOGIC
========================= */

const form = document.getElementById("uploadForm");
const videoInput = document.getElementById("videoInput");
const previewContainer = document.getElementById("previewContainer");
const videoPreview = document.getElementById("videoPreview");
const fileNameText = document.getElementById("fileName");
const fileUI = document.getElementById("fileUI");
const removeFileBtn = document.getElementById("removeFile");
const infoBtn = document.getElementById("infoBtn");
const infoPanel = document.getElementById("infoPanel");

/* VIDEO PREVIEW */
if (videoInput) {
  videoInput.addEventListener("change", () => {
    const file = videoInput.files[0];
    if (!file) return;

    const videoURL = URL.createObjectURL(file);

    videoPreview.src = videoURL;
    fileNameText.textContent = file.name;

    previewContainer.style.display = "block";
    fileUI.style.display = "none";

    setTimeout(() => {
  const formBottom = form.getBoundingClientRect().bottom + window.scrollY;

  window.scrollTo({
    top: formBottom - window.innerHeight + 120, 
    behavior: "smooth"
  });
}, 300);

  });
}

/* REMOVE CURRENT VIDEO */
if (removeFileBtn) {
  removeFileBtn.addEventListener("click", () => {
    videoInput.value = "";
    videoPreview.src = "";
    fileNameText.textContent = "";

    previewContainer.style.display = "none";
    fileUI.style.display = "block";
  });
}


/* =========================
   INFO BUTTON TOGGLE
========================= */

if (infoBtn) {
  infoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    infoPanel.classList.toggle("open");
  });
}

document.addEventListener("click", (e) => {
  if (
    infoPanel &&
    !infoPanel.contains(e.target) &&
    e.target !== infoBtn
  ) {
    infoPanel.classList.remove("open");
  }
});


/* =======================
   PROFILE TOGGLE
======================= */

const profilePanel = document.getElementById("profilePanel");

window.toggleProfile = function () {
  if (!profilePanel) return;
  profilePanel.classList.toggle("open");
};

document.addEventListener("click", (e) => {
  if (!profilePanel) return;

  const clickedInsideProfile = profilePanel.contains(e.target);
  const clickedProfileIcon = e.target.closest(".profile-icon");

  if (!clickedInsideProfile && !clickedProfileIcon) {
    profilePanel.classList.remove("open");
  }
});
