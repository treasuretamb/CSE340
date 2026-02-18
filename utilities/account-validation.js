const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Please provide a first name."),
    body("account_lastname").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Please provide a last name."),
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.getAccountByEmail(account_email)
      if (emailExists){ throw new Error("Email exists. Please log in or use different email")}
    }),
    body("account_password").trim().notEmpty().isStrongPassword({
      minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    }).withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check Registration Data
 * ***************************** */
validate.checkRegistrationData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required."),
    body("account_password").trim().notEmpty().withMessage("Password is required."),
  ]
}

/* ******************************
 * Check Login Data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Account Update Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Please provide a first name."),
    body("account_lastname").trim().escape().notEmpty().isLength({ min: 1 }).withMessage("Please provide a last name."),
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.")
    .custom(async (account_email, { req }) => {
      const account_id = req.body.account_id
      const account = await accountModel.getAccountById(account_id)
      if (account_email !== account.account_email) {
        const emailExists = await accountModel.getAccountByEmail(account_email)
        if (emailExists) { throw new Error("Email exists. Please use a different email.") }
      }
    }),
  ]
}

/* **********************************
 * Password Update Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    body("account_password").trim().notEmpty().isStrongPassword({
      minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    }).withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check Update Data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
}

module.exports = validate