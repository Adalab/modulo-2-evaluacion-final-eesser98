"use strict";

const resultsUl = document.querySelector(".js_results");
const favouriteUl = document.querySelector(".js_favouriteUl");

let seriesData = [];

let favoritesData =[];

const favoritesFromLS = JSON.parse(localStorage.getItem("favs"));

if (favoritesFromLS){
  favoritesData = favoritesFromLS;

  renderAllFavourites();
}

function renderAllFavourites(){
  let html = "";
  for (const oneSeriesObj of favoritesData) {
    html += renderOneSeries(oneSeriesObj);
  }
  favouriteUl.innerHTML = html;
}

function handleClickLi(ev) {
  console.log("click");

  // esto es el LI donde se hace click. Cambia el fondo del LI
  ev.currentTarget.classList.toggle("favourite");

  console.log(ev.currentTarget.dataset.id);

  // recupero el id del LI clickado
  const clickedId = parseInt(ev.currentTarget.dataset.id); //parseInt para que devuelva un número

  // busco obj con los datos del array, usando el id del LI donde se ha hecho clik
  const clickedSeries = seriesData.find(
    (eachObject) => eachObject.show.id === clickedId,
  );

  // si encuentra datos, 
  if (clickedSeries !== undefined) {
    favoritesData.push(clickedSeries);
    localStorage.setItem('favs', JSON.stringify(favoritesData));

    console.log(clickedSeries);
    //generamos un li
    const liHtml = renderOneSeries(clickedSeries);
    //lo ponemos en la página (lista de favos)
    favouriteUl.innerHTML += liHtml;
  }
}

function renderOneSeries(oneSeriesObj) {
  let image = "";

  // condicional por si la serie no tiene img, si no da fallo
  if (oneSeriesObj.show.image) {
    image = oneSeriesObj.show.image.medium;
  } else {
    image = "https://placehold.co/210x295/f5f5f5/666666/?text=TV";
  }

  const html = `
            <li class="js_series series-card" data-id="${oneSeriesObj.show.id}">
                <img src="${image}" alt="Serie-nova">
                <p class="series-title">${oneSeriesObj.show.name}</p>
            </li>`;
  return html;
}

function renderAllSeries(seriesData) {
  let html = ""; // esto es mejor cuando el array contiene imagenes
  for (const oneSeriesObj of seriesData) {
    html += renderOneSeries(oneSeriesObj);
  }
  resultsUl.innerHTML = html;
}

fetch("https://api.tvmaze.com/search/shows?q=girls") // esto devuelve una promesa
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    seriesData = data;
    renderAllSeries(seriesData); // llamada a la funcion que pinta las series
    const allSeriesLi = document.querySelectorAll(".js_series"); // el evento no se puede poner directamente al array y por eso se hace un bucle
    for (const li of allSeriesLi) {
      li.addEventListener("click", handleClickLi);
    }
  });
