const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Default route for /account/
// Uses checkLogin to ensure only logged-in users see their profile
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router