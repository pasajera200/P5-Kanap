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
  const panierItems = document.getElementById('cart__items');
  for (const sofa of panier) {
    fetch(`http://localhost:3000/api/products/${sofa.id}`)
      .then((response) => response.json())
      .then((produits) => {
        const article = createArticle(sofa, produits.price);
        panierItems.appendChild(article);
        listenQuantitychange(article, sofa, panier);
        deleteItem(article); 
      });
  }
  return panier;
}

function createArticle(sofa, price, item) {
  displayTotalPrice(item, price, panier,)
  displayTotalQuantity()
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

function deleteItem(article) {
  const buttonSupprimer = article.querySelector('.deleteItem');
  buttonSupprimer.addEventListener('click', (e) => {
    localStorage.removeItem(e.target.id);
    window.location.reload(true);
  });
}


function UpdatePrixEtquantity(id, newValue, item) {
  console.log(id)
  const itemToUpdate = panier.find(item => item.id === id)
  console.log("newValue", newValue)
  itemToUpdate.quantity = newValue
  console.log(panier)
  displayTotalPrice(item, price, panier)
  displayTotalQuantity()
}

function displayTotalPrice( item, price, panier) {
  const totalPrice = document.querySelector("#totalPrice")
  const total = panier.reduce((total, item) => total = price * item.quantity, 0)
  console.log(total)
    totalPrice.textContent = total
  }

function displayTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity")
  const total = panier.reduce((total, item) => total + item.quantity, 0); 
  totalQuantity.textContent = total; 
}



function listenQuantitychange(article, panier, price) {
  const itemQuantity = article.querySelector('.itemQuantity');
  itemQuantity.addEventListener('change', (e) => {
    let data = JSON.parse(localStorage.getItem(e.target.id));
    data.quantity = parseInt(e.target.value);
    localStorage.setItem(e.target.id, JSON.stringify(data));
    window.location.reload(true);
    UpdatePrixEtquantity(data.id, data.quantity) 
    displayTotalQuantity()
    displayTotalPrice(item, price, panier,)
  });
}
