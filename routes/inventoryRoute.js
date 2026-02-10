// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')
const jwt = require("../middleware/jwtAuth")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view (PROTECTED)

router.get("/", jwt.checkAccountType, utilities.handleErrors(invController.buildManagement))

// Add classification - GET and POST (PROTECTED)
router.get("/add-classification",  jwt.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

 //Get inventory by classification (JSON) - for AJAX
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.post(
  "/add-classification",
  jwt.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
// Add inventory - GET and POST (PROTECTED)
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

router.post(
  "/add-inventory",
  jwt.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)
 //Edit inventory - GET (PROTECTED)
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))

// Update inventory - POST (PROTECTED)
router.post(
  "/update",
  jwt.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete inventory - GET (PROTECTED)
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirm))

// Delete inventory - POST (PROTECTED)
router.post(
  "/delete",
  jwt.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

//Intentional error route for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;