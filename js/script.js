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

(function ( $ ) {

	$.fn.grtyoutube = function( options ) {

		return this.each(function() {

			// Get video ID
			var getvideoid = $(this).attr("youtubeid");

			// Default options
			var settings = $.extend({
				videoID: getvideoid,
				autoPlay: true,
				theme: "dark"
			}, options );

			// Convert some values
			if(settings.autoPlay === true) { settings.autoPlay = 1 } else if(settings.autoPlay === false)  { settings.autoPlay = 0 }
			if(settings.theme === "dark") { settings.theme = "grtyoutube-dark-theme" } else if(settings.theme === "light")  { settings.theme = "grtyoutube-light-theme" }

			// Initialize on click
			if(getvideoid) {
				$(this).on( "click", function() {
					 $("body").append('<div class="grtyoutube-popup '+settings.theme+'">'+
								'<div class="grtyoutube-popup-content">'+
									'<span class="grtyoutube-popup-close"></span>'+
									'<iframe class="grtyoutube-iframe" src="https://www.youtube.com/embed/'+settings.videoID+'?rel=0&wmode=transparent&autoplay='+settings.autoPlay+'&iv_load_policy=3" allowfullscreen frameborder="0" allow="autoplay; fullscreen"></iframe>'+
								'</div>'+
							'</div>');
				});
			}

			// Close the box on click or escape
			$(this).on('click', function (event) {
				event.preventDefault();
				$(".grtyoutube-popup-close, .grtyoutube-popup").click(function(){
					$(".grtyoutube-popup").remove();
				});
			});

			$(document).keyup(function(event) {
				if (event.keyCode == 27){
					$(".grtyoutube-popup").remove();
				}
			});
		});
	};

}( jQuery ));

//fonction qui va chercher un film aléatoirement
async function fetchMoviesByGenre(genreId) {
  let minResult = 1;
  let maxResult = 30;
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

   //on récupère le trailer
async function fetchMovieTrailer(movieId){
  let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, options)
  let data = await response.json();
  return data;
}

////////////////////////
//écoute du bouton pour lancer le premier film aleatoire
document.querySelector('#btn1').addEventListener('click', async () => {
  try {
    let response = await fetch(BASE_URL + 'genre/movie/list?api_key=' + API_KEY, options);
    let data = await response.json();
    let randomGenre = data.genres[Math.floor(Math.random() * data.genres.length)];
    //on récupère le film aléatoire
    let genreMovies = await fetchMoviesByGenre(randomGenre.id);
    const movie = genreMovies[0];
    const year = movie.release_date.slice(0, 4);

    const movieTrailer = await fetchMovieTrailer(movie.id);
    let trailer = movieTrailer.results;
   
    for(let i=0; i<trailer.length; i++){
      let trailer2 = trailer[i];
      if(trailer2.type == "Trailer"){
        trailer = trailer2.key;    
        }
    }

  async function videoSearchNotation(movieID){
    let response = await fetch('')

  }

    document.getElementById('nfo').innerHTML = `<div class="image-container">
    <img id="movieJacket" src="">
<div class="content">
    <h2 id="movieName"></h2>
    <p id="movieYear"></p>
    <h3 id="movieDirector"></h3>
    <h4 id="cast"></h4>
    <p id="movieResume"></p>
    <div id="movieTrailer"><span class="youtube-link" youtubeid="${trailer}">voir le trailer</span></div>

</div>    
</div>    
<div id="secondaryBtn">
    <a id="stream" href="https://movie-web-me.vercel.app/#/media/tmdb-movie-${movie.id}" target="_blank" ><span >Voir le film !</span></a>
    <a id="JustWatch" href="https://www.themoviedb.org/movie/${movie.id}/watch?language=fr" target="_blank" ><span>Ou voir le film ?</span></a>
</div>`


$(".youtube-link").grtyoutube(); 

    //on ajoute tout le HTML du site au clic
    
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
    document.getElementById('cast').textContent = 'Avec : ' + actors ;

    //on boucle pour trouver le réalisateur du film et l'afficher
    for(let i=0; i<crew.length; i++){
      let crew2 = crew[i];
      if(crew2.job == "Director"){
        crew2 = crew2.name;
        document.getElementById('movieDirector').textContent = 'Réalisé par : ' + crew2 ;
      }

    }


  //on gère les erreurs de base
  } catch (err) {
    console.error(err);
  }

});














// let regex = /[',./-:_(){}?!§£$&"'=*@]/g

// async function movieTitleFormat(movieTitle){
//   let titleFormat = movieTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(" ").splice(0,6).join(" ").replaceAll(regex, '').split(" ").join("-").toLowerCase()
//   console.log(titleFormat);

//   return titleFormat;
// }