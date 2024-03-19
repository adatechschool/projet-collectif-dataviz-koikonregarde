///////////////////////
//initialisation de notre KEY et site de base
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
//écoute du bouton pour lancer le premier film aleatoire
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

    const movieCredits = await fetchMovieCredits(movie.id);
    console.log(movieCredits);

    const cast = movieCredits.cast;
    const crew = movieCredits.crew;

    console.log(cast);
    console.log(crew);
    let actors = [];

    for(let i=0; i<5;i++){
     let cast2 = cast[i];
    actors.push(' ' + cast2.name);
     console.log(actors);
    }
    document.getElementById('cast').textContent = 'Cast by : ' + actors ;


    for(let i=0; i<crew.length; i++){
      let crew2 = crew[i];
      if(crew2.job == "Director"){
        crew2 = crew2.name;
        document.getElementById('movieDirector').textContent = 'directed by : ' + crew2 ;
      }

    }

    document.querySelector('#stream').addEventListener('click', async () => {
    let url = `https://movie-web-me.vercel.app/#/media/tmdb-movie-${movie.id}`
    document.querySelector('#stream').setAttribute('href',url); 
  })

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

async function fetchMovieCredits(movieId){
  let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
  let data = await response.json();
  return data;
}
  // fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
  // .then(response => response.json())
  // .then(response => console.log(response))
  // let responseCredits = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, options);
  // let dataCredits = await response.json();
  // console.log(dataCredits);

