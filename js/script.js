///////////////////////

const API_KEY = '3753c6e85bd59d368a602fd60fc98864';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzUzYzZlODViZDU5ZDM2OGE2MDJmZDYwZmM5ODg2NCIsInN1YiI6IjY1Zjg1N2QwYWUzODQzMDE2NDRhZTc5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aVB-ASkpiHWzORGjq227KnZqgpU5M_D92tkSE9fOsbo'
  }
};

////////////////////////

document.querySelector('#random-genre').addEventListener('click', async () => {
  try {
    let response = await fetch(BASE_URL + 'genre/movie/list?api_key=' + API_KEY, options);
    let data = await response.json();
    let randomGenre = data.genres[Math.floor(Math.random() * data.genres.length)];
    let genreMovies = await fetchMoviesByGenre(randomGenre.id);
    console.log(genreMovies);
    const movie = genreMovies[0];
    document.getElementById('movieJacket').src = IMG_URL + movie.poster_path;
    document.getElementById('movieName').textContent = movie.title;
    document.getElementById('movieResume').textContent = movie.overview;
  } catch (err) {
    console.error(err);
  }
});

async function fetchMoviesByGenre(genreId) {
  let minResult = 1;
  let maxResult = 50;
  minResult = Math.ceil(minResult);
  maxResult = Math.floor(maxResult);
  let randomNumb = Math.floor(Math.random() * (maxResult - minResult +1)) + minResult;
  let response = await fetch(BASE_URL + 'discover/movie?api_key=' + API_KEY + '&with_genres=' + genreId + '&sort_by=top-rated.desc&page='+ randomNumb);
  let data = await response.json();
  return data.results.slice(0,1);
}
