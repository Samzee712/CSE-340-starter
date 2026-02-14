const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* Review Data Validation Rules */
validate.reviewRules = () => {
  return [
    body("review_rating")
      .trim()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please select a rating from 1 to 5 stars."),

    body("review_text")
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters.")
      .escape(),

    body("inv_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Invalid vehicle ID."),
  ]
}

/* Check review data */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_rating, review_text } = req.body || {}
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const invModel = require("../models/inventory-model")
    const vehicle = await invModel.getInventoryByInventoryId(inv_id)
    const vehicleName = vehicle ? `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}` : "Vehicle"
    
    res.render("review/add-review", {
      errors,
      title: `Review: ${vehicleName}`,
      nav,
      inv_id,
      vehicleName,
      review_rating,
      review_text
    })
    return
  }
  next()
}

module.exports = validate
