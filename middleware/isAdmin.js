const isAdmin = (req, res, next) => {
    if (req.session.user.role === "admin") {
      next() // permitir acceso (continuar con la ruta)
    } else {
      res.redirect("/profile")
    }
  }
  
  module.exports = isAdmin