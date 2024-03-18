const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzUzYzZlODViZDU5ZDM2OGE2MDJmZDYwZmM5ODg2NCIsInN1YiI6IjY1Zjg1N2QwYWUzODQzMDE2NDRhZTc5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aVB-ASkpiHWzORGjq227KnZqgpU5M_D92tkSE9fOsbo'
    }
  };
  
  fetch('https://api.themoviedb.org/3/authentication', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

//CLE API
const API_KEY='3753c6e85bd59d368a602fd60fc98864';
//URL ORIGINELLE
const BASE_URL = 'https://api.themoviedb.org/3/';
//URL AVEC TON API
const API_URL = BASE_URL + 'discover/movie?sort_by=top-rated&' + API_KEY ;
//URL DES IMAGES
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const input = document.querySelector('.search input');
const btn = document.querySelector('.search button');
const main_title = document.querySelector('.movie');

async function get_movie_by_search (search_term) {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`);
    console.log(resp);
    const respData = await resp.json();
    return respData.results;
}

btn.addEventListener('click', add_searched_movie_to_dom);

async function add_searched_movie_to_dom(){
    const data = await get_movie_by_search(input.value)
    console.log(data);

}



// == By Search ==
// https://api.themoviedb.org/3/search/movie?api_key=here-goes-api-key&query=here-goes-seach-term

// == By ID ==
// https://api.themoviedb.org/3/movie/${id}?api_key=here-goes-api-key
// The /movie/latest method holds the id of the latest movie which at the time of me writing this is currently sitting at 373816.

// == Movie Trailer ==
// https://api.themoviedb.org/3/movie/${id}/videos?api_key=here-goes-api-key

// == Trending Movies ==
// https://api.themoviedb.org/3/trending/all/day?api_key=here-goes-api-key

// == Iframe for youtube video ==
// <iframe width="560" height="315" src="https://www.youtube.com/embed/here-goes-movie-path-trailer" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

// == Example Video ==
// https://www.youtube.com/watch?v=Kmo8NLKkfcQ