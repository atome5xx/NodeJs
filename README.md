# Gestion des films et utilisateur en Node Js

## Description
Notre git est un projet Node js. Il permet de lire dans une base de données mongoDB. Il va gérer des utilisateurs ainsi que des films. Certaines fonctions ne pourront être effectué que si vous êtes connecter.

Il y a deux types d'authentification, admin et utilisateurs.

## Table des Matières
- [Fonctionnalitées](#fonctionnalité)
- [Description bdd](#description)
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

## Instalation

Pour installer le projet, suiver les étapes suivantes : 

-installer les dépendances:

        npm install express express-validator jsonwebtoken mongoose nodemon swagger-jsdoc swagger-ui-express bcrypt bcryptjs dotenv ejs

Importer la base de données forunis avec le projet dans votre serveur

Vous pouvez créer des utilisateurs mais pas des admins.
        Pour vous connectez en tant qu'admin utiliser les identifiants suivants:

            id:
            mdp: