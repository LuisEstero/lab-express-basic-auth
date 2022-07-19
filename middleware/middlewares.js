const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next() // esto significa que la ruta sigue sin problema
    } else {
      res.redirect("/auth/login")
    }
  }
  
  const isAdmin = (req, res, next) => {
    if (req.session.user.role === "admin") {
      next() // permitir acceso (continuar con la ruta)
    } else {
      res.redirect("/profile")
    }
  }
  
  module.exports = {
    isLoggedIn,
    isAdmin
  }