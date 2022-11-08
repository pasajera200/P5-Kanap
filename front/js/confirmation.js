const orderId = recupererOrderId()
affichageOrderId(orderId)
effacerCache()

//Récupére l'orderId avec urlParams.get
function recupererOrderId() {
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
return urlParams.get('orderId');
 }

//Affiche orderId après validation de la commande
function affichageOrderId() {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

//Suprimme toutes les données envoyées dans le localStorage
function effacerCache() {
    const cache = window.localStorage
    cache.clear()
}

