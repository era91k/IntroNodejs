const express = require('express');
const {ajouterUtilisateur, getAllUtilisateurs } = require('../models/utilisateur_model');
const router = express.Router();

const titre = 'Inscription';

router.get('/', (req, res) => {
    res.render('inscription', {titre});
});

router.post('/', (req, res) => {
    ajouterUtilisateur(req, res).then(function (ajout){
        if (ajout.statut){
            res.status(200).render('inscription', {titre, ajout});
        } else {
            res.status(409).render('inscription', {titre, ajout});
        }
    }).catch(function(error){
        console.log('Erreur dans post Utilisateur', error);
    })
});

module.exports = router;