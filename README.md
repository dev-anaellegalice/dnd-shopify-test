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

## 4. Galerie d'images

La page détail affiche l’ensemble des visuels associés au Look.

La galerie repose principalement sur le comportement natif du navigateur avec :

- un scroll horizontal ;
- CSS Scroll Snap pour positionner correctement chaque image ;
- la possibilité de swiper directement sur mobile ;
- des boutons de navigation précédent / suivant sur desktop.

La navigation avec les boutons est gérée par un Web Component dédié :

`look-gallery`

Le JavaScript est volontairement limité à la gestion des boutons de navigation. Le scroll et le positionnement des images restent gérés nativement par le navigateur.

Ce choix permet d’éviter l’ajout d’une librairie externe uniquement pour la galerie et de conserver une solution légère et performante.


## 5. Produits associés au Look

Les produits associés au Look sont récupérés dynamiquement depuis le champ `products` du métaobjet.

Pour chaque produit, la page affiche :

- son image principale ;
- son titre ;
- son prix ;
- ses variantes lorsqu’il en possède plusieurs ;
- un bouton permettant de l’ajouter individuellement au panier.

L’ajout individuel au panier s’appuie sur les composants natifs du thème Horizon :

`product-form-component`

et :

`add-to-cart-component`

L’objectif était de conserver autant que possible le fonctionnement natif du thème plutôt que de recréer une logique d’ajout au panier spécifique.

La variante sélectionnée est transmise au formulaire produit afin que le bon Variant ID soit envoyé à Shopify lors de l’ajout au panier.


## 6. Ajout complet du Look au panier

commit : "feat: add Shop the Look detail and cart functionality"

En complément de l’ajout individuel des produits, un bouton `Shop the look` permet d’ajouter l’ensemble des produits du Look au panier en une seule action.

Cette fonctionnalité est gérée par un Web Component dédié :

`look-shop-all`

Lors du clic, le composant récupère les variantes actuellement sélectionnées pour chaque produit et construit la liste des articles à ajouter au panier.

Chaque article contient :

- l’identifiant de la variante sélectionnée ;
- une quantité de `1`.

L’ensemble des produits est ensuite envoyé à la Cart API Shopify en une seule requête, plutôt que d'effectuer un appel séparé pour chaque produit.

La logique s’appuie également sur `CartLinesUpdateEvent`, utilisé par le thème Horizon pour informer les différents composants qu’une modification du panier est en cours.

Une fois l’ajout terminé, les données actualisées du panier sont récupérées et l’événement est résolu afin de permettre aux composants natifs du thème de se synchroniser.

Cette approche permet de conserver le comportement du panier Horizon tout en ajoutant une fonctionnalité spécifique de type "Shop the Look".


## 7. JavaScript et Web Components

Les comportements JavaScript spécifiques à la fonctionnalité sont regroupés dans :

`assets/looks.js`

Deux Web Components ont été créés :

### `look-gallery`

Responsable uniquement de la navigation précédente / suivante dans la galerie.

### `look-shop-all`

Responsable de la récupération des variantes sélectionnées et de l’ajout groupé des produits au panier.

Les sélecteurs sont recherchés à l’intérieur de chaque composant avec `this.querySelector()` / `this.querySelectorAll()` afin de limiter leur portée et d’éviter de dépendre inutilement du DOM global.

Cette organisation permet de séparer les responsabilités et de garder un JavaScript relativement simple, tout en restant cohérent avec l’architecture basée sur les composants du thème Horizon.
