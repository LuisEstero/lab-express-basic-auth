const { Router } = require("express");
const router = new Router();
const { isLoggedIn } = require('../middleware/route-guard.js');

router.get("/main", isLoggedIn, (req, res, next) => res.render("main"));

router.get("/private",isLoggedIn, (req, res, next) => res.render("private"));


module.exports = router;