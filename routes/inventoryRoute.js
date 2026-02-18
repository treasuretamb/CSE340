const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')

// Route to Management View (Protected)
router.get("/", utilities.checkAdmin, utilities.handleErrors(invController.buildManagement))

// Route to get inventory as JSON for management view (Protected)
router.get("/getInventory/:classification_id", utilities.checkAdmin, utilities.handleErrors(invController.getInventoryJSON))

// Routes for Add Classification (Protected)
router.get("/add-classification", utilities.checkAdmin, utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification", 
  utilities.checkAdmin,
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Routes for Add Inventory (Protected)
router.get("/add-inventory", utilities.checkAdmin, utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/add-inventory",
  utilities.checkAdmin,
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to Build Edit Inventory View (Protected)
router.get("/edit/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.editInventoryView))

// Route to Process Update Inventory (Protected)
router.post(
  "/update/",
  utilities.checkAdmin,
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to Build Delete Confirmation View (Protected)
router.get("/delete/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.buildDeleteConfirmation))

// Route to Process Delete (Protected)
router.post("/delete/", utilities.checkAdmin, utilities.handleErrors(invController.deleteItem) )

// Classification and Detail views (PUBLIC - No checkAdmin)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Error trigger for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router