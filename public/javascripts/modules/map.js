import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
    center: { lat: 29.1, lng: -82.1 },
    zoom: 10
}

function loadPlaces(map, lat = 29.1, lng = -82.1) {
    axios.get(`/api/sites/near?lat=${lat}&lng=${lng}`)
        .then(res => {
            const places = res.data;
            if (!places.length) {
                alert('No places found');
                return;
            }
            // create a bounds for the zoom map function
            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();

            // markers are the red dots on map
            const markers = places.map(place => {
                const [placeLng, placeLat] = place.location.coordinates;
                console.log(placeLng, placeLat);
                const position = { lat: placeLat, lng: placeLng };
                bounds.extend(position);
                const marker = new google.maps.Marker({
                    map: map,
                    position: position
                })
                marker.place = place;
                return marker;
            });

            // when someone clicks on marker show details
            markers.forEach(marker => marker.addListener('click', function() {
                const html = `
                    <div class="popup">
                        <a href="/site/${this.place.slug}">
                            <img src="/uploads/${this.place.photo || 'site.png'}" alt="${this.place.facilityName}"/>
                            <p>${this.place.facilityName} - ${this.place.location.address}</p>
                        </a>
                    </div>
                `;
                infoWindow.setContent(html);
                infoWindow.open(map, this);
            }));

            // zoom the map to fit all markers perfectly
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        })
};

function makeMap(mapDiv) {
    if (!mapDiv) return;
    // make our map
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map);
    const input = $('[name="geolocate"]');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
    })
}

export default makeMap;