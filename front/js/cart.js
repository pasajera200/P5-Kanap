let panier = [];

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

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

function submitForm(e) {
  e.preventDefault()
  if (panier.length === 0) {
    alert("Selectionnez des articles à acheter SVP")
    return
  }

  if (isFormInvalid()) return 
  if (isEmailInvalid()) return
  if (isNameInvalid()) return
  
  const body = makeRequestBody()
  fetch("http://localhost:3000/api/products/order", { 
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
}

function isNameInvalid() {
  const name = document.querySelector("#firstName", "#lastName").value
  const nameRegex = /^[a-zA-Z\- ]+$/
  if (nameRegex.test(name) === false) {
    alert("Merci d'écrire un nom et prenom valides")
    return true
  }
  return false
}

function isEmailInvalid() {
  const email = document.querySelector("#email").value
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (emailRegex.test(email) === false) {
    alert("Merci d'écrire une adresse mail valide")
    return true
  }
  return false
}

function isFormInvalid() {
  const form = document.querySelector(".cart__order__form")
  const inputs = form.querySelectorAll('input')
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("Remplissez tous les champs SVP")
      return true
    }
    return false
  })
}


function makeRequestBody() {
const form = document.querySelector(".cart__order__form")
  const firstName = form.elements.firstName.value
  const lastName = form.elements.lastName.value
  const address = form.elements.address.value
  const city = form.elements.city.value
  const email = form.elements.firstName.value
const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email:  email,
    },
    products: getIdsFromCache()
  }
  console.log(body)
  return body
}


function getIdsFromCache() {
  const numbersOfProducts = localStorage.length 
  const ids = []
  for (let i = 0; i < numbersOfProducts; i++) {
    const key = localStorage.key(i)
    console.log(key)
    const id = key.split('-')[1]
    ids.push(id)
  }
  return ids 
}