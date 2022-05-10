const express = require('express');
const {ajouterUtilisateur, getAllUtilisateurs } = require('../models/utilisateur_model');
const router = express.Router();

router.get('/', (req, res) => {
    let titre = "Inscription";
    res.render('inscription', { titre });
});

router.post('/', ajouterUtilisateur);

module.exports = router;