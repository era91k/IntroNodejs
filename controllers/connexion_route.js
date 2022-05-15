const express = require ('express');
const { getUser } = require('../models/utilisateur_model');
const router = express.Router();

var titre = 'Connexion';

router.get('/', (req, res) => {    
    if (req.session.user){
        //On vérifie si une session est ouverte
        res.locals.user = req.session.user;
        res.status(303).render('message', {titre : 'Déjà connecté'});
    } else {
        res.status(200).render('login', { titre });
    }
})

router.post('/', (req, res) => {
    getUser(req, res).then(function (user){
        if (user.length > 0){
            //Si info coresspondent -> Ouverture de la session
            req.session.user = {};
            req.session.user.id = user[0]._id;
            req.session.user.userNom = user[0].nom;
            req.session.user.userPrenom = user[0].prenom;
            req.session.user.userMail = user[0].mail;
            res.locals.user = req.session.user;
            console.log(res.locals.user);
            titre = 'Accueil';
            res.status(200).render('index', { titre });
        } else {
            //Sinon, re tentative
            let message = 'Mail ou mdp erroné';
            res.status(401).render('login', { titre, message});
        }
    }).catch(function(error){
        console.log('Erreur dans post getUser', error);
    });
});

module.exports = router;