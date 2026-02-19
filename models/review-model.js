const pool = require("../database/")

/* *****************************
* Add new review
* *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    const result = await pool.query(sql, [review_text, inv_id, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get reviews for a specific vehicle
* *************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM review r 
                 JOIN account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [inv_id])
    return data.rows // Returns array of reviews
  } catch (error) {
    console.error("getReviewsByInvId error: " + error)
    return [] // Return empty array on error to prevent crashes
  }
}

module.exports = { addReview, getReviewsByInvId }