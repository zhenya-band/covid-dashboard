import createElement from '../../utils/createElement';
import getData from '../../utils/getData';
import './Map.scss';

const url = 'https://corona.lmao.ninja/v2/countries';
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpbmFrYXVsaXR6aGFoYSIsImEiOiJja2lvaXhqa3Qwd3J6MnJvNTl5NmFiMDAxIn0.ZfGumpCeXpfbt3l63dYTLw';

class Map {
    constructor() {
        createElement('div', null, null, null, ['id', 'map']);
        this.createMap();
        this.getCountries();
    }

    createMap() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 4,
            center: [28, 53]
        });
    }

    getColorMarker = cases => {
        if (cases >= 100000) {return 'red'}
        if (cases >= 1000) {return 'blue'}
        return 'gray'
    };

    getCountries() {
        getData(url)
            .then(data => {
                data.forEach(country => {
                    new mapboxgl.Marker({
                        color: this.getColorMarker(country.active)
                    })
                        .setLngLat([country.countryInfo.long, country.countryInfo.lat])
                        .addTo(this.map);
                })
            })
            .catch(error => console.log('error', error));
    }
}

export default Map;