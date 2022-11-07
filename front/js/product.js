const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
if (id != null) {
  let nom;
  let imagUrl, altTexte;
}

//Nous récupérons les données (array) avec la méthode fetch
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => getProduct(res));

//Nous récupérons tous les parametres des produits
function getProduct(canape) {
  const { altTxt, colors, description, imageUrl, name, price, _id } = canape;
  nom = name;
  priceProduct = price;
  imagUrl = imageUrl;
  altTexte = altTxt;
  kanapImage(imageUrl, altTxt);
  kanapTitle(name);
  kanapPrice(price);
  kanapDescription(description);
  kanapColors(colors);
}

//Affiche l'image du produit
function kanapImage(imageUrl, altTxt) {
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector('.item__img');
  if (parent != null) parent.appendChild(image);
}

//Affiche le nom du produit
function kanapTitle(name) {
  const h1 = document.querySelector('#title');
  if (h1 != null) h1.textContent = name;
}

//Affiche le prix du produit
function kanapPrice(price) {
  const span = document.querySelector('#price');
  if (span != null) span.textContent = price;
}

//Affiche la description du produit
function kanapDescription(description) {
  const p = document.querySelector('#description');
  if (p != null) p.textContent = description;
}

//Affiche les options des couleurs des produits
function kanapColors(colors) {
  const menu = document.querySelector('#colors');
  if (menu != null) {
    colors.forEach((color) => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      menu.appendChild(option);
    });
  }
}
  
//Button ajouter au panier qui redirige vers la page cart
const button = document.querySelector('#addToCart');
button.addEventListener('click', addTocart);

//Ajouter au panier
function addTocart() {
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  if (commandeInvalide(color, quantity)) return;
  savecommande(color, quantity);
  window.location.href = 'cart.html';
}

//Validation de la commande
function commandeInvalide(color, quantity) {
  if (color == null || color === '' || quantity == null || quantity == 0) {
    alert('SVP, choisissez une couleur et une quantité');
    return true;
  }
}

//Subgarder la commande validée sur localStorage
function savecommande(color, quantity) {
  const key = `product-${id}-${color}`;
  const data = {
    id: id,
    color: color,
    name: nom,
    quantity: Number(quantity),
    imageUrl: imagUrl,
    altTxt: altTexte,
  };

  localStorage.setItem(key, JSON.stringify(data));
}
