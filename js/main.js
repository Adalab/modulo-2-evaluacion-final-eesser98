"use strict";

const resultsUl = document.querySelector(".js_results");
const favouriteUl = document.querySelector(".js_favouriteUl");

const searchBtn = document.querySelector(".js_searchBtn");
const filterInput = document.querySelector(".js_filterInput");

let seriesData = [];
let favouritesData = [];

function handleClickSearch(ev) {
  ev.preventDefault();
  fetch(`https://api.tvmaze.com/search/shows?q=${filterInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      seriesData = data.map((eachObj) => eachObj.show);

      renderAllSeries(seriesData);
    });
}

searchBtn.addEventListener("click", handleClickSearch);

/*
function handleClickSearch (ev){
  ev.preventDefault();
  console.log("has hecho click");

  // recueperar el value del input 
  const typedValue = filterInput.value
  console.log(typedValue);

  //filtrar todos los resultados 
  const filteredSeries = seriesData.filter (eachObj => 
    eachObj.name.toLowerCase().includes(typedValue.toLowerCase()));

  //pintar los resultados 
  renderAllSeries(filteredSeries);
  }
 */

function addEventsToSeries() {
  const allSeriesLi = document.querySelectorAll(".js_series"); // Seleccionamos todos los LI
  for (const li of allSeriesLi) {
    li.addEventListener("click", handleClickLi);
  }
}

function handleClickLi(ev) {
  const clickedId = parseInt(ev.currentTarget.dataset.id);

  // Buscamos la serie en el array original
  const clickedSeries = seriesData.find(
    (eachObject) => eachObject.id === clickedId,
  );

  // Buscamos si ya está en favoritos
  const favsIndex = favouritesData.findIndex(
    (eachObj) => eachObj.id === clickedId,
  );

  if (favsIndex !== -1) {
    // Si ya está, la quitamos
    favouritesData.splice(favsIndex, 1);
  } else {
    // Si no está, la añadimos
    favouritesData.push(clickedSeries);
  }

  // Guardamos en LS y RE-PINTAMOS TODO
  localStorage.setItem("favs", JSON.stringify(favouritesData));

  renderAllSeries(seriesData); // Esto hace que cambie el color en la lista principal
  renderAllFavourites(); // Esto actualiza la lista de la derecha
}

function renderOneSeries(oneSeriesObj) {
  let image = oneSeriesObj.image
    ? oneSeriesObj.image.medium
    : "https://placehold.co/210x295/f5f5f5/666666/?text=TV";

  // Comprobar si es favorita para añadir la clase CSS
  const isFav = favouritesData.find((fav) => fav.id === oneSeriesObj.id);
  const favClass = isFav ? "favourite" : "";

  return `
    <li class="js_series series-card ${favClass}" data-id="${oneSeriesObj.id}">
        <img src="${image}" alt="${oneSeriesObj.name}">
        <p class="series-title">${oneSeriesObj.name}</p>
    </li>`;
}

function renderAllSeries(data) {
  let html = "";
  for (const oneSeriesObj of data) {
    html += renderOneSeries(oneSeriesObj);
  }
  resultsUl.innerHTML = html;

  addEventsToSeries();
}

function renderAllFavourites() {
  let html = "";
  for (const oneSeriesObj of favouritesData) {
    html += renderOneSeries(oneSeriesObj);
  }
  favouriteUl.innerHTML = html;
}

function retrieveData() {
  const seriesFromLS = JSON.parse(localStorage.getItem("cache"));

  if (seriesFromLS) {
    seriesData = seriesFromLS;
    renderAllSeries(seriesData);
  } else {
    fetch("https://api.tvmaze.com/shows")
      .then((res) => res.json())
      .then((data) => {
        seriesData = data;
        localStorage.setItem("cache", JSON.stringify(seriesData));
        renderAllSeries(seriesData);
      });
  }
}

function retrieveFavs() {
  const favouritesFromLS = JSON.parse(localStorage.getItem("favs"));
  if (favouritesFromLS) {
    favouritesData = favouritesFromLS;
    renderAllFavourites();
  }
}

retrieveFavs();
retrieveData();
