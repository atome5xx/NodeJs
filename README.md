# Gestion des films et utilisateur en Node Js

## Description
Notre git est un projet Node js. Il permet de lire dans une base de données mongoDB. Il va gérer des utilisateurs ainsi que des films. Certaines fonctions ne pourront être effectué que si vous êtes connecter.

Il y a deux types d'authentification, admin et utilisateurs.

## Table des Matières
- [Fonctionnalitées](#fonctionnalité)
- [Description](#description)
- [Logs](#logs)
- [Installation](#installation)

## Fonctionnalitées

Partie publique:

- [ ] Créer un compte utilisateur
- [ ] Se connecter
- [ ] Consulter la liste des films et séries
- [ ] Consulter le détail d'un film ou d'une série
- [ ] Rechercher un film ou une série (recherche filtrée par nom, genre, année de sortie)

Partie privée (utilisateur):

- [ ] Modifier son profil (nom, prénom, email, mot de passe)
- [ ] Ajouter un film ou une série à sa liste de favoris
- [ ] Consulter sa liste de favoris
- [ ] Supprimer un film ou une série de sa liste de favoris
- [ ] Créer une liste de lecture
- [ ] Ajouter un film ou une série à sa liste de lecture (statut "à voir", "vu", "en cours")
- [ ] Historique des films et séries vus
- [ ] Demander la suppression de son compte

Partie privee (Admin):

- [ ] Ajouter un film ou une série
- [ ] Modifier un film ou une série (titre, genre, année de sortie, description, image)
- [ ] Supprimer un film ou une série
- [ ] Consulter la liste des utilisateurs
- [ ] Consulter le détail d'un utilisateur

Une pagination 2 par 2 est possible pour afficher la liste des films.


## Description

Notre utilisateur contient:

-Un id<br/>
-Un prénom<br/>
-Un nom<br/>
-Un email<br/>
-Un mdp hasher dans la bdd<br/>
-Une liste de favoris<br/>
-Une liste de Liste de lecture<br/>
-Une liste d'historique<br/>

Les films contiennent:

-Un id<br/>
-Un titre<br/>
-Une année de parution<br/>
-Une note critique<br/>
-Une liste d'acteur<br/>

## Logs

A chaque action effectuée (recherche, connexion, ajout/suppresion d'élément à une liste...) ou erreur renvoyée par l'application, Des logs seront écris dans des fichiers correspondants :

        - access.log (Logs des actions)
        - error.log (Logs des erreurs)

Les fichiers de logs créés se trouvent à la racine du projet

## Instalation

Pour installer le projet, suiver les étapes suivantes : 

-installer les dépendances:

        npm install express express-validator jsonwebtoken mongoose nodemon swagger-jsdoc swagger-ui-express bcrypt bcryptjs dotenv ejs winston

Importer la base de données forunis avec le projet dans votre serveur.
Pour cela créer une base de données Movies et importer les trois fichier json qui correspondent chacun à une collection

Pour démarrer votre projet il faut ecrire:


        npm run dev


Vous pouvez créer des utilisateurs mais pas des admins.
        Pour vous connectez en tant qu'admin utiliser les identifiants suivants:


            email: thomasee@gmail.com

            mdp: pass1234

