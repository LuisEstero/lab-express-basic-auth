const router = require("express").Router();
const UserModel = require("../models/User.model")
const bcrypt = require("bcryptjs")

const isLoggedIn = require("../middlewares/isLoggedIn")

// aqui estarán todas nuestras rutas de auth´

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

router.post("/signup", async (req, res, next) => {
  // ? donde está la informacion del usuario?
  console.log(req.body)
  const { username, email, password } = req.body

  // 1. Validadores de backend

  // 1.1 Revisar que todos los campos son recibidos
  if (!username || !email || !password) {
    res.render("auth/signup.hbs", {
      errorMessage: "Debes llenar todos los campos!"
    })
    return; // este return deja de ejecutar la ruta cuando la información no pasa esta validación
  }

  // 1.2 Revisar que la contraseña sea apta
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;

  if (!passwordRegex.test(password)) {
    res.render("auth/signup.hbs", {
      errorMessage: "Contraseña debe ser entre 8 y 15, tener mayúscula, minúscula, dígito y un caracter especial"
    })
    return;
  }

  // 1.3 Revisar que el email tenga formato correcto
  // ... les queda de tarea

  try {

    // 1.4 Que no exista un usuario con el mismo email
    const foundUser = await UserModel.findOne({ email })
    if (foundUser) {
      res.render("auth/signup.hbs", {
        errorMessage: "Usuario ya registrado"
      })
      return;
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
  
  
    // 2 crear el usuario
    await UserModel.create({
      username,
      email,
      password: hashedPassword
    })
  
    // 3 dirigir al usuario a otra pagina
    res.redirect("/auth/login")

  } catch(err) {
    next(err)
  }



})

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})

router.post("/login", async (req, res, next) => {
  console.log(req.body)

  const { email, password } = req.body

  // 1. Van nuestras validaciónes

  // 1.1 El usuario debe enviar ambas credenciales
  if (!email || !password) {
    res.render("auth/login.hbs", {
      errorMessage: "Debes llenar todos los campos"
    })
    return;
  }

  try {
    // 1.2 Que el usuario exista en nuestra base de datos
    const foundUser = await UserModel.findOne({email})
  
    if(!foundUser) {
      res.render("auth/login.hbs", {
        errorMessage: "El usuario con ese email no existe en nuestra base datos"
      })
      return;
    }

    // 1.3 Confirmar que la contraseña sea correcta
    const passwordMatch = await bcrypt.compare(password, foundUser.password )
    console.log(passwordMatch)
    // 1234abcD!

    if(!passwordMatch) {
      res.render("auth/login.hbs", {
        errorMessage: "fuera de aqui, impostor. sus"
      })
      return;
    }
  
    // * hemos autenticado al usuario

    // 2. Iniciar la sesión del usuario
    // toooooda la configuración es para poder tener acceso a la sesión (req.session)
    req.session.user = foundUser
    // DE AHORA EN ADELANTE NOSOTROS TENEMOS ACCESO AL USUARIO ACTIVO EN REQ.SESSION.USER
  
    req.app.locals.isLoggedIn = true
    if (foundUser.role === "admin") {
      req.app.locals.isAdmin = true
    }

    // 3. redireccionar al usuario a su perfil
    res.redirect("/profile")

  } catch(err) {
    next(err)
  }


})

router.get("/logout", (req, res, next) => {

  req.session.destroy()
  req.app.locals.isLoggedIn = false
  req.app.locals.isAdmin = false

  res.redirect("/")

})

module.exports = router;