import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYLEbi_v2zct5LFgZqDrx0WK_atgUWPXk",
  authDomain: "automated-ppt-evaluator.firebaseapp.com",
  projectId: "automated-ppt-evaluator",
  storageBucket: "automated-ppt-evaluator.firebasestorage.app",
  messagingSenderId: "667930014326",
  appId: "1:667930014326:web:90d6ce9ae392e0e034a557"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
