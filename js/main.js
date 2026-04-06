"use strict";

const resultsUl = document.querySelector(".js_results");
const favouriteUl= document.querySelector(".js_favouriteUl");

let seriesData = [];

function handleClickLi (ev) {
console.log('click');

ev.currentTarget.classList.toggle("favourite");

console.log(ev.currentTarget.dataset.id);

const clickedId = parseInt(ev.currentTarget.dataset.id); //parseInt para que devuelva un número

const clickedSeries = seriesData.find(eachObject => eachObject.show.id === clickedId);

if (clickedId !== undefined ) {
  console.log(clickedSeries);
  const liHtml = renderOneSeries(clickedSeries);

  favouriteUl.innerHTML += liHtml;

  ev.currentTarget.classList.toggle("favourite");
  }

}


function renderOneSeries(oneSeriesObj) {
  const html = `
            <li class="js_series series-card" data-id="${oneSeriesObj.show.id}">
                <img src="${oneSeriesObj.show.image.medium}" alt="Serie-nova">
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
    const allSeriesLi = document.querySelectorAll (".js_series"); // el evento no se puede poner directamente al array y por eso se hace un bucle
  for (const li of allSeriesLi){
  li.addEventListener('click', handleClickLi);
}
  });




