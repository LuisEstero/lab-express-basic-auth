// routes/auth.routes.js
// Link de las rutas

const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose"); // conectar a mongoose
const bcryptjs = require("bcryptjs"); // protege las contraseñas
const saltRounds = 10;

const User = require("../models/User.model");


const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//  middleware protege el cierre de la sesión

router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));


router.post("/signup", isLoggedOut, (req, res, next) => {
  

  const { username,  password } = req.body;

  // Si los dcampos no se han rellenado envía un aviso de error
  if (!username ||  !password) {
    res.render("auth/signup", {
      errorMessage: "All fields are mandatory. Please provide your username, username and password."
    });
    return;
  }


  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      
      res.redirect("/main");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username and username need to be unique. Either username or username is already used."
        });
      } else {
        next(error);
      }
    }); 
});

router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

// Añade un usuario al login 

router.post("/login", isLoggedOut, (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login."
    });
    return;
  }

  User.findOne({ username }) // <== comprueba si hay un usuario con el mismo nombre
    .then((user) => {
      
      if (!user) {
        // <== si no hay ningún usuario con el nombre de usuario, notifica al usuario que está intentando conectarse
        res.render("auth/login", { errorMessage: "Email is not registered. Try with other username." });
        return;
      }
      // compara la contraseña proporcionada
      // on la contraseña cifrada guardada en la base de datos
      else if (bcryptjs.compareSync(password, user.password)) {
        // si las dos contraseñas coinciden, renderiza el user-profile.hbs y
        // pasa el objeto usuario a esta vista
        // |
        // V
        // res.render("usuarios/perfil-de-usuario", { usuario });

        // cuando introducimos la sesión, la siguiente línea se sustituye por lo que sigue:
        // res.render('users/user-profile', { user });;

        //******* GUARDA LA SESIÓNN DEL USUARIO  ********//
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        // si las dos contraseñas NO coinciden, vuelve a mostrar el formulario de acceso
        // y envía el mensaje de error al usuario
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});


module.exports = router;

