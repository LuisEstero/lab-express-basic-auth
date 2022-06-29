const express = require("express");
const router = require("express").Router();

/* GET Página de Inicio */

router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
