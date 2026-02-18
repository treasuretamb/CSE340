const utilities = require("../utilities/")
// You will import your account model here in later steps

/* ****************************************
* Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

module.exports = { buildManagement }