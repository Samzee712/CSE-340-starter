const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * Check Login - Middleware
 **************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
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

/* ****************************************
 *  Check account type - Middleware
 * ************************************ */
function checkAccountType(req, res, next) {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type
    if (accountType == 'Employee' || accountType == 'Admin') {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

module.exports = { checkJWTToken, checkAccountType }