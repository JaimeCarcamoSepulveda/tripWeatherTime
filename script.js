
/*
submit event on form initiate getLocation function. 
1st fetch request returns latitude and longitude for geolocation 
2nd fetch query weather forecast

3rd fetch get sunrise and sunset how long day lasts 
4th using lat and lon coordinates get time zone and hour differences
5th fetch weather history on same date last 1 then 5 years give a forecast based on weather history
6th depending on weather recommend dressing attire
finally create elements in DOM to add HTML for weather results. 
*/


const form = document.querySelector(`#form`);
form.addEventListener('submit', getLocation)

//const cityName = document.getElementById("city-name");
//const stateName = document.getElementById("state-name");

//Need to write function that determines celsius/fahrenheit depending on country standard

let cityEntered = ''
let stateEntered = ''
let isoCountryCode = ''
let countrySelected = ''
let unitType = ''
let URLWeather = ''



/*
1st - Will auto populate country input if 1 match remains
2nd- Will allow for selection of items in autocomplete list to target, click and populate into country input
3rd.- Once a country is selected will grab the matching code and insert into fetch call 
*/

searchInput.addEventListener('input', displayCountries);
searchInput.addEventListener('keyup', displayCountries);

/* ------------ gets country obj array from local fetch, auto-completes and selects isoCode for country ------------------------------ */
const searchInput = document.getElementById("country-name");
const suggestions = document.querySelector('.suggestions');
//----gets json file and displays when typing 
const countries = [ ];
const endpoint = `countryCodes.json`;
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            countries.push(...data)
        })       
function countryFind(countryToMatch, countries) {
    return countries.filter(country => {
        const regex = new RegExp(countryToMatch, 'gi');
        return country.name.match(regex)
    });
}

let countryField = document.querySelector(`#country-name`);
let html = ''

/* 
display country matches and add to suggestion html
check if a single match is left to displayed remaining country 
assign isoCountryCode of selected country
 Call populateCountryInput() to add country match value */
function displayCountries () {
    const matchArray = countryFind(this.value, countries);
   if(matchArray.length == 1) {
    let { 0: { code, name}} = matchArray;
        countrySelected = name;
        isoCountryCode = code;
       populateCountryInput(isoCountryCode, countrySelected); 
    //clears country suggestions
       return suggestions.textContent = '';
   }
    html = matchArray.map(country=> {
        return `
        <li>
            <span class="name">${country.name}</span>
        </li>
        `;
    }).join(''); 
    suggestions.innerHTML = html;
}

//populates input value of country with last match remaining 
function populateCountryInput(isoCountryCode, countrySelected) {
    countryField.value = `${countrySelected}`;
    let htmlCountry = `value = "${countrySelected}"`
    countryField.append(htmlCountry); 
}

//clears value of country input with backspace or delete key
countryField.addEventListener('keydown', function(e) {
    const key = e.key; 
    if (key === "Backspace" || key === "Delete") {
        countryField.value = ``;
        let htmlCountry = `value = " "`;
        countryField.append(htmlCountry);
    }
});

/* -------API WEATHER CALLS -----------------------------------------------------------------*/
const OpenWeatherMapAPIkey = '87777ca4cdeac88a2810d012d3dff954'
/* via template literals completes needed fields for API query needed to get coordinates-- city, state(ony for USA ), countryISO */
function getCoordinates (e) {
    e.preventDefault();
    const city = (this.querySelector('[id=city-name]')).value;
    const state = (this.querySelector('[id=state-name]')).value;
    let unit = (this.querySelector('[id=unit-name]')).value;
    let getUnitType = (unit) => unit == 'fahrenheit'?'imperial': 'metric';
    unitType = getUnitType(unit);
    cityEntered = city.toUpperCase();
    stateEntered = state.toUpperCase();
    URLCoords = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${isoCountryCode}&limit=1&appid=${OpenWeatherMapAPIkey}`; 
    getLocation(URLCoords)
    this.reset(); 
}
/* Makes an API request with city, state and isoCountryCode returns latitude and longitude coordinates */
const getLocation = async (URLCoords) => {
   const response = await fetch(URLCoords);
   const coordinates = await response.json(); 
   const { 0: { lat, lon, country = 'US'}  } = coordinates;
   URLWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherMapAPIkey}&units=${unitType}`
    timesToRun(3);
};

//fetch weather forecast. Make API weather call
let weatherResults = {};
const getWeather = async () => {
    const weatherRes = await fetch(URLWeather);
    const weather = await weatherRes.json();
    weatherResults =weather;
    inputWeatherResult();   
};

//dynamically inserts weather forecast results into webpage
function inputWeatherResult () {
    const {  main: { temp, humidity,temp_min, temp_max, pressure },
            wind: { speed }, clouds: { all: cloudinessPercent }, weather: { 0: { description: weatherDesc } } } = weatherResults;
            const div = document.createElement('div');
            div.className = "html-container"
            const contain = document.querySelector('.weather-response');
            
            let html = `
            <h3 class= "city-state">${cityEntered}, ${stateEntered} </h3>
            <div >
            <p class = "response-text">current temperature is ${temp}</p> 
            <p class = "response-text">minimum temperature ${temp_min}</p>
            <p class = "response-text">maximum temperature ${temp_max}</p> 
            </div>
            <div>
            <p class = "response-text">humidity ${humidity}</p>
            <p class = "response-text">SUNRISE AT</p>
            <p class = "response-text">SUNSET AT</p>
            </div>
            <div>
            <p class = "response-text">Pressure is at ${pressure}</p>
            <p class = "response-text">weather description: ${weatherDesc}</p>
            <p class = "response-text">cloudiness is at ${cloudinessPercent}%</p>
            <p class = "response-text">wind speeds are at ${speed} mph</p>
            </div>
            `
            div.innerHTML = html
            contain.append(div)
        }


//---------PERIPHERAL FUNCTIONS BELOW -------------------------------------------------------------------------------------------------
  
//limits weather query amounts by number of queryTimes entered -if query times not exceeded the it calls getWeather()
let queryCount = 0;
function timesToRun(queryTimes) {
    if(queryCount < queryTimes) {
     queryCount++;
     getWeather();
    } else { alert(`We apologize, only a limited amount of weather queries are allowed`) }
 }
 