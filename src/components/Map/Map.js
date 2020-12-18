import createElement from '../../utils/createElement';
import './Map.scss';

const mapToken = "pk.eyJ1IjoiYWxpbmFrYXVsaXR6aGFoYSIsImEiOiJja2lvaXhqa3Qwd3J6MnJvNTl5NmFiMDAxIn0.ZfGumpCeXpfbt3l63dYTLw";
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4,
    center: [28, 53]
});

const getColorMarker = cases => {
    if (cases >= 100000) {return 'red'}
    if (cases >= 1000) {return 'blue'}
    return 'gray'
};

fetch('https://corona.lmao.ninja/v2/countries', { method: 'GET', redirect: 'follow' })
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        data.forEach(country => {
            new mapboxgl.Marker({
                color: getColorMarker(country.active)
            })
                .setLngLat([country.countryInfo.long, country.countryInfo.lat])
                .addTo(map);
        })
    })
    .catch(error => console.log('error', error));
