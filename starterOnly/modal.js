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

// Insert span for error messages
const insertErrorMessage = (element, text = "") => {
    const span = document.createElement("span")
    span.className = "error"
    element.insertAdjacentElement("afterend", span)

    if(text.length > 0)
      span.textContent = text

    return span
}

// first and last name
const validateNames = (...names) => {
  let errorFlag = true
  for(let name of names) {
    if(name.value.length < 2) {
      const label = name.labels[0]
      const span = insertErrorMessage(name)
      const spanText = `Vous devez fournir un ${label.textContent.toLowerCase()} d'au moins deux lettres`
      span.textContent = spanText

      errorFlag = false
    }
  }

  return errorFlag
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
  let errorFlag = true
  const castNb = parseInt(nb.value)
  if(isNaN(castNb) || castNb < 0) {
    insertErrorMessage(nb, "Merci de saisir un nombre positif ou zéro")
    errorFlag = false
  }

  return errorFlag
}

// Is there a radio button checked for the city ?
const validateCity = () => {
  let errorFlag = true

  radioCheckedList = document.querySelectorAll(".city-choice:checked")
  if(!radioCheckedList.length) {
    const lastRadioNode = document.querySelectorAll(".city-choice")
    insertErrorMessage(lastRadioNode.item(lastRadioNode.length - 1), "Merci de sélectionner une ville pour participer à un tournoi")

    errorFlag = false
  }

  return errorFlag
}

// Remove previous error messages
const errorMessagesRemove = () => {
  spanError = document.querySelectorAll("span.error")
  for(let span of spanError)
    span.remove()
}

const firstName = document.getElementById("first")
const lastName = document.getElementById("last")
const numberContests = document.getElementById("quantity")

// Prevent form submission before data validation
const form = document.getElementById("form")
form.addEventListener("submit", (event) => {
  event.preventDefault()
})

const validate = () => {

  let errorFlags = []

  errorMessagesRemove()

  errorFlags.push(validateNames(firstName, lastName))
  errorFlags.push(validateNbContest(numberContests))
  errorFlags.push(validateCity())

  const errorFlag = errorFlags.some(b => b === false)

  if(!errorFlag)
    form.submit()
    
}