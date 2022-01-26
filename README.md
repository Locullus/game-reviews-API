# API critiques de jeux vidéos

On met en place un site permettant de consulter et d'effectuer des **critiques de jeux vidéo**.

## Objectifs

- charger la liste des jeux vidéo dans le menu déroulant
- afficher les reviews après sélection d'un jeu vidéo dans ce menu déroulant
- ajouter un jeu vidéo
- le tout sans jamais recharger la page

## Technos employées

On utilise ici lumen en back pour gérer les requêtes et les réponses à l'API.

Le front est constitué d'une page index qui présente les données sans rechargement (asynchrone).

Pendant la saison 7, nous avons codé dans 2 dépôts (_front_ et _back_) séparés mais aujourd'hui, pour le parcours, le front et le back sont réunis dans le même dépôt :fearful:  
**Pas de panique**, car tout est bien rangé à sa place. :relieved:

### Le code front est dans le répertoire `frontend`

- On y trouve :
  - un fichier `index.html` qui sera la seule page d'accès au site
  - un répertoire `js` qui contient un fichier `app.js` qui contiendra le module chargé de coder l'application (il n'est pas nécessaire de splitter l'application en plusieurs fichiers/modules)
- [Plus de détails ici](frontend/readme.md)

### Le code back est dans le répertoire `backend`

- On y trouve :
  - une installation de _Lumen_ à finaliser :warning:  
    - installation des dépendances à faire depuis le répertoire `backend`
    - création du fichier de configuration Lumen utile notamment pour l'accès à la base de données
  - une partie du code back déjà en place avec des routes, des contrôleurs et des modèles, à vous de compléter ce code de départ :muscle: 
- [Plus de détails ici](backend/readme.md)

## Installation

- dans le terminal, installer les dépendances avec composer :
```bash
$ composer install
```
- créer une base de donnée avec adminer ou phpMyAdmin, avec un user spécifique (bonne et sûre pratique !)
- créer à la racine du projet un fichier .env renseignant les paramètres de connection à la BDD
- TODO : à compléter


### #0 Base de données :floppy_disk:

Créer une base de données nommée `game-reviews` et importer tables et données (fichier docs/import.sql) :tada:

#### Backend

Il n'y a rien à faire, le endpoint pour récupérer les reviews est déjà en place.  
Tu peux le tester avec _Insomnia_.

> Une configuration pour Insomnia est fournie dans docs/Insomnia_import_game-reviews.json, que tu peux importer dans le logiciel.
