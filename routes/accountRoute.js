const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require("../utilities/account-validation")

// Management View
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

module.exports = router