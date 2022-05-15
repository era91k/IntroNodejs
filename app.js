const express = require('express');
var session = require('express-session')
const { connecter } = require('./db/connect');
const { getAllUtilisateurs } = require("./models/utilisateur_model");
const inscription = require('./controllers/inscription_route');
const connexion = require('./controllers/connexion_route');

const app = express();

//Pour uiliser les sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'hyper',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//Connexion à la base de données
connecter("mongodb://127.0.0.1:27017/", (erreur) =>{
    if (erreur){
        console.log("Erreur lors de la connexion à la bdd");
        process.exit(-1);
    } else {
        console.log("Connexion avec la bdd établie");
        app.listen(3000);
    }
});

//app.set('views', '/views'); Views est le nom par défaut
app.set('view engine', 'ejs');

//Middleware pour extraire les données du formulaire
app.use(express.urlencoded({extended : false}));

//Trouver le fichier css
app.use(express.static(__dirname + '/style'));

//Aller page d'acceuil
app.get('/', (req, res) => {
    if (req.session.user){
        //On vérifie si une session est ouverte
        res.locals.user = req.session.user;
    }
    let titre = "Accueil";
    res.render('index', { titre });
});

//Utilisation de gestionnaire de routes pour page-register et page-login
app.use('/page-register', inscription);
app.use('/page-login', connexion);

//Afficher tous les utilisateurs
app.get('/page-list', (req, res) =>{
    if (req.session.user){
        //On vérifie si une session est ouverte
        res.locals.user = req.session.user;
        let titre = 'Liste';
        getAllUtilisateurs(req, res).then(function (results){
            if (results.length > 0){
                res.status(200).render('list', {titre, results}); //Si JSON plutot que dans une vue -> res.status(200).json(results)
            } else {
                res.status(204).render('list', {titre, results});
            }
        }).catch(function (error){
            console.log('Il y a eu une erreur', error);
        });
    } else {
        //Sinon, redirection vers page de connexion
        res.status(401).render('login', { titre : 'Connexion'});
    }

});

//Déconnexion de l'utilisateur
app.get('/deconnexion', (req, res) =>{
    req.session.destroy();
    res.redirect('/');
});

//Si l'utilisateur se rend sur une page inexistante
app.use( (req, res) => {
    let titre = "Erreur 404 page not found"
    res.render('404');
});