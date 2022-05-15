const express = require('express');
const {ajouterUtilisateur, getAllUtilisateurs } = require('../models/utilisateur_model');
const router = express.Router();

const titre = 'Inscription';

//Aller a la page inscription
router.get('/', (req, res) => {
    if (req.session.user){
        res.locals.user = req.session.user;
        res.status(303).render('message', { titre : 'Déjà inscrit'});
    } else {
        res.render('inscription', {titre});
    }
});

//Inscription d'un utilisateur
router.post('/', (req, res) => {
    ajouterUtilisateur(req, res).then(function (ajout){
        if (ajout.statut){
            res.status(200).render('inscription', {titre, ajout});
        } else {
            res.status(409).render('inscription', {titre, ajout});
        }
    }).catch(function(error){
        console.log('Erreur dans post Utilisateur', error);
    });
});

module.exports = router;