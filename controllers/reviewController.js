const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* Build add review view */
reviewCont.buildAddReview = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const vehicle = await invModel.getInventoryByInventoryId(inv_id)
  
  if (!vehicle) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv")
  }
  
  if (res.locals.loggedin) {
    const hasReviewed = await reviewModel.hasUserReviewed(inv_id, res.locals.accountData.account_id)
    if (hasReviewed) {
      req.flash("notice", "You have already reviewed this vehicle.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }
  }
  
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  
  res.render("./review/add-review", {
    title: `Review: ${vehicleName}`,
    nav,
    errors: null,
    inv_id: vehicle.inv_id,
    vehicleName
  })
}

/* Process add review */
reviewCont.addReview = async function (req, res) {
  const { inv_id, review_rating, review_text } = req.body
  const account_id = res.locals.accountData.account_id
  
  let nav = await utilities.getNav()
  
  const hasReviewed = await reviewModel.hasUserReviewed(inv_id, account_id)
  if (hasReviewed) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  
  const result = await reviewModel.addReview(inv_id, account_id, review_rating, review_text)
  
  if (result) {
    req.flash("notice", "Thank you for your review! It will be posted after admin approval.")
    // Redirect user to their reviews so they see the success message
    res.redirect(`/review/my-reviews`)
  } else {
    req.flash("notice", "Sorry, submitting your review failed.")
    const vehicle = await invModel.getInventoryByInventoryId(inv_id)
    const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    res.status(500).render("./review/add-review", {
      title: `Review: ${vehicleName}`,
      nav,
      errors: null,
      inv_id,
      vehicleName,
      review_rating,
      review_text
    })
  }
}

/* Build my reviews view */
reviewCont.buildMyReviews = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const reviews = await reviewModel.getReviewsByAccountId(account_id)
  let nav = await utilities.getNav()
  
  res.render("./review/my-reviews", {
    title: "My Reviews",
    nav,
    reviews,
    errors: null
  })
}

/* Build edit review view */
reviewCont.buildEditReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const review = await reviewModel.getReviewById(review_id)
  
  if (!review) {
    req.flash("notice", "Review not found.")
    return res.redirect("/review/my-reviews")
  }
  
  if (review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only edit your own reviews.")
    return res.redirect("/review/my-reviews")
  }
  
  const vehicle = await invModel.getInventoryByInventoryId(review.inv_id)
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  
  let nav = await utilities.getNav()
  
  res.render("./review/edit-review", {
    title: `Edit Review: ${vehicleName}`,
    nav,
    errors: null,
    review_id: review.review_id,
    review_rating: review.review_rating,
    review_text: review.review_text,
    vehicleName,
    inv_id: review.inv_id
  })
}

/* Process edit review */
reviewCont.updateReview = async function (req, res) {
  const { review_id, review_rating, review_text } = req.body
  
  const review = await reviewModel.getReviewById(review_id)
  if (review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only edit your own reviews.")
    return res.redirect("/review/my-reviews")
  }
  
  const result = await reviewModel.updateReview(review_id, review_rating, review_text)
  
  if (result) {
    req.flash("notice", "Your review has been updated and is pending approval.")
    res.redirect("/review/my-reviews")
  } else {
    req.flash("notice", "Sorry, updating your review failed.")
    res.redirect(`/review/edit/${review_id}`)
  }
}

/* Process delete review */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  const review = await reviewModel.getReviewById(review_id)
  if (review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "You can only delete your own reviews.")
    return res.redirect("/review/my-reviews")
  }
  
  const result = await reviewModel.deleteReview(review_id)
  
  if (result) {
    req.flash("notice", "Your review has been deleted.")
  } else {
    req.flash("notice", "Sorry, deleting your review failed.")
  }
  
  res.redirect("/review/my-reviews")
}

/* Build admin review management view */
reviewCont.buildAdminReviews = async function (req, res, next) {
  const pendingReviews = await reviewModel.getPendingReviews()
  let nav = await utilities.getNav()
  
  res.render("./review/admin-reviews", {
    title: "Manage Reviews",
    nav,
    pendingReviews,
    errors: null
  })
}

/* Approve review (admin) */
reviewCont.approveReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  const result = await reviewModel.approveReview(review_id)
  
  if (result) {
    req.flash("notice", "Review has been approved.")
  } else {
    req.flash("notice", "Sorry, approving the review failed.")
  }
  
  res.redirect("/review/admin")
}

/* Delete review (admin) */
reviewCont.adminDeleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  const result = await reviewModel.deleteReview(review_id)
  
  if (result) {
    req.flash("notice", "Review has been deleted.")
  } else {
    req.flash("notice", "Sorry, deleting the review failed.")
  }
  
  res.redirect("/review/admin")
}

module.exports = reviewCont
