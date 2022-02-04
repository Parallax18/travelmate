const places = JSON.parse(localStorage.getItem('places'))
const sideBar = document.getElementById('side-bar');

// Build paces components
function buildPlaces(place)  {
    const placeCard = document.createElement('div');

    const photo =  '../assets/heromain.jpg'

    placeCard.innerHTML = `
    <div class="bg-white rounded-md flex shadow-md mb-5 max-h-36 cursor-pointer">
    <img src=${photo} alt="img" class="h-36 w-32 object-cover"/>
    <div class="p-3 w-48 h-36">
        <!-- <p class="text-xs text-gray-500 bg-gray-300 p-1 rounded-md w-max mb-1">Place Type</p> -->
        <div class="relative h-full">
            <p class="text-sm text-gray-800 font-medium mb-0">${place.name}</p>
            <p class="text-xs text-gray-500 font-semibold">${place.vicinity == undefined ? '-----_---' : place.vicinity}</p>
            <div class="mt-1 flex justify-between items-center w-full absolute bottom-0">
                <div class=" text-xs text-gray-500 bg-gray-300 p-1 rounded-md w-max"><span class="text-gray-700 font-semibold mr-1">
                ${place.rating == undefined ? 'no rating' : place.rating}</span>${place.rating == undefined ? '' : 'star'}</div>
                <img src=${place.icon} alt="icon" class="w-4 h-4" />
            </div>
        </div>
    </div>
    </div>`

    placeCard.addEventListener('click', () => viewOnMap(place))
    sideBar.appendChild(placeCard)
}


// If the search was not a country, It will give an array
// Checking if it is an arrya or not
if(places[0]){
    for(i = 0; i < places.length; i++){
        buildPlaces(places[i])
    }
}
else{
    buildPlaces(places)
}


// Initialize map to load first place on the list
let map;
async function initMap() {
    let lat;
    let lng;
    if(places[0]){
        lat = places[0].geometry.location.lat
        lng =  places[0].geometry.location.lng
    }else{
        lat = places.geometry.location.lat
        lng =  places.geometry.location.lng
    }
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 8,
    });
    // set marker
    new google.maps.Marker({
        position: { lat, lng },
        map,
        title: places[0] ? places[0].name : places.name,
      });
}

// Viewing seclected place on map
async function viewOnMap(place) {
    const lat = place.geometry.location.lat
    const lng =  place.geometry.location.lng
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 17,
    });
    new google.maps.Marker({
        position: { lat, lng },
        map,
        title: place.name,
      });
}


initMap()

