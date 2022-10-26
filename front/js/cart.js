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

      // const getPrice = () => {
      //   fetch(`http://localhost:3000/api/products/${addKanap.id}`)
      //     .then((response) => response.json())
      //     .then((produits) => {

      //       price = produits.price;
      //       console.log(produits.price);
      //     });
      // };
      // getPrice();
    }
  }
}

panierItems();

function panierItems() {
  let cartItems = document.getElementById('cart__items');
  for (const sofa of cart) {
    fetch(`http://localhost:3000/api/products/${sofa.id}`)
      .then((response) => response.json())
      .then((produits) => {
        console.log(produits.price);
        const article = createArticle(sofa, produits.price);
        cartItems.appendChild(article);
      });

    // article.addEventListener('click', cartItems);
    // const p = document.createElement('p');
    // p.textContent = sofa.price + '€';
  }
}

function createArticle(sofa, price) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.setAttribute = ('data-id', sofa._id);
  article.setAttribute = ('data-color', sofa.color);
  article.setAttribute = 'data';
  document.querySelector('.cart__item__content__description');
  article.innerHTML = `<div class="cart__item__img">
    <img src="${sofa.imageUrl}" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${sofa.name}</h2>
      <p>${sofa.color}</p>
      <p>${price + '€'}</p>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${
          sofa.quantity
        }>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;
  return article;
}
