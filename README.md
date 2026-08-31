## Modèle de données

La fonctionnalité utilise un métaobjet Shopify nommé `Look`.

Chaque Look contient :
- un titre
- un sous-titre
- plusieurs images
- plusieurs références de produits

Cette architecture permet au marchand de créer et gérer ses Looks directement depuis l'administration Shopify, sans avoir à modifier le code du thème.

## 2. Listing des Looks :
commit : "feat: add Shop the Look listing and detail structure"

Un template de page Shopify dédié (`page.looks.json`) est utilisé pour afficher l’ensemble des Looks disponibles.

Le listing est généré dynamiquement à partir des entrées du métaobjet `Look Dnd`, afin d’éviter tout contenu codé en dur dans le thème.

Pour chaque Look, la page affiche :

- le titre du Look ;
- la première image du champ `images`, utilisée comme visuel principal ;
- un lien vers la page détail correspondante.

Les images sont générées à l’aide des filtres d’images Shopify et de tailles responsives, afin d’éviter de charger des ressources inutilement volumineuses.

La mise en page suit une approche mobile-first :

- 1 colonne sur mobile ;
- 2 colonnes sur tablette ;
- 3 colonnes sur desktop.


## 3. Pages détail des Looks

Chaque Look est publié sous forme de page web à partir du métaobject Shopify.

La définition du mztaobject utilise la structure d’URL suivante :

`/pages/look-dnd/{look-handle}`

Par exemple :

`/pages/look-dnd/look-01`  
`/pages/look-dnd/look-02`  
`/pages/look-dnd/look-03`

Un template dédié aux pages du metaobject est utilisé :

`templates/metaobject/look_dnd.json`

Ce template appelle une section réutilisable :

`sections/look-detail.liquid`

Cette architecture permet d’utiliser un seul template dynamique pour l’ensemble des Looks, plutôt que de créer manuellement une page ou un template différent pour chaque Look.

Le marchand peut ainsi créer de nouveaux Looks depuis le back-office Shopify sans avoir à modifier le code du thème.

À ce stade, la page détail affiche le titre et le sous-titre du Look. La galerie d’images et les produits associés seront ajoutés dans les étapes suivantes.
