const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)

// Check if data exists
  if (!data || data.length === 0) {
    const error = new Error('No vehicles found for this classification.')
    error.status = 404
    return next(error)
  }  

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

 /* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const vehicle = await invModel.getInventoryByInventoryId(inv_id)

// Check if vehicle exists
  if (!vehicle) {
    const error = new Error('Vehicle not found.')
    error.status = 404
    return next(error)
  }  

  const detail = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

/* ***************************
 *  Intentional Error 
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const error = new Error('This is an intentional 500 error for testing.')
  error.status = 500
  throw error
}
module.exports = invCont