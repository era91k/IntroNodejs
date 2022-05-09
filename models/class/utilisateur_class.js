class Utilisateur {
    constructor(nom, prenom, mail, mdp){
        this.nom = nom;
        this.prenom = prenom;
        this.mail = mail;
        this.mdp = mdp;
    }
}

module.exports = { Utilisateur };