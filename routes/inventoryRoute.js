const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory item detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// --- ENHANCEMENT ROUTES ---

// Process review submission with validation
router.post(
  "/add-review",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// --- MANAGEMENT ROUTES ---
router.get("/", utilities.checkAdmin, utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.checkAdmin, utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", utilities.checkAdmin, utilities.handleErrors(invController.addClassification))

router.get("/add-inventory", utilities.checkAdmin, utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", utilities.checkAdmin, utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", utilities.checkAdmin, utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.buildDeleteConfirmation))
router.post("/delete/", utilities.checkAdmin, utilities.handleErrors(invController.deleteItem))

// Route to trigger an intentional error
router.get("/error", utilities.handleErrors(invController.triggerError))

module.exports = router