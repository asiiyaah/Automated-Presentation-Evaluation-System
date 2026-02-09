document.addEventListener("DOMContentLoaded", () => {

  // PASSWORD EYE TOGGLE
  document.querySelectorAll(".eye").forEach((eye) => {
    eye.addEventListener("click", () => {
      const inputId = eye.dataset.target;
      const input = document.getElementById(inputId);

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        eye.src = "../static/assests/Eye off.svg";
      } else {
        input.type = "password";
        eye.src = "../static/assests/Eye.svg";
      }
    });
  });

});
