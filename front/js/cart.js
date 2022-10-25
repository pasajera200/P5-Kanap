let cart = [];

getItemsFromCache();

function getItemsFromCache() {
  const numbersOfItems = localStorage.length;
  for (let i = 0; i < numbersOfItems; i++) {
    const signature = localStorage.key(i).split('-')[0];
    if (signature === 'product') {
      let item = localStorage.getItem(localStorage.key(i));
      let itemObject = JSON.parse(item);
      cart.push(itemObject);

      let addKanap = itemObject;

      const getPrice = () => {
        fetch(`http://localhost:3000/api/products/${addKanap.id}`)
          .then((response) => response.json())
          .then((produits) => {
            price = produits.price;
            addKanap.price = price;
            console.log(price);
          });
      };
      
      getPrice();

      panierItems();

      function panierItems() {
        let cartItems = document.getElementById('cart__items');
        for (const produits of cart) {
          const article = createArticle(produits);
          cartItems.appendChild(article);
          article.addEventListener('click', cartItems);
        }
      }

      function createArticle(produits) {
        const article = document.createElement('article');
        article.classList.add('cart__item');
        article.setAttribute = ('data-id', produits._id);
        article.setAttribute = ('data-color', produits.color);
        article.setAttribute = 'data';
        document.querySelector('.cart__item__content__description');
        article.innerHTML = `<div class="cart__item__img">
    <img src="${produits.imageUrl}" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${produits.name}</h2>
      <p>${produits.color}</p>
      <p>${produits.price + '€'}</p>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${
          produits.quantity
        }>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;
        return article;
      }

      getPrice();
    }
  }
}
