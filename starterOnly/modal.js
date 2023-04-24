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

///////////////////////////////////////////////////////////////////////////////
// Modal window closing implementation

// Get the close button element
const closeBtn = document.querySelector(".close")

// Wait for close event
closeBtn.addEventListener("click", closeModal)

// close modal form
function closeModal() {
  modalbg.style.display = "none"    // Set display to none
}

///////////////////////////////////////////////////////////////////////////////
// form field format validation functions

// first and last name
const validateNames = (name) => {
// firstname and lastname must have min length of 2 characters
  return name.length >= 2       
}

// email address
// We don't use html validation feature, as email addresses are somewhat complex
// We allow only a subset of what RFC5322 defines
// To avoid server overload and possible hacking with fabulous regex:
// Wordly characters: letters of English alphabet, digits or underscores
// Doesn't allow unicode characters
// No whitespace
// No single/double quotes, alphanumeric only hostname with TLD (.*),
// But no IP address literals i.e [192.168.0.1]
// Periods(not consecutive) in local-part and domain are allowed
// As well as dashes (-) inside the domain
// As long as they don't lead or trail the string
// No comment with ()
// And of course the @ separator is mandatory
// Lengths: local-part: {2,64} chars max, domain and subdomains: {1,63} chars max each
// TLD length: {2,63}
// See https://www.abstractapi.com/guides/email-address-pattern-validation for references
//const validateEmail = (email) => {
//  if (!email.includes("@")) {
//    return false
//  }
//  
//  // first part of an email, the local part
//  const local = /fdfdf/
//
//  // second part, domain
//  const doamin = //
//}
//

// The number of contests must be a number...
// So get the type of the information returned by the form
const validateNbContest = (nb) => {
  return typeof(nb) === 'number'
}

// Is there a radio button checked for the city ?
const validateCity = () => {
  return document.querySelectorAll(".city-choice:checked").length ? true : false
}