var searchResultList = document.querySelector(".searchItem");
var searchInput = document.querySelector('#search-input');
var getNext;
var service;

// Build places components
function buildPlaces(result) {
    const placeCard = document.createElement('div');

    const photo = '../assets/imgs/heromain.jpg'

    placeCard.innerHTML = `
<div class="d-flex flex-row pb-2 pt-2"> 
  <div class="background-center-center background-cover me-2 pointImg" style="background-image:url('${result?.photos[0]?.getUrl() ?? ""}')"></div>                                 
    <div class="pointData"> 
        <div class="pointName"> <span>${result.name}</span> 
        </div>                                     
        <div class="pointRating"> <span>${result.rating}</span> 
        </div>                                                                        
    </div>                                 
</div>
`
    placeCard.addEventListener('click', () => viewOnMap(result))
    searchResultList.appendChild(placeCard)
}


// If the search was not a country, It will give an array
// Checking if it is an array or not
// if (places[0]) {
//     for (i = 0; i < places.length; i++) {
//         buildPlaces(places[i])
//     }
// } else {
//     buildPlaces(places)
// }


// Initialize map to load first place on the list
var map;
var infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        mapTypeId: "roadmap",
    });

    service = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();
    // let lat;
    // let lng;
    //
    // if (places[0]) {
    //     lat = places[0].geometry.location.lat
    //     lng = places[0].geometry.location.lng
    // } else {
    //     lat = places.geometry.location.lat
    //     lng = places.geometry.location.lng
    // }
    //
    // map = new google.maps.Map(document.getElementById("map"), {
    //     center: {lat, lng},
    //     zoom: 8,
    // });
    //
    // // set marker
    // new google.maps.Marker({
    //     position: {lat, lng},
    //     map,
    //     title: places[0] ? places[0].name : places.name,
    // });
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

                buildPlaces(places[i]);

                // if (places[i].types[0] == "locality" && !places[i].business_status) {
                //     buildPlaces(places[i], "locality", places)
                // } else if (places[i].business_status) {    //cities do not have business_status property
                //     // get only operational places
                //     if (places[i].business_status === "OPERATIONAL") {
                //         buildSearchResult(places[i], "others", places)
                //     }
                // }
            }
            getNext = pages;
        })
    }
}

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

// Viewing selected place on map
async function viewOnMap(place) {
    const lat = place.geometry.location.lat
    const lng = place.geometry.location.lng

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat, lng},
        zoom: 17,
    });

    new google.maps.Marker({
        position: {lat, lng},
        map,
        title: place.name,
    });
}


