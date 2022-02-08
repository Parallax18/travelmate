const heroHeader = document.getElementById('hero-header')
// const viewedLocation = JSON.parse(localStorage.getItem('placesIDs'));
// Get selected place ID
const selectedPlace = JSON.parse(localStorage.getItem('selectedPlace'));
const buttons = document.querySelectorAll('.btn');
const heroImg = document.querySelector('#hero-img');

// console.log(viewedLocation[0])

const getPlaceDetails = () => {
    const lat = selectedPlace.location.lat;
    const lng = selectedPlace.location.lng
    var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 8,
        mapTypeId: "roadmap",
    });

    const request = {
        placeId: selectedPlace.placeId,
        fields: ['name', 'rating',  'geometry', 'photos', 'icon', 'types']
    }

    let service = new google.maps.places.PlacesService(map);
    service.getDetails(request, (place) => {
        console.log(place)
        setPageState(place)
    })
}

getPlaceDetails()

// MODIFY STATE OF PAGE FOR SELECTED LOCATION
function setPageState (viewedLocation) {
    heroHeader.innerText = viewedLocation.name;

    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click', (e) => makeChoice(e, viewedLocation))
    }
    const placeImg = viewedLocation.photos[0].getUrl()
    heroImg.src = placeImg
    console.log(placeImg)
}


// Search nearby places within a city
function nearbySearch(type, viewedLocation){
    const request = {
        location,
        type,
        radius: 5000000
    }
    var service = new google.maps.places.PlacesService(map);

    const lat = viewedLocation.geometry.location.lat
    const lng = viewedLocation.geometry.location.lng
    var location = new google.maps.LatLng(lat(), lng())
    request.location = location
    request.type = [type]

    service.nearbySearch(request, (res, status) => {
        localStorage.setItem('places', JSON.stringify(res))

        if (status == google.maps.places.PlacesServiceStatus.OK){
            for (let i = 0; i < res.length; i++) {
                if(res[i].business_status ==="OPERATIONAL"){
                    window.location.href = './map.html'
                }
            }
        }
    });
}


// Choose from hotels|restaurants|others
function makeChoice(e, viewedLocation) {
    const choices = {
        "hotels-btn" : "lodging",
        "restaurants-btn" : "restaurant",
        "attractions-btn" : "tourist_attraction",
        "destinations-btn" : "cafe"
    }

    for (const key in choices) {
        if (Object.hasOwnProperty.call(choices, key)) {
            if(e.target.id == key){
                console.log('clicked')
                nearbySearch(choices[key], viewedLocation)
            }
        }
    }
}