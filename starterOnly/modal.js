function editNav() {
  const x = document.getElementById("myTopnav")
  if (x.className === "topnav") {
    x.className += " responsive"
  } else {
    x.className = "topnav"
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground")
const modalBtn = document.querySelectorAll(".modal-btn")
const formData = document.querySelectorAll(".formData")

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal))

// launch modal form
function launchModal() {
  modalbg.style.display = "block"
}

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////////////////////////////
// Modal window closing implementation

// close modal form
function closeModal() {
  modalbg.style.display = "none" // Set display to none to close modal
}

// Get the close button element with its class "close"
const closeBtn = document.querySelector(".close")

// Wait for close event when clicking on the closing cross
closeBtn.addEventListener("click", closeModal)
// And when pressing the "Escape" key
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal()
})

/// ////////////////////////////////////////////////////////////////////////////
// form field format validation functions

// Insert error messages
// All the input fields and radio/check buttons
// have a div.formData parent which is styled
// in modal.css
// params: element with error, and error text to display
const insertErrorMessage = (element, text) => {
  // Get the element parent, which is a div.formData
  const parent = element.parentElement
  // set data-error value with error message
  parent.setAttribute("data-error", text)
  // and data-error-visible to true, which sets opacity to 1 (in ::after pseudo element)
  parent.setAttribute("data-error-visible", "true")
}

// Remove previous error messages
const errorMessagesRemove = () => {
  // run through all formData div to remove error messages
  // and set data-error-visible to false (in fact, we can set it to anything but true)
  for (let div of formData) {
    div.setAttribute("data-error", "")
    div.setAttribute("data-error-visible", "false")
  }
}

// first and last name
const validateNames = (...values) => {
  // this function use a variable number of arguments, the ...values argument is an array
  let errorFlag = true

  for (let value of values) {
    let errorMessage = ""
    const name = value.value.trim()
    if (name.includes(" ")) {
      // Spaces are not accepted in names
      const label = value.labels[0] // the labels array contains labels associated with the input
      errorMessage = `Les espaces ne sont pas acceptés dans les ${label.textContent.toLowerCase()}s`
    }

    if (name.length < 2) {
      const label = value.labels[0]
      errorMessage = `Vous devez fournir un ${label.textContent.toLowerCase()} d'au moins deux lettres`
    }

    if (errorMessage.length) {
      insertErrorMessage(value, errorMessage)
      errorFlag = false
    }
  }

  return errorFlag
}

// email address
// We allow only a subset of what RFC5322 defines
// To avoid server overload and possible hacking with fabulous regex:
// Wordly characters: letters of English alphabet, digits or underscores
// The email have to start with a letter, upper or lower case
// Doesn't allow unicode characters
// No whitespace
// No single/double quotes, alphanumeric only hostname with TLD (.*),
// But no IP address literals i.e [192.168.0.1]
// Periods(not consecutive) in local-part and domain are allowed
// As well as dashes (-) inside the domain (and local-part, but not beside dot)
// As long as they don't lead or trail the string
// No comment with ()
// And of course the @ separator is mandatory
// Lengths: local-part: {2,64} chars max, domain and subdomains: {1,63} chars max each
// TLD length: {2,63}
// Total length of the email of 7 characters min: local-part, 2 chars, the "@", x.xx pattern min for the domain
// The total length of the email string is of 254 characters max
// See https://datatracker.ietf.org/doc/html/rfc5321#section-4.5.3.1.1 for references,
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
// and https://www.regular-expressions.info/email.html
const validateEmail = (mail) => {
  let errorFlag = true

  const minEmailLength = 7
  const maxEmailLength = 254

  const email = mail.value.trim()
  let errorMessage = ""
  switch (true) {
    case email.length === 0: // No email is provided
      errorFlag = false
      errorMessage = "Merci de renseigner une adresse de messagerie"
      break

    case !email.includes("@"): // If the string doesn't contain "@", it's not an email
      errorFlag = false
      errorMessage =
        'Il semble que votre adresse de messagerie soit mal formée : il manque le caractère "@"'
      break

    // Check for minLength < email.length < maxLength
    case email.length < minEmailLength:
      errorFlag = false
      errorMessage = `Votre adresse de messagerie doit comporter au minimum ${minEmailLength} caractères`
      break

    case email.length > maxEmailLength:
      errorFlag = false
      errorMessage = `Votre adresse de messagerie doit comporter au maximum ${maxEmailLength} caractères`
      break

    // If all is okay, we can move on
    default:
      break
  }

  /*
   first part of an email, the local-part
   Square brackets [] stands for a character set
   ^[a-zA-Z]: The caret tells to look for the first character, which has to be a letter, case insensitive.
   [\w#$%&*+=]{0,62}:
          \w : alphanumeric characters (english) plus underscore
          #$%&*+= : individual characters accepted
   Curly brackets are used to specify a range of min/max characters: {min,max}
   Here, we can have a minimum of 0 to a maximum of 62 characters authorized by the preceding character set
   This part is included in a non-capturing group, and can be preceded with 0 or 1 dash, and followed by 0 or 1 dot.
   This is to avoid strings like t--est or te...st
   The entire non-capturing group can be repeated 0 or infinitly.
   [\w#$%&*+=]$: The dollar is looking for the end of the string.
   Here, we remove dots and dash as they cannot terminate local-part.
   The ^ and the $ help to avoid space characters inside the string (e.g "te st")
  */
  const local = /^[a-zA-Z](?:(?:-?[\w#$%&*+=]{1,62})*\.?)*[\w#$%&*+=]$/

  /*
   second part, domain
   Here, we use group notation with parenthesis, and peculiarly non-capturing groups
   to match the entire string: (?:...)
   (?=[\w-]{1,63}\.): the ?= token is called a "lookaround", more precisely, a "lookahead", which doesn't count for the match
   It's used for the [\w]+ character set: we need to have a letter/digit/underscore one or more times(with the plus quantifier)
   but only if it's followed by [\w-]{1,63}\. The dot is escaped, otherwise it matches for a single character
   After, there is another non-capturing group, which is more or less the same as the lookaround at the begining of the regex.
   The dash is outside the character range, and the 2nd non capturing group can be repeated 0 or infinitly (with the * quantifier)
   The first non-capturing group ending with the dot; we can match for instance t-t, t.t but not t.,  t- or t--
   Finally, there is the last part of the domain, the TLD composed with only letters in a range of {2,63}
  */
  const domain = /^(?:(?=[\w-]{1,63}\.)[\w]+(?:-[\w]{1,63})*\.)+[a-zA-Z]{2,63}$/

  // split email to check the parts
  const parts = email.split("@")
  // test if email matches the local-part and domain regexes
  if (
    (!local.test(parts[0]) || !domain.test(parts[1])) &&
    errorMessage.length === 0
  ) {
    errorFlag = false

    errorMessage =
      "Votre email ne semble pas valide, merci d'en renseigner un autre"
  }

  // if there is an error message, display it
  if (errorMessage.length) insertErrorMessage(mail, errorMessage)

  return errorFlag
}

// Birthdate:
// Competitors must be at least 18 for now
// And of course, Maria Branyas Morera,
// born March 4, 1907 and the dean of the humanity is welcome :)
// But let's give someone a chance to overtake Jeanne Calment(122 years, 164 days)
// and reach the canonical age of 123
const validateBirthDate = (date) => {
  let errorFlag = true

  if (!date.value.length) {
    insertErrorMessage(date, "Merci de renseigner une date de naissance")

    return false
  }

  const minAge = 18
  const maxAge = 123
  const today = new Date() // Create an object with the date of the day
  const todayYear = today.getFullYear() // Get the year of today
  const birthDate = new Date(date.value)
  const birthYear = birthDate.getFullYear() // Year of birthdate

  const age = todayYear - birthYear

  if (age > maxAge) {
    const errorMessage =
      "Il semble que vous ayez commis une erreur dans votre date de naissance, merci de la vérifier"
    insertErrorMessage(date, errorMessage)

    return false
  }

  if (age < minAge) errorFlag = false // Obviously, the participant is not adult

  // Check if the birtdate has already passed
  if (age === minAge) {
    // We have to check months
    const todayMonth = today.getMonth() // get month of today
    const birthMonth = birthDate.getMonth() // get the birthday month
    if (todayMonth < birthMonth) errorFlag = false // Birthday has not passed

    if (todayMonth === birthMonth) {
      // We have to check days
      const todayDay = today.getDate() // Get day of today
      const birthDay = birthDate.getDate() // get the birthday day

      if (todayDay < birthDay) errorFlag = false // The participant is not adult
    }
  }

  if (!errorFlag)
    insertErrorMessage(
      date,
      "Vous devez être majeur pour participer à un tournoi GameOn"
    )

  return errorFlag
}

// The number of contests must be a number...
// So get the type of the information returned by the form
// As GameOn seems to exist since 2014,
// let's say that there has been 10 contests max
const validateNbContest = (nb) => {
  let errorFlag = true

  const castNb = parseInt(nb.value)
  if (isNaN(castNb) || castNb < 0 || castNb > 10) {
    const errorMessage = "Merci de saisir un nombre positif, entre 0 et 10"
    insertErrorMessage(nb, errorMessage)
    errorFlag = false
  }

  return errorFlag
}

// Is there a radio button checked for the city ?
const validateCity = () => {
  let errorFlag = true

  // Get all the radio button elements
  const radioCheckedList = document.querySelectorAll(".city-choice:checked") // Return a NodeList with the elements checked
  if (!radioCheckedList.length) {
    // if there is no element in the NodeList
    const lastRadioNode = document.querySelectorAll(".city-choice") // Get all the radio button elements
    const label = lastRadioNode.item(lastRadioNode.length - 1).labels[0] // Find the label of the last radio button
    const errorMessage =
      "Merci de sélectionner une ville pour participer à un tournoi"
    insertErrorMessage(label, errorMessage) // Insert the error message after the last element

    errorFlag = false
  }

  return errorFlag
}

// Validate term of use
const validateTerms = () => {
  let errorFlag = true

  const term = document.getElementById("checkbox1") // Get the checkbox element
  if (!term.checked) {
    // If this is not accepted
    const label = term.labels[0] // Get the associated label
    const errorMessage = "Merci d'accepter les conditions d'utilisation"
    insertErrorMessage(label, errorMessage) // Insert the error message

    errorFlag = false
  }

  return errorFlag
}

// Get all the input elements
const firstName = document.getElementById("first")
const lastName = document.getElementById("last")
const email = document.getElementById("email")
const birthDate = document.getElementById("birthdate")
const numberContests = document.getElementById("quantity")

// Prevent form submission before data validation
const form = document.getElementById("form")
form.addEventListener("submit", (event) => {
  event.preventDefault()
})

// Implement our own submit function, used by validate() when all validations have passed
const submitForm = () => {
  form.style.display = "none" // Hide the form

  const message = document.querySelector(".thanks")
  message.style.display = "block" // Display the confirmation message

  const confirmBtn = document.querySelector(".btn-confirm")
  confirmBtn.style.display = "block" // Display the closing button
  confirmBtn.addEventListener("click", () => form.submit()) // submit the form
}

const validate = () => {
  errorMessagesRemove()

  let errorFlags = []

  // Validate all the inputs and the required radio/checkbox (or no)
  errorFlags.push(validateNames(firstName, lastName))
  errorFlags.push(validateEmail(email))
  errorFlags.push(validateBirthDate(birthDate))
  errorFlags.push(validateNbContest(numberContests))
  errorFlags.push(validateCity())
  errorFlags.push(validateTerms())

  // Find if there is some error ("false" value) in the errorFlags array
  const errorFlag = errorFlags.some((b) => b === false)

  if (!errorFlag) submitForm() // All is okay, so we can submit
}
