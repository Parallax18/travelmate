const heroHeader = document.getElementById('hero-header')
const viewedLocation = JSON.parse(localStorage.getItem('viewedLocation'))
const buttons = document.querySelectorAll('.btn');
const heroImg = document.querySelector('#hero-img');



// MODIFY STATE OF PAGE FOR SELECTED LOCATION
function setPageState () {
    heroHeader.innerText = viewedLocation.name;

    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click', (e) => makeChoice(e))
    }

}

setPageState()

// Search nearby places within a city
function nearbySearch(type){
    const request = {
        location,
        type,
        radius: 5000000
    }
    var service = new google.maps.places.PlacesService(map);

    const lat = viewedLocation.geometry.location.lat
    const lng = viewedLocation.geometry.location.lng
    var location = new google.maps.LatLng(lat, lng)
    request.location = location
    request.type = [...request.type, 'attractions']


    service.nearbySearch(request, (res, status) => {
        localStorage.setItem('places', JSON.stringify(res))

        if (status == google.maps.places.PlacesServiceStatus.OK){
            for (let i = 0; i < res.length; i++) {
                if(res[i].business_status ==="OPERATIONAL"){
                    window.location.href = 'http://127.0.0.1:5500/src/views/map.html'
                }
            }
        }
    });
}


// Choose from hotes|restaurants|others
function makeChoice(e) {
    const choices = {
        "hotels-btn" : "lodging",
        "restaurants-btn" : "restaurant",
        "attractions-btn" : "tourist_attraction",
        "destinations-btn" : "cafe"
    }

    for (const key in choices) {
        if (Object.hasOwnProperty.call(choices, key)) {
            if(e.target.id == key){
                nearbySearch(choices[key])
            }
        }
    }
}