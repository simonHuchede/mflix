# Titre du Projet

Movies

## Prérequis

Avant de commencer, assurez-vous d'avoir installé toutes les dépendances nécessaires. Vous aurez besoin de Node.js et NPM installés sur votre système.:

```bash
node -v
npm -v
```

## Insaller les dépendances

```bash
npm install
```

## Configuration de la chaîne de connexion à la base de données

Créez un fichier '.env.local' à la racine du projet s'il n'existe pas déjà.

Ajoutez la chaîne de connexion à votre base de données MongoDB dans le fichier .env.local en suivant le format suivant :
MONGODB_URI=<votre_chaine_de_connexion>

## Lancer le projet en dev

```bash
npm run dev
```

## Lancer le projet en dev

Url projet : http://localhost:3000/

Url swagger : http://localhost:3000/swagger