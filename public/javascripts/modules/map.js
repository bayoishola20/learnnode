import axios from 'axios';
import { $ } from './bling'

const mapOptions = {
    center: {lat: 43.2, lng: -79.8},
    zoom: 10
};

function loadPlaces(map, lat = 43.2, lng = -79.8) {
    axios.get(`/api/stores/close-stores?lat=${lat}&lng=${lng}`).then(res => {
        const places = res.data;
        if(!places.length) {
            alert('None found!');
            return;
        }

        //create bounds
        const bounds = new google.maps.LatLngBounds();
        //info window
        const infoWindow = new google.maps.InfoWindow();

        const markers = places.map(place => {
            const [placeLng, placeLat] = place.location.coordinates;
            // console.log(placeLng, placeLat);

            const position = { lat: placeLat, lng: placeLng };
            bounds.extend(position);
            const marker = new google.maps.Marker({
                map: map,
                position: position
            });
            marker.place = place;
            return marker;
        });
        //upon marker click, show info
        markers.forEach(marker => marker.addListener('click', function(){
            const html = `<div class="popup">
                <a href="/store/${this.place.slug}">
                    <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}"/>
                    <p><strong>${this.place.name}</strong> - <i>${this.place.location.address}</i> </p>
                </a>
            </div>`;

            infoWindow.setContent(html);
            infoWindow.open(map, this);
        }));

        // zoom to perfectly fit marker in bounds
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }).catch(console.error);
}

// navigator.geolocation.getCurrentPosition

function makeMap(mapDiv){
    if(!mapDiv) return;
    //make our map
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map); //<= This loads the places within set coordinate bounds above

    const input = $('[name="geolocate"]');
    // console.log(input);
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
    });
}

export default makeMap;