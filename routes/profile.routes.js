const router = require("express").Router();
const UserModel = require("../models/User.model")

// const isLoggedIn = (req, res, next) => {
//   if (req.session.user) {
//     next()
//   } else {
//     res.redirect("/auth/login")
//   }
// }

const isLoggedIn = require("../middlewares/isLoggedIn")
const isAdmin = require("../middlewares/isAdmin")

// const { isLoggedIn, isAdmin } = require("../middlewares/middlewares");
const uploader = require("../middlewares/uploader")

router.get("/", isLoggedIn, (req, res, next) => {
  console.log(req.session.user)


  UserModel.findById(req.session.user._id)
  .then(user => {
    res.render("profile/profile.hbs", {user})
  })

})

router.post("/upload/profile-pic", uploader.single("image"), (req, res, next) => {

  // modificar el usuario y agregarla la imagen
  console.log("el archivo es:", req.file)

  UserModel.findByIdAndUpdate(req.session.user._id, {
    profilePic: req.file.path
  })
  .then(() => {
    res.redirect("/profile")
  })
  .catch(err => next(err))


})

router.get("/admin", isAdmin, (req, res, next) => {

  res.render("profile/admin.hbs")

})


module.exports = router;