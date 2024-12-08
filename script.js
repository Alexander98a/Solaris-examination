const API_BASE_URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/';
let apiKey = null;

// Elementreferenser
const planetsContainer = document.getElementById('planets');
const overlay = document.getElementById('planet-overlay');
const closeOverlayButton = document.getElementById('close-overlay');

// Overlay-element
const planetName = document.getElementById('planet-name');
const planetLatinName = document.getElementById('planet-latin-name');
const planetDesc = document.getElementById('planet-desc');
const planetCircumference = document.getElementById('planet-circumference');
const planetDistance = document.getElementById('planet-distance');
const planetRotation = document.getElementById('planet-rotation');
const planetMaxTemp = document.getElementById('planet-max-temp');
const planetMinTemp = document.getElementById('planet-min-temp');
const planetMoons = document.getElementById('planet-moons');

// Hämta API-nyckel
async function fetchApiKey() {
const response = await fetch(`${API_BASE_URL}/keys`, { method: 'POST' });
if (!response.ok) {
console.error('Kunde inte hämta API-nyckel');
return;
}
const data = await response.json();
apiKey = data.key;
}

// Hämta planeter från API
async function fetchPlanets() {
if (!apiKey) {
console.error('Ingen API-nyckel tillgänglig');

return;
}
const response = await fetch(`${API_BASE_URL}/bodies`, {
method: 'GET',
headers: { 'x-zocom': apiKey }
});
if (!response.ok) {
console.error('Kunde inte hämta planetdata');
return;
}
const data = await response.json();
renderPlanets(data.bodies);
}

// Rendera planeter
function renderPlanets(planets) {
    planetsContainer.innerHTML = '';
    planets
    .filter(planet => planet.type === 'planet')
    .forEach(planet => {
    console.log(`Planet från API: ${planet.name}`); // Felsökning: logga planetens namn
    const planetDiv = document.createElement('div');
    planetDiv.classList.add('planet');
    planetDiv.style.backgroundColor = getPlanetColor(planet.name.toLowerCase().trim());
    planetDiv.addEventListener('click', () => showPlanetOverlay(planet));
    planetsContainer.appendChild(planetDiv);
    });
    }
    
    function getPlanetColor(planetName) {
        console.log(`Bestämmer färg för planet: ${planetName}`); // Debuggning
        const normalizedPlanetName = planetName.toLowerCase().trim();
        
        // Mappa planetnamn (både svenska och engelska) till färger
        switch (normalizedPlanetName) {
        case 'mercury':
        case 'merkurius':
        return '#9e9c9c'; // Grå
        case 'venus':
        return '#D9A066'; // Gyllene
        case 'earth':
        case 'jorden':
        return '#4682B4'; // Blå
        case 'mars':
        return '#fa5639'; // Röd
        case 'jupiter':
        return '#D2691E'; // Mörkbrun
        case 'saturn':
        case 'saturnus':
        return '#DAA520'; // Guldgul
        case 'uranus':
        return '#AFEEEE'; // Ljusblå
        case 'neptune':
        case 'neptunus':
        return '#4169E1'; // Mörkblå
        default:
        console.warn(`Ingen matchande färg för: ${planetName}`); // Warn om planeten saknas
        return '#FFFFFF'; // Fallback-färg
        }
        }

// Visa overlay
function showPlanetOverlay(planet) {
planetName.textContent = planet.name;
planetLatinName.textContent = planet.latinName;
planetDesc.textContent = planet.desc;
planetCircumference.textContent = planet.circumference;
planetDistance.textContent = planet.distance;
planetRotation.textContent = planet.rotation;
planetMaxTemp.textContent = planet.temp.day;
planetMinTemp.textContent = planet.temp.night;
planetMoons.textContent = planet.moons.length > 0 ? planet.moons.join(', ') : 'Inga månar';

overlay.style.display = 'flex';
}

// Stäng overlay
closeOverlayButton.addEventListener('click', () => {
overlay.style.display = 'none';
});

// Initiera applikationen
(async function init() {
await fetchApiKey();
await fetchPlanets();

})();