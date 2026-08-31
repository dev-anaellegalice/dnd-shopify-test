import { CartLinesUpdateEvent } from '@shopify/events';

class LookGallery extends HTMLElement {
  connectedCallback() {
    this.gallery = this.querySelector('[data-gallery]');
    this.prevButton = this.querySelector('[data-prev]');
    this.nextButton = this.querySelector('[data-next]');

    if (!this.gallery) return;

    this.prevButton?.addEventListener('click', () => {
      this.scrollGallery(-1);
    });

    this.nextButton?.addEventListener('click', () => {
      this.scrollGallery(1);
    });
  }

  scrollGallery(direction) {
    this.gallery.scrollBy({
      left: this.gallery.clientWidth * direction,
      behavior: 'smooth'
    });
  }
}

if (!customElements.get('look-gallery')) {
  customElements.define('look-gallery', LookGallery);
}

class LookShopAll extends HTMLElement {
  connectedCallback() {
    this.addAllButton = this.querySelector('[data-add-all]');

    if (!this.addAllButton) return;

    this.addAllButton.addEventListener('click', () => {
      this.handleAddAll();
    });
  }

  async handleAddAll() {
    const variantInputs = this.querySelectorAll('[name="id"]');

    const items = Array.from(variantInputs).map((input) => {
        return {
        variantId: input.value,
        quantity: 1
        };
    });

    if (!items.length) return;

    const cartItemsComponents = document.querySelectorAll(
        'cart-items-component'
    );

    const sectionIds = [];

    cartItemsComponents.forEach((component) => {
        if (component instanceof HTMLElement && component.dataset.sectionId) {
        sectionIds.push(component.dataset.sectionId);
        }
    });

    const deferredEventPromise = CartLinesUpdateEvent.createPromise();

    this.dispatchEvent(
        new CartLinesUpdateEvent({
        action: 'add',
        context: 'product',
        lines: items.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity
        })),
        promise: deferredEventPromise.promise
        })
    );

    const payload = {
        items: items.map((item) => ({
        id: Number(item.variantId),
        quantity: item.quantity
        })),
        sections: sectionIds.join(',')
    };

    try {
        this.addAllButton.disabled = true;

        const response = await fetch(Theme.routes.cart_add_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status) {
        throw new Error(data.message || 'Impossible d’ajouter le look au panier.');
        }

        const cartResponse = await fetch(`${Theme.routes.cart_url}.json`, {
        headers: {
            Accept: 'application/json'
        },
        credentials: 'same-origin'
        });

        const cart = await cartResponse.json();

        deferredEventPromise.resolve({
        cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart),
        detail: {
            items: cart.items,
            source: 'look-shop-all',
            sourceId: this.id || 'look-shop-all',
            itemCount: items.length,
            sections: data.sections,
            didError: false
        }
        });

        console.log('Look ajouté au panier :', cart);

    } catch (error) {
        deferredEventPromise.reject(error);
        console.error(error);

    } finally {
        this.addAllButton.disabled = false;
    }
}
}

if (!customElements.get('look-shop-all')) {
  customElements.define('look-shop-all', LookShopAll);
}