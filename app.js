const express = require('express');
const { connecter } = require('./db/connect');
const { getAllUtilisateurs } = require("./models/utilisateur_model");
const inscription = require('./controllers/inscription_route');

const app = express();

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

//Trouver le fichier css lol
app.use(express.static(__dirname + '/style'));

//Utilisation d'un gestionnaire de routes
app.use('/page-register', inscription);

app.get('/', (req, res) => {
    let titre = "Accueil";
    res.render('index', { titre });
});

app.get('/page-login', (req, res) => {
    let titre = "Connexion";
    res.render('login', { titre });
});

app.get('/page-list', (req, res) =>{
    let titre = 'Liste';
    getAllUtilisateurs(req, res).then(function (results){
        if (results.length > 0){
            res.status(200).render('list', {titre, results}); //Si JSON plutot que dans une vue -> res.status(200).json(results)
        } else {
            res.status(204).render('list', {titre, results});
        }
    }).catch(function (error){
        console.log('Il y a eu une erreur', error);
    })
});

app.use( (req, res) => {
    let titre = "Erreur 404 page not found"
    res.render('404');
});