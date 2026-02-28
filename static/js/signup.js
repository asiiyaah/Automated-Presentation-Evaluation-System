import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-form");
  const googleBtn = document.getElementById("googleSignupBtn");

  // EMAIL + PASSWORD SIGNUP
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = form.querySelector('input[name="fullname"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const confirmPassword = form.querySelector('input[name="confirm_password"]').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        // Save name to Firebase profile
        return updateProfile(cred.user, {
          displayName: fullName
        });
      })
      .then(() => {
        window.location.href = "/new-user";
      })
      .catch((error) => {
        alert(error.message);
      });
  });

  // GOOGLE SIGNUP
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then(() => {
        window.location.href = "/new-user";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});

     //AUTO SCROLL ON INPUT FOCUS
  

  const signupForm = document.querySelector(".signup-form");
  const inputs = signupForm.querySelectorAll("input");

  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      signupForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  });
