# API avec Node JS : examen pratique

## Objectifs

Créer une API RESTful avec Node JS et Express.

## Consignes

- Vous devez créer une API RESTful avec Node JS et Express. (respect des conventions REST)
- Vous devez utiliser une base de données MongoDB pour stocker les données.
- Gestion des erreurs (middleware)
- Readme.md avec les instructions pour lancer l'API, la documentation de l'API, les choix techniques, les features de l'API, etc.
- Utilisation de JWT pour l'authentification
- Hashage des mots de passe
- Validation des données pour les routes POST et PUT
- Utilisation de middlewares custom (liste non exhaustive):
  - Middleware pour vérifier si l'utilisateur est connecté
  - Middleware pour vérifier si l'utilisateur est admin
- Async/await pour les operations asynchrones
- Syntaxe ES6+
- Pattern MVC
- Systeme de pagination (seulement pour une entite de votre choix)
- API Documentation (Swagger)
- Systeme de logs (ecriture des logs dans un fichier: access.log et/ou error.log)
- Systeme de versionning de l'API
- Tests unitaires (Jest) #optionnel
- Utilisation de Docker #optionnel
- Utilisation de TypeScript #optionnel
- Utilisation de Socket.io #optionnel
- Utilisation de Redis #optionnel

## Features de l'API:

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
- [ ] Liste de recommmandations (films et séries similaires à ceux ajoutés à la liste de favoris, vide si aucun film ou série n'est ajouté à la liste de favoris)

Partie privee (Admin):

- [ ] Ajouter un film ou une série
- [ ] Modifier un film ou une série (titre, genre, année de sortie, description, image)
- [ ] Supprimer un film ou une série
- [ ] Consulter la liste des utilisateurs
- [ ] Consulter le détail d'un utilisateur
- [ ] Uploader un film ou une série (dans notre cas une image et un lien vers une vidéo)
