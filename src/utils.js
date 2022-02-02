// Create a function to enable auto complete
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        mapTypeId: "roadmap",
    });

    // Create the search box and link it to the UI element.
    const input = document.getElementById("search-input-open");
    const searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        console.log(places)
        if (places.length == 0) {
            return;
        }
    });
}

initAutocomplete();