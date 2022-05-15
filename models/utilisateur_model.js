const { Utilisateur } = require("./class/utilisateur_class");
const client = require("../db/connect");

/**
 * Fonction asynchrone qui ajoute un nouvel utilisateur après avoir fait les contrôles
 * Retourne une promesse terminée sour forme d'objet JSON 'ajout' composé d'un statut (boolean) et d'un message (string) concernant l'ajout
 * @param {*} req 
 * @param {*} res 
 */
const ajouterUtilisateur = async (req, res) =>{
    let ajout = {statut : false, message : ''};
    try {
        //On récupère les attributs dans la requête
        let nom = req.body.nom;
        let prenom = req.body.prenom;
        let mail = req.body.mail;
        let mdp = req.body.mdp;
        let mdp2 = req.body.mdp2;
        let cgu = req.body.cgu;

        //Contrôle des variables
        if ( nom == "" || prenom == "" || mail == "" || mdp == "" || mdp2 == "" || !cgu ){
            ajout.message = 'Erreur, veuillez remplir tous les champs';
        } else {
            //Si controle ok -> Controle Mdp
            if (mdp != mdp2){
                ajout.message = 'Erreur, les mdp sont !=';
            } else {
                //Si mdp sont pareils - > Vérif si mail existe
                let cursor = client.bd().collection('utilisateurs').find({mail : mail});
                rep = await cursor.toArray(); // ~await~ permet d'attendre la résolution de la requête avant d'assigner le résultat à rep
                if (rep.length > 0){
                    ajout.message = 'Erreur, mail déjà utilisé';
                } else {
                    //Création d'un objet Utilisateur puis ajout
                    let unUtilisateur = new Utilisateur(nom, prenom, mail, mdp);       
                    let result = await client.bd().collection("utilisateurs").insertOne(unUtilisateur);
                    if (result.acknowledged){
                        //Si ajout OK
                        ajout.statut = true;
                        ajout.message = 'Inscription réussie !';
                    } else {
                        ajout.message = 'Erreur, veuillez ré-essayer';
                    }
                }
            }
        }
    } catch (error) {
        console.log('Erreur dans ajouterUtilisateur', error);
    }
    return ajout;
};

/**
 * Fonction asynchrone qui récupère tous les utilisateurs présents dans la BDD
 * Retourne une promesse des résultats, sous forme d'un tableau
 * @param {*} req 
 * @param {*} res 
 */
const getAllUtilisateurs = async (req, res) =>{
    try {
        //Sélectionne tous les attributs, sauf le mots de passe
        let cursor = client.bd().collection("utilisateurs").find({}, {mdp : 0}); 
        var results = await cursor.toArray();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
    return results;
}

const getUser = async (req, res) =>{
    try {
        let unMail = req.body.mail;
        let unMdp = req.body.mdp;
        let cursor = client.bd().collection('utilisateurs').find({mail : unMail, mdp : unMdp});    
        user = await cursor.toArray();
    } catch (error) {
        console.log('Erreur dans connectUser', error);
    }
    return user;
}


module.exports = { ajouterUtilisateur, getAllUtilisateurs, getUser };