const { Utilisateur } = require("./class/utilisateur_class");
const client = require("../db/connect");

/**
 * Ajouter un utilisateur
 * @param {*} req 
 * @param {*} res 
 */
const ajouterUtilisateur = (req, res) =>{
    try {
        //On récupère les attributs dans la requête
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let mail = req.body.mail;
        let mdp = req.body.mdp;

        //Crée objet utilisateurs
        let utilisateur = new Utilisateur(nom, prenom, mail, mdp);
        
        //Ajouter l'objet utilisateur à la collection 'utilisateurs'
        let result = client
            .bd()
            .collection("utilisateurs")
            .insertOne(utilisateur);
        
        //Retourne un stat 200 car tout s'est bien éxécuté
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

/**
 * Récupère tous les utilisateurs présents dans la BDD
 * Renvoie vers la vue 'list'
 * @param {*} req 
 * @param {*} res 
 */
const getAllUtilisateurs = async (req, res) =>{
    try {
        let titre = "Liste";
        //Sélectionne tous les attributs, sauf le mots de passe
        let cursor = client.bd().collection("utilisateurs").find({}, {mdp : 0}); 
        let results = await cursor.toArray();
        res.status(200)
            .render('list', { titre, results });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
}

module.exports = { ajouterUtilisateur, getAllUtilisateurs };