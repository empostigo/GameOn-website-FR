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
const insertErrorMessage = (element, text) => {
    const span = document.createElement("span")
    span.className = "error"
    element.insertAdjacentElement("afterend", span)

    if(text.length > 0)
      span.textContent = text

    return span
}

// Remove previous error messages
const errorMessagesRemove = () => {
  spanError = document.querySelectorAll("span.error")
  for(let span of spanError)
    span.remove()
}

// first and last name
const validateNames = (...names) => {
  let errorFlag = true

  for(let name of names) {
    if(name.value.length < 2) {
      const label = name.labels[0]
      const spanText = `Vous devez fournir un ${label.textContent.toLowerCase()} d'au moins deux lettres`
      const span = insertErrorMessage(name, spanText)

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

// Birthdate:
// Competitors must be at least 18 for now
// And of course, Maria Branyas Morera,
// born March 4, 1907 and the dean of the humanity is welcome :)

// Determine if a year is leap year
const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)

// Create a range to test years if they are leap year
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
const range = (start, stop, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

const validateBirthDate = (date) => {
  let errorFlag = true

  const minAge = 18

  const today = new Date()
  const birthDate = new Date(date.value)
  const todayYear = today.getFullYear()
  const birthYear = birthDate.getFullYear()

  let nbLeapYear = 0
  for(let y of range(todayYear, birthYear))
    if(isLeapYear(y))
      nbLeapYear++
  
  const age = 
  /*
  const maxBirthDate = new Date('1907-03-04')

  const yearDiff = today.getFullYear() - birthDate.getFullYear()
  if(yearDiff < minAge)
    if(yearDiff > minAge - 1) {
      if(today.getMonth() < birthDate.getMonth()) 
    }
*/

  console.log((today - birthDate)/(31556926*1000))
  //console.log([today, birthDate].join(" "))


  return errorFlag
}


// The number of contests must be a number...
// So get the type of the information returned by the form
// As GameOn seems to exist since 2014,
// let's say that there has been 10 contests max
const validateNbContest = (nb) => {
  let errorFlag = true

  const castNb = parseInt(nb.value)
  if(isNaN(castNb) || castNb < 0 || castNb > 10) {
    const errorMessage = "Merci de saisir un nombre positif, entre 0 et 10"
    insertErrorMessage(nb, errorMessage)
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
    const label = lastRadioNode.item(lastRadioNode.length - 1).labels[0]
    const errorMessage = "Merci de sélectionner une ville pour participer à un tournoi"
    insertErrorMessage(label, errorMessage)

    errorFlag = false
  }

  return errorFlag
}

// Validate term of use
const validateTerms = () => {
  let errorFlag = true

  const term = document.getElementById("checkbox1")
  if(!term.checked) {
    const label = term.labels[0]
    const errorMessage = "Merci d'accepter les conditions d'utilisation"
    insertErrorMessage(label, errorMessage)

    errorFlag = false
  }

  return errorFlag
}

const firstName = document.getElementById("first")
const lastName = document.getElementById("last")
const birthDate = document.getElementById("birthdate")
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
  errorFlags.push(validateTerms())
  errorFlags.push(validateBirthDate(birthDate))

  const errorFlag = errorFlags.some(b => b === false)

  if(!errorFlag)
    form.submit()
}