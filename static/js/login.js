import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const googleBtn = document.getElementById("googleLoginBtn");

  // EMAIL + PASSWORD LOGIN
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "new-user.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });

  // GOOGLE LOGIN
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then(() => {
        window.location.href = "new-user.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});
