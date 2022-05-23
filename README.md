# DISCORDIA
## Bot Discord de Jeu de Rôles

### Configuration
- Node v16.6.0

### Installation
- Créer dans un premier temps le fichier config.json en y mettant les informations renseignées du fichier config_demo.json.

- Le bot peut ensuite être au choix démarré dans l'environnement de production ou de développement avec :
>npm run prod

>npm run dev

### Commandes

#### Creation de personnage

> /creation 

Lance le module de création de personnage. Le bot présente plusieurs options sous forme de boutons à cliquer. Le joueur est guidé étape par étape. 
- Le joueur choisit d'abord sa race et son genre.
- Le joueur choisit ensuite sa classe de personnage.
- On offre ensuite au joueur la possibilité de changer le pseudo de son personnage avant la validation et l'enregistrement en BDD.

Si un joueur a déjà créé un personnage, un message d'erreur est envoyé. 

#### Gestion de combat

Lorsque le joueur rencontre un ennemi, un rôle lui est assigné avec l'identité de l'adversaire. Il peut l'affronter grâce à la commande de combat : 
> /fight

Si il n'y a pas d'ennemi à combattre, un message d'erreur est envoyé. 
Sinon, le bot renvoie une carte avec les points de vie du personnage joueur et de son adversaire. Le joueur, ainsi que l'adversaire, ne peut pour l'instant qu'effectuer une attaque simple.
Si l'ennemi perd tous ses points de vie, le combat se termine avec un message de victoire pour le joueur. 
Si le joueur perd tous ses points de vie, le combat se termine par un message annonçant le décès du personnage joueur. 


#### Lancer la quête principale

Le joueur peut commencer une partie avec la commande : 
> /begin 

Si le joueur n'a pas créé de personnage, un message lui est envoyé pour lui indiquer qu'il faut qu'il le fasse. 
