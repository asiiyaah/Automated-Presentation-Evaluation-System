import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// PROTECT DASHBOARD + LOAD USER INFO
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userName").textContent =
      user.displayName || "User";
  }
});

// LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
