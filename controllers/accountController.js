const utilities = require("../utilities/")
<<<<<<< HEAD
const accountModel = require("../models/account-model")
=======
// You will import your account model here in later steps
>>>>>>> a627cf756e139d21666581a7eaf6e579ca9a2004

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

<<<<<<< HEAD
/* ****************************************
* Deliver account update view
* *************************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  // In a real scenario, you'd fetch the latest data from the DB here
  // For now, we rely on the data in the session/locals
  res.render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: account_id
  })
}

module.exports = { 
  buildManagement,
  editAccountView
}
=======
module.exports = { buildManagement }
>>>>>>> a627cf756e139d21666581a7eaf6e579ca9a2004
