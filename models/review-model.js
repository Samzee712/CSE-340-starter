const pool = require("../database/")

/* Get all approved reviews for a vehicle */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.review_rating,
        r.review_text,
        r.review_date,
        a.account_firstname,
        a.account_lastname
      FROM public.review r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1 AND r.review_approved = true
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error)
    return []
  }
}

/* Get average rating for a vehicle */
async function getAverageRating(inv_id) {
  try {
    const sql = `
      SELECT 
        ROUND(AVG(review_rating)::numeric, 1) as avg_rating,
        COUNT(*) as review_count
      FROM public.review
      WHERE inv_id = $1 AND review_approved = true
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
    return { avg_rating: 0, review_count: 0 }
  }
}

/* Add a new review */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `
      INSERT INTO public.review (inv_id, account_id, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(sql, [inv_id, account_id, review_rating, review_text])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    return null
  }
}

/* Get review by ID */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT * FROM public.review WHERE review_id = $1`
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("getReviewById error: " + error)
    return null
  }
}

/* Update a review */
async function updateReview(review_id, review_rating, review_text) {
  try {
    const sql = `
      UPDATE public.review
      SET review_rating = $1, review_text = $2, review_approved = false
      WHERE review_id = $3
      RETURNING *
    `
    const result = await pool.query(sql, [review_rating, review_text, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error: " + error)
    return null
  }
}

/* Delete a review */
async function deleteReview(review_id) {
  try {
    const sql = `DELETE FROM public.review WHERE review_id = $1`
    const result = await pool.query(sql, [review_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteReview error: " + error)
    return false
  }
}

/* Get all reviews by user */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.review_rating,
        r.review_text,
        r.review_date,
        r.review_approved,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_id
      FROM public.review r
      JOIN public.inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
    return []
  }
}

/* Get all pending reviews (admin) */
async function getPendingReviews() {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.review_rating,
        r.review_text,
        r.review_date,
        a.account_firstname,
        a.account_lastname,
        i.inv_make,
        i.inv_model,
        i.inv_year
      FROM public.review r
      JOIN public.account a ON r.account_id = a.account_id
      JOIN public.inventory i ON r.inv_id = i.inv_id
      WHERE r.review_approved = false
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("getPendingReviews error: " + error)
    return []
  }
}

/* Get count of pending reviews */
async function getPendingReviewsCount() {
  try {
    const sql = `SELECT COUNT(*)::int AS count FROM public.review WHERE review_approved = false`
    const result = await pool.query(sql)
    return result.rows[0].count
  } catch (error) {
    console.error("getPendingReviewsCount error: " + error)
    return 0
  }
}

/* Approve a review */
async function approveReview(review_id) {
  try {
    const sql = `
      UPDATE public.review
      SET review_approved = true
      WHERE review_id = $1
      RETURNING *
    `
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("approveReview error: " + error)
    return null
  }
}

/* Check if user already reviewed vehicle */
async function hasUserReviewed(inv_id, account_id) {
  try {
    const sql = `
      SELECT review_id FROM public.review
      WHERE inv_id = $1 AND account_id = $2
    `
    const result = await pool.query(sql, [inv_id, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("hasUserReviewed error: " + error)
    return false
  }
}

module.exports = {
  getReviewsByInventoryId,
  getAverageRating,
  addReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByAccountId,
  getPendingReviews,
  approveReview,
  hasUserReviewed
  ,getPendingReviewsCount
}
