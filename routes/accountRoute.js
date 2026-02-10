const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const jwt = require("../middleware/jwtAuth")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default account route - Account Management (MUST BE LOGGED IN)
router.get(
  "/", 
  jwt.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountManagement)
)

// Account update view (MUST BE LOGGED IN)
router.get(
  "/update/:account_id",
  jwt.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account update
router.post(
  "/update",
  jwt.checkJWTToken,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/change-password",
  jwt.checkJWTToken,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router
