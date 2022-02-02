const searchInput = document.querySelector('#search-input');
let searchResultList;


const searchInputOpen = document.querySelector('#search-input-open');
const modal = document.querySelector('#modal');
const modalBackdrop = document.querySelector('#modal-bg');
modal.remove();


let suggestions = [];

// Auto complete function
const autoComplete = (e) => {
    const event = e
    fetch(`https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query=${e.target.value}&lang=en_US&units=km`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "travel-advisor.p.rapidapi.com",
		"x-rapidapi-key": "5d63c720fdmshaa85f891267c44cp1dc110jsna83bb5c8a63d"
	}
})
.then(response =>  response.json())
.then(data => data.data.Typeahead_autocomplete.results)
.then(data => {
    console.log(event)
    data.forEach((item) => {
        const suggestedItem = {}
        suggestedItem.name = item.detailsV2.names.name == null ? "-----_---" : item.detailsV2.names.name
        suggestedItem.address = item.detailsV2.contact.streetAddress.street1 == null ? "-----_---" : item.detailsV2.contact.streetAddress.street1
        suggestedItem.img = item.image.photo.photoSizeDynamic.urlTemplate.replace('{height}', '100')
        suggestedItem.img = suggestedItem.img.replace('{width}', '100')
        suggestions = [...suggestions, suggestedItem]
        buildSearchResult(suggestedItem)


        return suggestions
    })
})
.catch(err => {
	console.error(err);
});
}

// Debounce funtion to reduce ammount of API calls
function debounce(e) {
    console.log('typing....')
    let timer;
    return (() => {
      clearTimeout(timer);
      timer = setTimeout(() => autoComplete(e), 2000);
    })();
};

searchInput.addEventListener('keydown', debounce) 

searchInputOpen.addEventListener('click', () => {
    document.body.classList.add('modal-open')
    document.body.appendChild(modal)
    searchResultList = document.getElementById('search-result-list')
    console.log(searchResultList)
})

modalBackdrop.addEventListener('click', () => {
    document.body.classList.remove('modal-open')
    modal.remove()
})


// search function
// const search = () => {
//     fetch("https://travel-advisor.p.rapidapi.com/locations/v2/list-nearby?currency=USD&units=km&lang=en_US", {
//     "method": "POST",
//     "headers": {
//         "content-type": "application/json",
//         "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
//         "x-rapidapi-key": "5d63c720fdmshaa85f891267c44cp1dc110jsna83bb5c8a63d"
//     },
//     "body": {
//         "contentId": "cc8fc7b8-88ed-47d3-a70e-0de9991f6604",
//         "contentType": "restaurant",
//         "filters": [
//             {
//                 "id": "placetype",
//                 "value": [
//                     "hotel",
//                     "attraction",
//                     "restaurant"
//                 ]
//             },
//             {
//                 "id": "minRating",
//                 "value": [
//                     "30"
//                 ]
//             }
//         ],
//         "boundingBox": {
//             "northEastCorner": {
//                 "latitude": 12.248278039408776,
//                 "longitude": 109.1981618106365
//             },
//             "southWestCorner": {
//                 "latitude": 12.243407232845051,
//                 "longitude": 109.1921640560031
//             }
//         }
//     }
// })
// .then(response => {
//     console.log(response);
// })
// .catch(err => {
//     console.error(err);
// });
// }

// search()


// Build search results
const buildSearchResult = (result) => {
    const resultItem = document.createElement('li')
    // resultItem.addEventListener('click', search)

    resultItem.innerHTML = `
    <li class="flex justify-between w-full mb-5 cursor-pointer">
        <div>
            <p class="font-medium text-base">${result.name}</p>
            <p class=" text-sm text-gray-400">${result.address}</p>
        </div>
        <div>
            <img src=${result.img} alt="" class="w-14 h-14 object-cover">
        </div>
    </li>
    `
    searchResultList.appendChild(resultItem)
}
