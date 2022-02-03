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
            console.log(places)

            for (let i = 0; i < places.length; i++) {
                // get only operational places
                if(places[i].business_status ==="OPERATIONAL"){
                    buildSearchResult(places[i])
                }
            }
            getNext = pages;
        })
    }
}

// Debounce function to reduce amount of API calls
// This will only call the autoComplete fn is no key is pressed under 2 sec
let timer;

function debounce() {
    console.log('typing....')
    clearTimeout(timer);
    timer = setTimeout(() => {
        searchResultList.innerHTML = ""
        autoComplete();
    }, 2000);

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
const buildSearchResult = (result) => {
    const resultItem = document.createElement('li')

    resultItem.innerHTML = `
    <li class="flex justify-between w-full mb-5 cursor-pointer">
        <div>
            <p class="font-medium text-base">${result.name}</p>
            <p class=" text-sm text-gray-400">${result.formatted_address}</p>
        </div>
        <div>
            <img src=${result?.photos[0]?.getUrl()} alt=${result.name} class="w-14 h-14 object-cover"/>
        </div>
    </li>
    `
    searchResultList.appendChild(resultItem)
}
