const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 * Process Add Review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  const result = await reviewModel.addReview(review_text, inv_id, account_id)

  if (result) {
    req.flash("notice", "Your review has been submitted.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, the review submission failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

module.exports = reviewCont