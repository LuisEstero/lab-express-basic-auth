// Comprueba si el usuario está conectado cuando intenta acceder a una página específica

const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/login");
    }
    next();
  };
  
  // Si un usuario ya conectado intenta acceder a la página de inicio de sesión, 
  // redirige al usuario a la página de inicio
  
  const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect("/");
    }
    next();
  };
  
  
  module.exports = {
    isLoggedIn,
    isLoggedOut
  };
  