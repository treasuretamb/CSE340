const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification grid HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data && data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">No matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the item detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data, loggedIn, account_id, reviews = [], errors = null, review_text = "") {
  if (!data || data.length === 0) return '<p class="notice">Vehicle details not found.</p>'
  
  let vehicle = data[0]
  let detail = '<div id="detail-display">'
  detail += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`
  detail += '<div id="vehicle-info">'
  detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detail += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  detail += `<p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`
  detail += '</div></div>'

  detail += '<div class="reviews-section"><h3>Customer Reviews</h3>'

  if (errors) {
    detail += '<ul class="notice">'
    errors.array().forEach(error => { detail += `<li>${error.msg}</li>` })
    detail += '</ul>'
  }

  if (loggedIn == 1) { 
    detail += `
      <form action="/inv/add-review" method="post" class="review-form">
        <label for="review_text">Leave a Review:</label><br>
        <textarea name="review_text" id="review_text" required>${review_text}</textarea><br>
        <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
        <input type="hidden" name="account_id" value="${account_id}">
        <button type="submit">Submit Review</button>
      </form>`
  } else {
    detail += '<p>Please <a href="/account/login">login</a> to leave a review.</p>'
  }

  if (Array.isArray(reviews) && reviews.length > 0) {
    detail += '<ul class="review-list">'
    reviews.forEach(r => {
      detail += `<li><strong>${r.account_firstname}</strong>: ${r.review_text}</li>`
    })
    detail += '</ul>'
  } else {
    detail += '<p>No reviews yet.</p>'
  }
  detail += '</div>'
  return detail
}

/* **************************************
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 *****************************************/
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      res.clearCookie("jwt")
      res.locals.loggedin = 0
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.checkAdmin = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access that page.")
    return res.redirect("/account/login")
  }
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util