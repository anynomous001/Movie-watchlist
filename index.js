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
                <img id='star-icon' src="data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EStarred User%3C/title%3E%3Cdesc%3EA line styled icon from Orion Icon Library.%3C/desc%3E%3Cpath data-name='layer2' d='M39.8 51H2s0-7 9.4-8.8S20 38.6 20 37v-2a14.2 14.2 0 0 1-4-7c-2.5 0-4-3-4-6 0-.8 0-4 2-4-1.6-6.4-.4-13 4-13 10.4-7 25-1.5 20 13 2 0 2 3.2 2 4 0 3-1.5 6-4 6a14.1 14.1 0 0 1-4 7v2c0 1.1.5 3 3.9 4l6.8 1.7' fill='none' stroke='%23202020' stroke-miterlimit='10' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3Cpath data-name='layer1' fill='none' stroke='%23202020' stroke-miterlimit='10' stroke-width='2' d='M46 54.9L36.1 62l3.8-11.5L30 44h12.2L46 32l3.8 12H62l-9.9 6.5L55.9 62 46 54.9z' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E" alt="Starred User" /><span id = 'rating'>${data.imdbRating}</span> <br>
                <span id='watchlist-span'>Add to watchlist<button class='watchlist-btn' data-movie='${data.imdbID}'>
                ${isInWatchlist(data.imdbID) ? '-' : '+'}
                </button></span>
            </div>
                <div id='runtime-others'><span>${data.Runtime}</span><span>${data.Genre}</span></div>
                <p id='plot'>${data.Plot}</P>
            </div>
    </div>
    <hr>
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