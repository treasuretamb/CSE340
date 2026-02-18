const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Default route for /account/
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Route to build the account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.editAccountView))

module.exports = router