const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a review.")
      .isLength({ min: 5 })
      .withMessage("Review must be at least 5 characters long."),
    body("inv_id").isNumeric().withMessage("Invalid vehicle ID."),
    body("account_id").isNumeric().withMessage("Invalid account ID."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add-review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const invModel = require("../models/inventory-model")
    const reviewModel = require("../models/review-model")
    
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const reviews = await reviewModel.getReviewsByInvId(inv_id)
    const loggedIn = res.locals.loggedin
    
    // We pass errors and the previous review_text back to the utility
    const grid = await utilities.buildDetailGrid(data, loggedIn, account_id, reviews, errors, review_text)
    let nav = await utilities.getNav()
    
    res.render("inventory/detail", {
      title: `${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      grid,
    })
    return
  }
  next()
}

module.exports = validate