// javascript
//http://www.omdbapi.com/?t=batman&y=2022&plot=full

// chache the data so that we don't have to consult localstorage each time we need access the watchlist (will happen many times)
const watchlistMovies = JSON.parse(localStorage.getItem('watchlist')) || []


let searched = false
let copyObj = []
let apikey = '825e5e05'
const containerDiv = document.getElementById('container')
const homePage = document.getElementById('home-page')
const searchValue = document.getElementById('search-bar')
const watchlistDiv = document.getElementById('watchlist-div')
const watchlist  = document.getElementById('watchlist')
const findFlim = document.getElementById('findFlim')

watchlist.addEventListener('click',()=>{
    containerDiv.style.display='none'
    watchlistDiv.style.display='block'
        // Render the watchlist using the renderResult logic but passing the renderWatchlist option to true
    watchlistDiv.innerHTML=''
     for (const movie of watchlistMovies){
        renderResult(movie,true)
    }
})
findFlim.addEventListener('click',()=>{
    containerDiv.style.display='block'
    watchlistDiv.style.display='none'
   
})

document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('watchlist-btn')){
       const movieId = e.target.getAttribute('data-movie') 
       isInWatchlist(movieId) ? removeFromWatchlist(e.target,movieId)
                              : addToWatchlist(e.target,movieId)
    }
})




function handleClick(){
    
    searched = true
    
    if(searched){
        containerDiv.textContent = ''
        searched = false
    }
    
        containerDiv.style.display='block'
        watchlistDiv.style.display='none'
    
    
        fetch(`https://www.omdbapi.com/?s=${searchValue.value}&plot=short&apikey=${apikey}&type=movie`)
        .then(res=>res.json())
        .then(data => {
            const dataArray = data.Search
            for(let data of dataArray){
            fetch(`https://www.omdbapi.com/?plot=short&apikey=${apikey}&type=movie&i=${data.imdbID}`)
            .then(res=>res.json())
            .then(data => {
               
               copyObj.unshift(data)
                if (data.Plot !== 'N/A' && data.Poster !== "N/A") {
                        renderResult(data,false)
                    } 
              })
        }
 
   })
.catch(error => console.log(error))
}

    
document.getElementById('search-btn').addEventListener('click',handleClick)

function renderResult(data,isAdded = false){
    homePage.style.display='none'
    //Object.assign(copyObj,data)
     let html =``

       html =`
    <div id="data-div" >
        <img id='poster' src = '${data.Poster}'>
        <div id='details-div'>
        <div>
            <h3 id= 'title'  class='${data.imdbID}' >${data.Title}</h3>
            <span id = 'rating'>${data.imdbRating}</span>
            <span id='watchlist-span'>Add to watchlist<button class='watchlist-btn' data-movie='${data.imdbID}'>
            ${isInWatchlist(data.imdbID) ? '-' : '+'}
            </button></span>
            </div>
            <div id='runtime-others'><span>${data.Runtime}</span><span>${data.Genre}</span></div>
            <p id='plot'>${data.Plot}</P>
        </div>
    </div>
    `
    
    //here i was following onclick=addToWatchlist(this) approach for for getting the imdbId
        //}
        if(isAdded){
            watchlistDiv.innerHTML += html
            
        }else{
           containerDiv.innerHTML += html 
        }
        
     
}
 // verify if the movies is in watchlist so that we can perfom a different logic based on the result
function isInWatchlist(movieId){
    return watchlistMovies.some(item => item.imdbID == movieId) 
}

 function addToWatchlist(button,movieId) {
     
  /* const movieTitle = button.parentNode.parentNode.querySelector('h3').textContent;
   const movieId = button.parentNode.parentNode.querySelector('h3').classList[0];
   const data = button.parentNode.parentNode.parentNode.parentNode.querySelector('div').innerHTML;*/
   //this approach was taken for getting the imdbid of movies through button 
   

 // Output: Title: movie title here
   //console.log(`ID: ${movieId}`); // Output: ID: imdb ID here
   //console.log(copyObj)
   
   const movie = copyObj.find(item => item.imdbID === movieId)
   //console.log(movie)
     watchlistMovies.push(movie)
     
   localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
   
    button.textContent = '-' 
  // if (watchlistDiv.style.display === 'block') {
        // Render the newly added movie in the watchlist
       // renderResult(movie, true)
    //}
     
}
function removeFromWatchlist(button, movieId ){
    const movieIndex = watchlistMovies.findIndex(movie => movie.imdbID == movieId)
    watchlistMovies.splice(movieIndex, 1)
    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies))
    button.textContent = '+'  
    // If we remove a move from watchlist we want to automatically see the result. So, we update the DOM without the removed movied
    if (watchlistDiv.style.display == 'block'){
        watchlistDiv.innerHTML = ''
        for(movie of watchlistMovies){
            renderResult(movie,true)
        }
    }
}

/*function addToWatchlist(button, movieId) {
    const movie = foundMovies.find(item => item.imdbID === movieId)
    watchlistMovies.push(movie)
    // push the updated watchlistMovies array
    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies))
    button.textContent = '-' */