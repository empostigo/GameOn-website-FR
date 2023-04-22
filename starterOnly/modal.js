function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// Modal window closing implementation

// Get the close button element
const closeBtn = document.querySelector(".close")

// Wait for close event
closeBtn.addEventListener("click", closeModal)

// close modal form
function closeModal() {
  modalbg.style.display = "none"    // Set display to none
}

