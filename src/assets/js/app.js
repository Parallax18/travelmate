//Select the main search field box
const searchInputOpen = document.querySelector('#search-input-open');

//Select the search field
const searchInput = document.querySelector('#search-input');

// get the modals on the page
const modal = document.querySelector('#modal');
const modalBackdrop = document.querySelector('#modal-bg');
modal.remove();

let searchResultList;
let getNext;
let placesIDs = []

// Auto complete function to help get the locations
function autoComplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        mapTypeId: "roadmap",
    });

    // Create the search box and link it to the UI element.
    var service = new google.maps.places.PlacesService(map);
    

    // check if the input field value count is greater than equals to 3
    // if true run the google services api
    if (searchInput.value.length >= 3) {
        service.textSearch({
            query: searchInput.value
        }, (places, status, pages) => {

            //Check if search value is a city 
            for (let i = 0; i < places.length; i++){
               
                localStorage.setItem('viewedLocation', JSON.stringify(places))

                if (places[i].types[0] == "locality" && !places[i].business_status ){
                    // placesIDs = [...placesIDs, places[i].place_id,]

                    placesIDs = [...placesIDs, {
                        placeId: places[i].place_id, 
                        location: places[i].geometry.location,
                        type: 'locality'
                    }]
                    console.log(placesIDs)

                       // Store IDs and locations of places in an array
                    buildSearchResult(places[i], "locality", places)

                }else if(places[i].business_status){    //cities do not have business_status property
                    // get only operational places
                    if(places[i].business_status ==="OPERATIONAL"){
                        // placesIDs = [...placesIDs, places[i].place_id,]    // Store IDs and locations of places in an array
                        placesIDs = [...placesIDs, {
                            placeId: places[i].place_id, 
                            location: places[i].geometry.location
                        }]
                        buildSearchResult(places[i], "others", places)
                    }
                }
            console.log(placesIDs)
            localStorage.setItem('placesIDs', JSON.stringify(placesIDs))    //Push array of IDs to local storage
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

// Open the custom modal when the search button is clicked
searchInputOpen.addEventListener('click', () => {
    document.body.classList.add('modal-open')
    document.body.appendChild(modal)
    searchResultList = document.getElementById('search-result-list')
})

modalBackdrop.addEventListener('click', () => {
    document.body.classList.remove('modal-open')
    modal.remove()
})


// Build search results in the custom modal
function buildSearchResult (result, type, places) {
    const resultItem = document.createElement('li')

    resultItem.innerHTML = `
    <li class="flex justify-between w-full mb-5 cursor-pointer">
        <div>
            <p class="font-medium text-base">${result.name}</p>
            <p class=" text-sm text-gray-400">
            ${result.formatted_address ? result.formatted_address : "----_--"}
            </p>
        </div>
        <div>
            <img src=${result?.photos[0]?.getUrl()} alt=${result.name} class="w-14 h-14 object-cover"/>
        </div>
    </li>
    `

    for(let i = 0; i < placesIDs.length; i++){
        console.log(type)
        resultItem.addEventListener('click', () => { 
            resultItem.id = placesIDs[i]
            localStorage.setItem('selectedPlace', JSON.stringify(resultItem.id))
            if (type === "locality") {
                window.location.href = './places.html'
            }else {
                window.location.href = './map.html'
            }
        })
    }

    console.log(result)
    // Check of the selected place is a country
    // If is a country it opens the places.. else goes straight to map
    // localStorage.setItem('items', JSON.stringify(result))


    if (type == "locality"){
        resultItem.addEventListener('click', (e) => {
            window.location.href = './places.html'
            for(let i = 0; i < placesIDs.length; i++){
                resultItem.id  = placesIDs[i].placeId
                localStorage.setItem('selectedPlace', JSON.stringify(placesIDs[i]))
            }
        })
    }else {
        // localStorage.setItem('places', JSON.stringify(result))
        resultItem.addEventListener('click', (e) => {
            window.location.href = './map.html'
            // viewLocality(result, places)
                for (let i = 0; i < placesIDs.length; i++) {
                    resultItem.id = placesIDs[i].placeId
                    localStorage.setItem('selectedPlace', JSON.stringify(placesIDs[i]))
                }
            }
        )
    }

    searchResultList.appendChild(resultItem)
}