const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')

// Route to Management View
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to get inventory as JSON for management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Routes for Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification", 
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Routes for Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Classification and Detail views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Delete Routes
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmation))
router.post("/delete/", utilities.handleErrors(invController.deleteItem))

// Error trigger for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router