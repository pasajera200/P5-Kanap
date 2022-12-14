let panier = [];

//Button commander qui permet d'envoyer le formulaire pour finaliser l'achat 
const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => formulaireCommande(e))


//Récupère les produits du localStorage 
recupererItemsFromCache();

function recupererItemsFromCache() {
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

//Requête Fetch pour récupérer les prix des produits qui n'avaient pas été envoyés dans le localStorage
panierItems();
let getTotalPrice = 0;
function panierItems() {
  const panierItems = document.getElementById('cart__items');
  for (const sofa of panier) {
    fetch(`http://localhost:3000/api/products/${sofa.id}`)
      .then((response) => response.json())
      .then((produits) => {
        getTotalPrice = getTotalPrice + produits.price * sofa.quantity;
        displayTotalPrice(getTotalPrice)
        const article = createArticle(sofa, produits.price);
        panierItems.appendChild(article);
        listenQuantityChange(article, sofa, panier);
        deleteItem(article); 
      });
  }
  return panier;
}

//Manipulation du DOM. Création des articles
function createArticle(sofa, price) {
  TotalQuantity()
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

//Supprime un ou plusieurs produits
function deleteItem(article) {
  const buttonSupprimer = article.querySelector('.deleteItem');
  buttonSupprimer.addEventListener('click', (e) => {
    localStorage.removeItem(e.target.id);
    window.location.reload(true);
  });
}

//Montre le prix total des articles du panier
function displayTotalPrice(totalPrix) {
  const totalPrice = document.querySelector("#totalPrice");
  totalPrice.textContent = totalPrix;
}

//Calcule et affiche la quantité total
function TotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity")
  const total = panier.reduce((total, item) => total + item.quantity, 0); 
  totalQuantity.textContent = total; 
}

//Permet de changer la quantité des produits envoyés dans la page panier
function listenQuantityChange(article) {
  

  
  const itemQuantity = article.querySelector('.itemQuantity');
  itemQuantity.addEventListener('change', (e) => {
    let data = JSON.parse(localStorage.getItem(e.target.id));
    data.quantity = parseInt(e.target.value);
    localStorage.setItem(e.target.id, JSON.stringify(data));
    window.location.reload(true);
    TotalQuantity()
  });
}



//Requête Fetch POST et conditions pour le remplissage du formulaire de contact
//Redirection vers la page confirmation avec window.location.href
function formulaireCommande(e) {
  e.preventDefault()
  if (panier.length === 0) {
    alert("Selectionnez des articles à acheter SVP")
    return
  }
  if (formulaireInvalide()) return 
  if (emailInvalide()) return
  if (nomEtOuPrenomInvalide()) return
  const body = objetContact()
  fetch("http://localhost:3000/api/products/order", { 
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId
      window.location.href = "confirmation.html" + "?orderId=" + orderId 
    }) 
  .catch((err) => console.error(err))
}

//Utilisation de Regex pour la validation du nom et prénom
function nomEtOuPrenomInvalide() {
  const name = document.querySelector("#firstName").value
  const lastName = document.querySelector("#lastName").value
  const nameRegex = /^[a-zA-Z\- ]+$/
  if (nameRegex.test(name) === false) {
    alert("Merci d'écrire un nom et prénom valides")
    return true
  }
  if (nameRegex.test(lastName) === false) {
    alert("Merci d'écrire un nom et prénom valides")
    return true
  }
  return false
}

//Utilisation de Regex pour la validation de l'email
function emailInvalide() {
  const email = document.querySelector("#email").value
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (emailRegex.test(email) === false) {
    alert("Merci d'écrire une adresse mail valide")
    return true
  }
  return false
}

//Utilisation de Regex pour la validation du formulaire de contact
function formulaireInvalide() {
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

//Récupération des données pour le formulaire de contact
function objetContact() {
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
    products: recupererIdsFromCache()
  }
  console.log(body)
  return body
}

//Récupération des ids des produits envoyés dans le localStorage
function recupererIdsFromCache() {
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
