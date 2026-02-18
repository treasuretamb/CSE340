const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword = await bcrypt.hashSync(account_password, 10)
  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
  if (regResult) {
    req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", { title: "Login", nav, errors: null })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", { title: "Registration", nav, errors: null })
  }
}

/* ****************************************
* Process Login
* *************************************** */
async function accountLogin(req, res, next) { // Added 'next' here
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", { 
      title: "Login", 
      nav, 
      errors: null, 
      account_email 
    })
    return
  }

  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      // THIS WAS MISSING: Handle the case where the password doesn't match
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email 
      })
    }
  } catch (error) {
    // Returning an Error object doesn't tell Express to do anything.
    // Use next(error) to trigger the error handler middleware.
    return next(error) 
  }
}

/* ****************************************
* Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
* Deliver account update view
* *************************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: account_id
  })
}

/* ****************************************
* Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `Information updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Update failed.")
    res.status(501).render("account/update-account", { title: "Edit Account", nav, errors: null, account_firstname, account_lastname, account_email, account_id })
  }
}

/* ****************************************
* Process Password Update
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  let hashedPassword = await bcrypt.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  if (updateResult) {
    req.flash("notice", `Password updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed.")
    res.status(501).render("account/update-account", { title: "Edit Account", nav, errors: null, account_id })
  }
}

/* ****************************************
 * Process logout
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin,
  buildManagement, 
  editAccountView, 
  updateAccount, 
  updatePassword, 
  accountLogout 
}