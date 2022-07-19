const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next() // esto significa que la ruta sigue sin problema
    } else {
      res.redirect("/auth/login")
    }
  }
  
  module.exports = isLoggedIn