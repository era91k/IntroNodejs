const { MongoClient, Db } = require("mongodb");
var client = null;

/**
 * Se connecter à la base de données
 * @param {*} url 
 * @param {*} callback 
 */
function connecter(url, callback){
    //Si la connection n'est pas établie
    if (client == null ){
        client = new MongoClient(url);
        client.connect((erreur)=>{
            if (erreur){
                client = null;
                callback(erreur);
            } else {
                callback();
            }
        })
    //La connexion était déjà établie
    } else {
        callback();
    }
}

/**
 * Retourne une instance de la classe Db
 */
function bd(){
    return new Db(client, "premieredb");
}

/**
 * Ferme la connexion
 */
function deconnexion(){
    if(client){
        client.close();
        client = null;
    }
}

module.exports = {connecter, bd, deconnexion};

