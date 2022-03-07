//Select the search field
var searchInput = document.querySelector('#search-input');
var searchBox = document.querySelector('#searchBox');
var searchBtn = document.querySelector('#searchBtn');

var myModal = new bootstrap.Modal(document.getElementById('myModal'), {})

var searchResultList = document.querySelector(".searchItem");

var getNext;
var map;
var service;

function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        mapTypeId: "roadmap",
    });

    service = new google.maps.places.PlacesService(map);
}

// Auto complete function to help get the locations
function autoComplete() {
    // check if the input field value count is greater than equals to 3
    // if true run the google services api
    if (searchInput.value.length >= 3) {
        service.textSearch({
            query: searchInput.value
        }, (places, status, pages) => {

            //Check if search value is a city 
            for (let i = 0; i < places.length; i++) {

                // Create a new object to hold the images in local storage
                // places[i].image = places[i].photos[0].getUrl();

                if (places[i].types[0] == "locality" && !places[i].business_status) {
                    buildSearchResult(places[i], "locality", places)
                } else if (places[i].business_status) {    //cities do not have business_status property
                    // get only operational places
                    if (places[i].business_status === "OPERATIONAL") {
                        buildSearchResult(places[i], "others", places)
                    }
                }
            }
            getNext = pages;
        })
    }
}

// Debounce function to reduce amount of API calls
// This will only call the autoComplete fn if no key is pressed under half a sec
let timer;

function debounce() {
    console.log('typing....')
    clearTimeout(timer);
    timer = setTimeout(() => {
        searchResultList.innerHTML = ""
        autoComplete();
    }, 500);

};

// Fire the debounce function on keydown
searchInput.addEventListener('keydown', debounce)

searchBtn.addEventListener("click",()=>{

    // copying search box value to the modal search input
    searchInput.value = searchBox.value;
    debounce();
    myModal.show();
})

// Build search results in the custom modal
function buildSearchResult(result, type, places) {
    const resultItem = document.createElement('div')

    resultItem.innerHTML = `
<a href="./Map.html?name=${result.name}">
<div class="d-flex flex-row pb-2 pt-2"> 
    <div class="background-center-center background-cover me-2 pointImg" style="background-image:url('${result?.photos[0]?.getUrl() ?? ""}');"></div>     
    <div class="pointData"> 
        <div class="pointName"> <span>${result.name}</span> 
        </div>         
        <div class="pointRating"> <span> ${result.formatted_address ? result.formatted_address : "----_--"}</span> 
        </div>         
    </div>     
</div>
  </a>  `

    searchResultList.appendChild(resultItem);

    // Check of the selected place is a country
    // If is a country it opens the places.. else goes straight to map
    if (type == "locality") {
        resultItem.addEventListener('click', () => {
                window.location.href = './map.html'
                // viewLocality(result, places)
            }
        )
    } else {
        resultItem.addEventListener('click', () => {
                window.location.href = './map.html'
                // viewLocality(result, places)
            }
        )
    }


}

