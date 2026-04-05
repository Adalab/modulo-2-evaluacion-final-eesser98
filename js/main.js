"use strict";

const resultsUl = document.querySelector(".js_results");

let seriesData = [];

function renderOneSeries(oneSeriesObj) {
  const html = `
            <li class="series-card">
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
  });
