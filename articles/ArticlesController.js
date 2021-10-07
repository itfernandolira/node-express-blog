const express = require("express");
const router = express.Router();

router.get("/articles",(req, res) => {
    res.send("Artigos");
});

router.get("/admin/articles/new",(req, res) => {
    res.send("Adicionar Artigo");
});

module.exports = router;