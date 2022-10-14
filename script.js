

/*
take in user input city and state and get latitude longitude coordinates
U.S. country by default
http://api.openweathermap.org/geo/1.0/direct?q={city},{state},{country}&limit=1&appid={APIkey}
*/

/*
submit event on form initiates getLocation function. 
calls on getCoordinates function-- 1st fetch request which will return latitude and longitude for geolocation 
2nd query will return weather forecast
finally create elements in DOM to add HTML for weather results. 
*/


const form = document.querySelector(`.container form`);
form.addEventListener("submit", getLocation);

//const cityName = document.getElementById("city-name");
//const stateName = document.getElementById("state-name");
//const countryName = document.getElementById("country-name");

const fahrenheitCountries = ["BS","FM","US","KY","LR","MH","PW"];
const cityAt = ''
const stateAt = ''
let country = 'US'
const APIkey = '87777ca4cdeac88a2810d012d3dff954'
let URLCoords = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}'
let URLWeather = ''
//'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}'

//get form input place in fetch URL
//Need to write function that determines celsius/fahrenheit depending on country standard
function getLocation (e) {
    e.preventDefault();
    const city = (this.querySelector('[id=city-name]')).value;
    const state = (this.querySelector('[id=state-name]')).value;
    const URLlocal = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${APIkey}` 
    URLCoords = URLlocal;
    getCoordinates();
    form.reset();
}

//retrieve latitude and longitude coordinates 

const getCoordinates = async () => {
    //console.log(URLCoords)
   const response = await fetch(URLCoords);
   const coordinates = await response.json(); 
   const { 0: { lat, lon, country = 'US'}  } = coordinates;
   //console.log(` latitude is ${lat} and longitude is ${lon} in ${country}`);
    URLWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`
   getWeather();
};

//fetch weather forecast
//Make API weather call
const getWeather = async () => {
    console.log(URLWeather);
    const weatherRes = await fetch(URLWeather);
    const weather = await weatherRes.json();
    console.log(weather)

};


/*

GET LIST OF COUNTRIES FROM
 https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes 
add to page input. Has COUNTRY CODES as needed for API URL.
where: 
    fahrenehit ->  &units=imperial
    celsius   -->  &units=metric
 */