const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require('../utilities/review-validation')
const jwt = require("../middleware/jwtAuth")

// Add review - GET (must be logged in)
router.get("/add/:inv_id", jwt.checkJWTToken, utilities.handleErrors(reviewController.buildAddReview))

// Add review - POST (must be logged in)
router.post("/add", jwt.checkJWTToken, reviewValidate.reviewRules(), reviewValidate.checkReviewData, utilities.handleErrors(reviewController.addReview))

// My reviews - GET (must be logged in)
router.get("/my-reviews", jwt.checkJWTToken, utilities.handleErrors(reviewController.buildMyReviews))

// Edit review - GET (must be logged in)
router.get("/edit/:review_id", jwt.checkJWTToken, utilities.handleErrors(reviewController.buildEditReview))

// Edit review - POST (must be logged in)
router.post("/update", jwt.checkJWTToken, reviewValidate.reviewRules(), reviewValidate.checkReviewData, utilities.handleErrors(reviewController.updateReview))

// Delete review - GET (must be logged in)
router.get("/delete/:review_id", jwt.checkJWTToken, utilities.handleErrors(reviewController.deleteReview))

// Admin review management - GET (Employee/Admin only)
router.get("/admin", jwt.checkAccountType, utilities.handleErrors(reviewController.buildAdminReviews))

// Approve review - GET (Employee/Admin only)
router.get("/approve/:review_id", jwt.checkAccountType, utilities.handleErrors(reviewController.approveReview))

// Admin delete review - GET (Employee/Admin only)
router.get("/admin-delete/:review_id", jwt.checkAccountType, utilities.handleErrors(reviewController.adminDeleteReview))

module.exports = router
