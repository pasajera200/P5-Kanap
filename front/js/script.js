let sofaData = [];
//Méthode Fetch pour aller chercher les données (les canapés) à l'API et les afficher sur la page d'accueil

const getProduits = async () => {
  await fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((produits) => {
      sofaData = produits;
    });
};

//La fonction suivante permet d'afficher l'ensemble de produits sur la page d'accueil.
//La méthode map sert à faire l'iteration des produits
//Ajout des balises dans le DOM grâce à inner.HTML

const sofaDisplay = async () => {
  await getProduits();

  //Méthode map pour faire une itération à travers les données.
  document.getElementById('items').innerHTML = sofaData
    .map(
      (sofa) => `<a href="./product.html?id=${sofa._id}">
    <article>
      <img src="${sofa.imageUrl}" alt="Photo d'un canapé bleu deux places${sofa.name}"/>
      <h3 class="productName">${sofa.name}</h3>
      <p class="productDescription">${sofa.description}</p>
    </article>
  </a>`
    )
    .join('');
};

sofaDisplay();
