let panier = [];

getItemsFromCache();

function getItemsFromCache() {
  const numbersOfItems = localStorage.length;
  for (let i = 0; i < numbersOfItems; i++) {
    const signature = localStorage.key(i).split('-')[0];
    if (signature === 'product') {
      let item = localStorage.getItem(localStorage.key(i));
      let itemObject = JSON.parse(item);
      panier.push(itemObject);
    }
  }
}

panierItems();

function panierItems() {
  let panierItems = document.getElementById('cart__items');
  for (const sofa of panier) {
    fetch(`http://localhost:3000/api/products/${sofa.id}`)
      .then((response) => response.json())
      .then((produits) => {
        const article = createArticle(sofa, produits.price);
        panierItems.appendChild(article);
        deleteItem(article, sofa);
        afficherItemQuantity(sofa);
        afficherTotalQuantity(sofa);
        listenQuantitychange(article, sofa, panier);
        updateTotalQuantity(panier);
        // updateTotalPrice(panier);
      });
  }
  return panier;
}

function createArticle(sofa, price) {
  updateTotalPrice(price, panier);
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.setAttribute = ('data-id', sofa._id);
  article.setAttribute = ('data-color', sofa.color);
  article.innerHTML = `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}"><div class="cart__item__img">
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
        <input type="number" id="product-${sofa.id}-${
    sofa.color
  }" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
    sofa.quantity
  }">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem" id="product-${sofa.id}-${
    sofa.color
  }">Supprimer</p>
      </div>
    </div>
  </div></article>`;
  return article;
}

function deleteItem(article, sofa, panier, price) {
  const buttonSupprimer = article.querySelector('.deleteItem');
  buttonSupprimer.addEventListener('click', (e) => {
    console.log(e.target.id);
    localStorage.removeItem(e.target.id);
    window.location.reload(true);
    // sofa.quantity = 0;
    // updateTotalPrice(sofa, price, panier);
    // updateTotalQuantity(sofa);
    // article.remove();
    // const key = `product-${id}-${color}`;
    // console.log(key);
    // localStorage.getItem(key);
  });
}

function afficherItemQuantity(sofa) {
  const quantityInput = document.querySelector('input[name="itemQuantity"]');
  // quantityInput.value = sofa.quantity;
}

function updateTotalPrice(price, panier) {
  let total = 0;
  const totalPrice = document.querySelector('#totalPrice');
  panier.forEach((sofa) => {
    const totalUnitPrice = price * sofa.quantity;
    total += totalUnitPrice;
  });
  // console.log(total);
  totalPrice.textContent = total;
}

function updateTotalQuantity(panier) {
  let totalQuantity = 0;
  panier.forEach((sofa) => {
    totalQuantity += sofa.quantity;
  });
  afficherTotalQuantity(totalQuantity);
}

function afficherTotalQuantity(total) {
  const totalQuantity = document.getElementById('totalQuantity');
  totalQuantity.innerHTML = total;
}

function listenQuantitychange(article, sofa, panier, price) {
  const itemQuantity = article.querySelector('.itemQuantity');
  itemQuantity.addEventListener('change', (e) => {
    let data = JSON.parse(localStorage.getItem(e.target.id));
    data.quantity = parseInt(e.target.value);

    localStorage.setItem(e.target.id, JSON.stringify(data));

    window.location.reload(true);

    console.log(e.target.value);
    console.log(data);
    // console.log(itemQuantity.id);
    sofa.quantity = e.target.value;
    afficherItemQuantity(sofa);
    updateTotalPrice(price);
    updateTotalQuantity(panier);
    afficherTotalQuantity(panier);
  });
}
