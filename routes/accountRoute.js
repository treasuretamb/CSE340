const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegistrationData, // <--- Check if this name matches the validation file
  utilities.handleErrors(accountController.registerAccount) // <--- Check if this name matches the controller
)

// Process login
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account management view (Logged in users only)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Build Update View
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.editAccountView))

// Process Account Info Update
router.post(
  "/update-info",
  utilities.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process Password Update
router.post(
  "/update-password",
  utilities.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router