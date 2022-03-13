var searchResultList = document.querySelector(".searchItem");
var searchInput = document.querySelector('#search-input');
var getNext;
var service;

const search = window.location.search

let searchParams = new URLSearchParams(search);

console.log(search)

const url = search;

console.log(url)

let lat =searchParams.get('lon') && Number(searchParams.get('lat')) ;
let lng = searchParams.get('lon') &&  Number(searchParams.get('lon')) ;

console.log({lat, lng})
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



    // console.log({places})
    //
    // if(!places){
    //     console.warn("failed to fetch location")
    //     return
    // }
    //
    // if (places[0]) {
    //     lat = places[0].geometry.location.lat
    //     lng = places[0].geometry.location.lng
    // } else {
    //     lat = places.geometry.location.lat
    //     lng = places.geometry.location.lng
    // }


    if(!lat || !lng){
        console.warn("no latitude or longitude passed")

        //Todo add fallback map
        return
    }
    console.log({lat,lng})

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 18,
    });

    // set marker
    // new google.maps.Marker({
    //     position: {lat, lng},
    //     map,
    //     title: places[0] ? places[0].name : places.name,
    // });
}


// Build places components
function buildPlaces(result) {
    console.log(result)
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



// Auto complete function to help get the locations
function autoComplete() {
    // check if the input field value count is greater than equals to 3
    // if true run the google services api
    if (searchInput.value.length >= 3) {
        service.textSearch({
            query: searchInput.value
        }, (places, status, pages) => {
            console.log(places)

            //Check if search value is a city
            for (let i = 0; i < places.length; i++) {
                console.log(places[i])

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
    lat = place.geometry.location.lat
    lng = place.geometry.location.lng

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


