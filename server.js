/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const staticRoutes = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute") // IMPORTED
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const flash = require('connect-flash')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * *********************** */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(cookieParser())

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pool,
  }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute) // MOUNTED HERE

// File Not Found Route (MUST STAY AT THE BOTTOM OF ROUTES)
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message = err.status == 404 ? err.message : 'Oh no! There was a crash.'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`app listening on localhost:${port}`)
})