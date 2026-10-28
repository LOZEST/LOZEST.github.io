# Atlas des écoles

Page web statique publiée dans le dossier `ecoles/` de `LOZEST/LOZEST.github.io`.

## Expérience

- 142 bulles issues du graphique fourni, activables au clic et au clavier.
- 16 fiches documentées avec résumés et liens institutionnels ; les autres fiches affichent uniquement les repères du graphique et signalent l’absence de documentation.
- Recherche insensible aux accents par nom, ou par domaine pour les fiches documentées. Entrée ouvre le premier résultat.
- Fiche latérale sur ordinateur, dialogue sur mobile ; Échap ou le cercle de fermeture ferme le dialogue.
- Liens directs vers une école via `#ecole=<id>`.
- Aucun outil de suivi, compte, serveur applicatif ou dépendance JavaScript externe.

## Lancer en local

Depuis la racine du dépôt :

```sh
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/ecoles/`.

## Fichiers

- `index.html` : structure et contenus de présentation.
- `styles.css` : styles responsive (polices Google Fonts, repli système disponible).
- `app.js` : interactions, recherche, fiches et liens directs.
- `schools.js` : transcription manuelle des positions, rayons et noms des bulles.
- `profiles.js` : résumés de formation et URLs des sources officielles, consultées le 28 octobre 2026.
- `assets/graphique-original.png` : image fournie par l’utilisateur, également utilisée pour les logos.

## Déploiement

Ce dossier est compatible avec GitHub Pages, sans compilation. Si le dépôt publie déjà la branche `main` à sa racine, la page est disponible à l’URL `https://lozest.github.io/ecoles/` après la construction Pages. L’accueil du portfolio n’est pas modifié.

## Données et limites

Ce n’est pas un classement officiel. L’auteur, l’année et la définition du « niveau moyen » ne sont pas indiqués dans l’image. La valeur affichée est obtenue à partir de la position verticale du centre : `arrondi(100 - (y - 94) / 18.02)`. Les positions et rayons ont été relevés manuellement ; aucune précision au point près n’est garantie.

Le graphique peut dater d’avant des changements de nom ou de structure. Les informations actuelles de formation sont donc conservées séparément. ENSTA et ENSTA Bretagne restent deux bulles historiques mais renvoient à l’organisation actuelle. Certains petits logos (notamment Polytech) ne permettent pas d’identifier leur campus ; la fiche l’indique, sans inventer de nom. Les effectifs exacts, les frais, les salaires et les chances d’admission ne sont pas déduits du graphique.

Les logos et le graphique restent la propriété de leurs titulaires respectifs. Aucune affiliation ni licence de réutilisation de ces marques n’est revendiquée.

Pour enrichir une fiche, ajouter une entrée dans `profiles.js` sous la clé `x,y` correspondante, après vérification de la source officielle. Ne pas déduire l’admissibilité dans une filière à partir de la présence d’une école sur cette image.
