# Cap TSI

Page statique sans dépendance, publiée dans `/ecoles/tsi/`. Ouvrir `index.html` via un serveur statique. Les cercles ouvrent des fiches accessibles au clavier ; recherche sans accents, filtres par concours et disponibilité, tris par nom ou effectifs et liens directs `#formation=tsi-1`.

## Données et millésimes

`data.js` contient 192 fiches de formation, voie ou quota partagé. 117 ont un quota 2026 documenté (773 places au total sur ce périmètre partiel). Les résultats historiques sont ceux de 2025. Vérification : 28 octobre 2026. Aucun quota 2027 n'est annoncé.

Sources :
- [SCEI, statistiques TSI 2025](https://www.scei-concours.fr/stat2025/tsi.html)
- [SCEI, bilan général 2025](https://www.scei-concours.fr/stat2025/stat_generale_2025.html)
- [CCINP, places TSI 2026](https://www.concours-commun-inp.fr/fr/les-ecoles/les-places-dans-les-ecoles/places-tsi.html)
- [Notice Centrale-Supélec TSI 2026, pages 7–8](https://www.concours-centrale-supelec.fr/sites/default/files/documents/CCS_2026_TSI.pdf#page=7)
- [Barres officielles Centrale-Supélec](https://www.concours-centrale-supelec.fr/statistiques)

Chaque ligne conserve ses URL sources, le périmètre des statistiques et ses notes. `null` signifie non renseigné ; `0` reste un zéro publié. Les rangs non pertinents lorsque personne n'intègre sont normalisés en `null`. Un rang médian n'est ni le rang du dernier admis ni un classement national d'école.

Les rapprochements entre années sont explicites. Les changements de concours ENSMA/EIVP restent séparés ; le quota CentraleSupélec apprentissage Metz/Rennes est regroupé, et Polytech 2026 est un quota réseau. Ne pas sommer les lignes historiques et les agrégats : elles se recoupent. Les lignes uniquement inter-filières ne sont pas attribuées artificiellement à TSI. Le détail historique (801 places/678 intégrés) ne coïncide pas exactement avec le bilan national publié (806/686) ; les valeurs originales sont conservées.

Pour une mise à jour, vérifier la session, le campus, le diplôme et le statut, puis changer les données, les dates et les compteurs éditoriaux ensemble. Les contenus de formation complémentaires proviennent de `../profiles.js` ; ils ne modifient pas les chiffres de concours.

## Lecture des concours et des effectifs

La page présente les deux grandes banques d’épreuves écrites TSI, Centrale-Supélec et CCINP, sans assimiler cela à deux inscriptions uniques ni exclure les épreuves spécifiques. Sources : présentation officielle Centrale-Supélec et règlement CCINP 2026. La colonne admissibles reprend `eligible2025` ; son périmètre est indiqué dans les fiches et les effectifs communs ne doivent pas être additionnés. Les résultats passés sont indicatifs pour l’orientation, les quotas restent attachés au millésime annoncé.
