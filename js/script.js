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
    //on récupère le film aléatoire
    let genreMovies = await fetchMoviesByGenre(randomGenre.id);
    const movie = genreMovies[0];
    const year = movie.release_date.slice(0, 4);

    //on récupère les traductions possibles du film
    let languageMovie = await fetchMovieLanguages(movie.id);
    let language = languageMovie.translations;
    //on créé la boucle pour trouver la langue FR
    for(let i=0; i<language.length; i++){ 
      let language2 = language[i];
      //si langue FR trouvée, alors on va prendre le titre et le résumé du film
      if(language2.iso_3166_1 == "FR"){
      
        let languageTitle = language2.data;
        languageTitle=languageTitle.title;
        let languageOverview = language2.data;
        languageOverview=languageOverview.overview;

      //si le titre ou le synopsis sont vide, alors on va afficher le titre ou le résumé original
      if(languageTitle.length === 0){
        document.getElementById('movieName').textContent = movie.title;
        // let movieTitle = movie.title;
      }else{
        document.getElementById('movieName').textContent = languageTitle;
        // movieTitle = languageTitle;
      } 
      if(languageOverview.length === 0){
        document.getElementById('movieResume').textContent = movie.overview;
      }else{
        document.getElementById('movieResume').textContent = languageOverview;
      }
        break
      //si pas de langue FR trouvée, on va alor afficher normalement en original
      }else{
        document.getElementById('movieName').textContent = movie.title;
        document.getElementById('movieResume').textContent = movie.overview;
        // let movieTitle = movie.title;

      }
    }
    //on affiche le poster et l'année de sortie
    document.getElementById('movieJacket').src = IMG_URL + movie.poster_path;
    document.getElementById('movieYear').textContent = year;

    //on récupère les informations de casting et d'équipe
    const movieCredits = await fetchMovieCredits(movie.id);
    const cast = movieCredits.cast;
    const crew = movieCredits.crew;
    let actors = [];
    //on boucle pour trouver les 5 premiers acteurs du film et les afficher
    for(let i=0; i<5;i++){
     let cast2 = cast[i];
    actors.push(' ' + cast2.name);
    }
    document.getElementById('cast').textContent = 'Cast by : ' + actors ;

    //on boucle pour trouver le réalisateur du film et l'afficher
    for(let i=0; i<crew.length; i++){
      let crew2 = crew[i];
      if(crew2.job == "Director"){
        crew2 = crew2.name;
        document.getElementById('movieDirector').textContent = 'Directed by : ' + crew2 ;
      }

    }
    //on créé le lien pour le bouton pour rediriger vers la plateforme de streaming movie-web
    document.querySelector('#stream').addEventListener('click', async () => {
    let url = `https://movie-web-me.vercel.app/#/media/tmdb-movie-${movie.id}`
    document.querySelector('#stream').setAttribute('href',url); 
  })

  const titleFormat = await movieTitleFormat(movie.title);
  console.log(typeof titleFormat);


  document.querySelector('#JustWatch').addEventListener('click', async () => {
    let url = `https://www.themoviedb.org/movie/${movie.id}-${titleFormat}/watch?language=fr`
    document.querySelector('#JustWatch').setAttribute('href',url); 
  })
  //on gère les erreurs de base
  } catch (err) {
    console.error(err);
  }

});


//fonction qui va chercher un film aléatoirement
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


//fonction qui va chercher les crédits du film
async function fetchMovieCredits(movieId){
  let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
  let data = await response.json();
  return data;
}


//fonction qui va chercher les traductions du film
async function fetchMovieLanguages(movieId){
  let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/translations`, options)
  let data = await response.json();
  return data;
}

let regex = /[',./-:_(){}?!§£$&"'=*@]/g

async function movieTitleFormat(movieTitle){
  let titleFormat = movieTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(" ").splice(0,6).join(" ").replaceAll(regex, '').split(" ").join("-").toLowerCase()
  console.log(titleFormat);

  return titleFormat;
}