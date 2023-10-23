/* CODE SUMMARY
submit event on form initiate getLocation function. 
1st fetch request returns latitude and longitude for geolocation 
2nd fetch query weather forecast
3rd fetch get sunrise and sunset how long day lasts 
4th using lat and lon coordinates get time zone and hour differences
5th depending on weather recommend dressing attire
6th add HTML elements in DOM with weather results. 
*/
import { apiKey1, apiKey2} from './apiKeys';

/* Hamburger Menu code*/
const navigationUl = document.querySelector("nav ul");
const toggleButton = document.querySelector("header button");

toggleButton.addEventListener("click", ()=> {
    navigationUl.toggleAttribute("data-visible");
})




const form = document.querySelector(`#form`);
const containerAutocomplete = document.querySelector(".container-autocomplete");
const weatherButton = document.querySelector("#weather-button");
weatherButton.addEventListener("click", ()=> {
    location.reload();
    console.log('weather button was clicked')
})


form.addEventListener('submit', getCoordinates);
form.addEventListener('submit', flyAway);


let cityEntered = ''
let stateEntered = ''
let cityEnteredNotUpperCase = ''
let stateEnteredNotUpperCase = ''

let isoCountryCode = ''
let countrySelected = ''
let unitType = ''
let URLWeather = ''
let URLForecast = ''
let temperatureSign = ''
let speedType = ''
let URLTimeZone = ''
let hours24 = ''
let isItCloudy = ''
/* -------API WEATHER CALLS -----------------------------------------------------------------*/
const OpenWeatherMapAPIkey = apiKey1; 
/* via template literals completes needed fields for API query to get coordinates city, state--only for USA--and countryISO */
function getCoordinates (e) {
    containerAutocomplete.setAttribute("style", "display: none");
    weatherButton.setAttribute("style", "display: visible");
    e.preventDefault();
    const city = (this.querySelector('[id=city-name]')).value;
    const state = (this.querySelector('[id=state-name]')).value;
    let unit = (this.querySelector('[id=unit-name]')).value;
    let getUnitType = (unit) => unit == 'fahrenheit'?'imperial': 'metric';
    let getTempSign = (unit) => unit == 'fahrenheit'? `°F`: `°C`;
    let getSpeedMeasurement = (unit) => unit == 'fahrenheit'? `mph`: `km/h`;
    unitType = getUnitType(unit);
    temperatureSign = getTempSign(unit);
    speedType = getSpeedMeasurement(unit);
    cityEntered = city.toUpperCase();
    stateEntered = state.toUpperCase();
    URLCoords = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${isoCountryCode}&limit=1&appid=${OpenWeatherMapAPIkey}`; 
    getLocation(URLCoords)
    this.reset(); 
}

const API_KeyTimeZone = apiKey2; 
/* Makes an API request with city, state and isoCountryCode returns latitude and longitude coordinates */
const getLocation = async (URLCoords) => {
   const response = await fetch(URLCoords);
   const coordinates = await response.json(); 
   const { 0: { lat, lon }  } = coordinates;
   URLWeather =  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherMapAPIkey}&units=${unitType}`
   URLForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OpenWeatherMapAPIkey}&units=${unitType}`
   URLTimeZone = `https://api.ipgeolocation.io/timezone?apiKey=${API_KeyTimeZone}&lat=${lat}&long=${lon}`
    timesToRun(1);
};

  
//limits weather query amounts by number of queryTimes entered -if query times not exceeded the it calls getWeather()
let queryCount = 0;
function timesToRun(queryTimes) {
    if(queryCount < queryTimes) {
     queryCount++;
     getWeather();
    } else {
        //make form invisible and add button to make a new search query
        //button will reload page and reset all parameters for new query to be made
        //location.reload()
        
       // alert(`We apologize, only a limited amount of weather queries are allowed`); 
    }
 }
 


//fetch current weather. Make API weather call
let weatherResults = {};
const getWeather = async () => {
    const weatherRes = await fetch(URLWeather);
    const weather = await weatherRes.json();
    weatherResults =weather;
    inputWeatherResult();   
};


const weatherDashboard = document.querySelector('.weather-dashboard');
const htmlContainer = document.querySelector('.html-container');

//dynamically inserts weather forecast results into webpage
function inputWeatherResult () {
    const {  main: { temp, humidity,temp_min, temp_max, pressure },
            wind: { speed }, clouds: { all: cloudinessPercent }, weather: { 0: { description: weatherDesc } } } = weatherResults;
            const weatherResult = document.createElement('div');
            weatherResult.className = "weather-results";
            let country = countrySelected.toUpperCase();
            isItCloudy = cloudinessPercent;
            if (stateEntered == '') { stateEntered = `${country}`; country = ''; }
            else{ stateEntered = `${stateEntered},`; };
         
    // <h3 class= "location-title">${cityEntered}, ${stateEntered} ${country} </h3>  
           // const h3 = document.createElement('h3');
           // h3.setAttribute('class','response-title');
           // h3.textContent = `${cityEntered}, ${stateEntered} ${country}`;          
            let html = `         
                <h3 class="response-title">${cityEntered}, ${stateEntered} <br> <span id="country">${country}</span></h3>
            <div class= "response-text weather">
                <p> Temperature ${temp}${temperatureSign} min ${temp_min}${temperatureSign}   max ${temp_max}${temperatureSign} <i id="temperature" class="fa-sharp fa-solid fa-temperature-low"></i></p> 
                <p>Humidity ${humidity}% Atmospheric Pressure ${pressure} <i id="clouds"class="fa-solid fa-smog"></i></p>
                <p>${weatherDesc} with ${cloudinessPercent}% Cloudiness <i id="clouds" class="fa-sharp fa-solid fa-cloud"></i></p>
                <p>Wind speeds up at ${speed} ${speedType} <i id="wind" class="fa-sharp fa-solid fa-wind"></i></p>
            </div>
            `;
            weatherResult.innerHTML = html;
            htmlContainer.setAttribute("style", "display:visible")
            htmlContainer.append(weatherResult);
            getForecast();  
        }
        

//fetch 5-day weather forecast. Make API weather call
let fiveDayArray = {};
        
const getForecast = async () => {
    const forecastRes = await fetch(URLForecast);
    const forecast = await forecastRes.json();
    forecastResults =forecast;
    const { list: {7: day1, 15: day2, 23: day3, 31: day4, 39: day5 }} = forecastResults;
    fiveDayArray = [day1, day2, day3, day4, day5];  
    inputForecastResult();  
};


function inputForecastResult() {
        const carousel = document.createElement('div');
        carousel.setAttribute('data-carousel', '');
        carousel.className = 'carousel';
        btnhtml = `<button class="carousel-button prev" data-carousel-button="prev"><i class="fa-solid fa-chevron-left"></i></button> 
                   <button class="carousel-button next" data-carousel-button="next"><i class="fa-solid fa-chevron-right"></i></button>`;
        carousel.innerHTML = btnhtml;
        const itemsContainer = document.createElement('div');
        itemsContainer.setAttribute('class', 'data-items');

        fiveDayArray.forEach((days)=> {
            const {  main: { temp, humidity,temp_min, temp_max, pressure }, dt_txt,
            wind: { speed }, clouds: { all: cloudinessPercent }, weather: { 0: { description: weatherDesc } } } = days;

            const carouselItem = document.createElement('div');
            carouselItem.className = "carousel-item";  

            let forecastDate = dt_txt.slice(5,10).split('-').join('/');
            //console.log(day);
            //console.log(forecastDate);
            for(day in days) {

                 let html = `         
                    
                     <h3 class="response-title forecast">FORECAST <span id="forecast">${forecastDate}</span></h3>
                     <div class = "response-text" >
                        <p>Temperature ${temp}${temperatureSign} min ${temp_min}${temperatureSign} max ${temp_max}${temperatureSign} <i id="temperature" class="fa-sharp fa-solid fa-temperature-low"></i></p> 
                        <p>Humidity ${humidity}% Atmospheric pressure ${pressure} <i id="clouds"class="fa-solid fa-smog"></i></p>
                        <p>${weatherDesc} with ${cloudinessPercent}% cloudiness <i id="clouds" class="fa-sharp fa-solid fa-cloud"></i></p>
                        <p>Wind speeds at ${speed} ${speedType} <i id="wind" class="fa-sharp fa-solid fa-wind"></i></p>
                     </div>
                     
                 `;
                 carouselItem.innerHTML = html;
                 itemsContainer.append(carouselItem);
                 carousel.append(itemsContainer);
                
            }   
            htmlContainer.append(carousel);

            let firstCarouselList = document.querySelectorAll(`.data-items`).forEach(item => {
              //  if(item.dataset.active === "true"){ item.removeAttribute('data-active'); } 
                let firstCarouselItem = item.firstElementChild;
                firstCarouselItem.setAttribute('data-active', 'true');
             }) 
         });
       
        //carousel code 
        const buttons = document.querySelectorAll("[data-carousel-button]");
        buttons.forEach( button => {
        button.addEventListener("click", ()=> {
    
        let offset = button.dataset.carouselButton ==="next" ? 1: -1
        const itemsCarousel = button
            .closest("[data-carousel]")
            .querySelector(".data-items")
        
        const activeItem = itemsCarousel.querySelector("[data-active]")
        let newIndex = [...itemsCarousel.children].indexOf(activeItem) + offset
        if(newIndex < 0) {newIndex = itemsCarousel.children.length -1}
        if(newIndex>= itemsCarousel.children.length) {newIndex = 0 }
        
        itemsCarousel.children[newIndex].dataset.active = true
        delete activeItem.dataset.active
        
        }) 
    })
    getOriginTime()
}

/* -------API TIMEZONE CALL -----------------------------------------------------------------*/
let currentTimeResp = ''

const getOriginTime = async () => {
    const curTimeRes = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KeyTimeZone}`);
    const curTimeIs = await curTimeRes.json();
    currentTimeResp = curTimeIs;
    //console.log(currentTimeResp);
    //console.log(currentTime, originCountry, stateProvidenceOrigin);
    getTimeZone()
}

let timeZoneResp = ''
//get timeZone for requested weather location
const getTimeZone = async () => {
    const TZRes = await fetch(URLTimeZone);
    const timeIs = await TZRes.json();
    timeZoneResp =timeIs;
   // console.log(timeZoneResults)  
   // console.log(dateTime);
    addTimeZone()
};

function addTimeZone () {
    const timeZoneItem = document.createElement('div');
    timeZoneItem.className = "time-zone";  

    const { date_time_txt: dateTime, time_12, time_24, timezone_offset_with_dst} = timeZoneResp;
    const { country_name: originCountry, state_prov: originStateProvidence, time_zone: { current_time: originCurrentTime}} = currentTimeResp;
    let dateTimeShortened = dateTime.slice(0,27);
    let originTime = originCurrentTime.slice(11,16);
    let requestedLocationTimeDiff = time_24.slice(0,2).split(':').join('');
    let time12 = time_12.slice(0,5) + time_12.slice(9,)
    let originTimeDiff = originTime.slice(0,2)
    let timeDifference = getTimeDifference(requestedLocationTimeDiff, originTimeDiff);
    hours24 = requestedLocationTimeDiff;


    let timeZoneHtml = `
       <div><p> In <span class="highlight country">${cityEntered}, ${stateEntered}</span> it is <span class="highlight time">${dateTimeShortened} ${time12}</span></p>
       <p><span class="highlight time">${timeDifference}</span> <i id="clock" class="fa-regular fa-clock"></i> from your current location in <span class="highlight country">${originStateProvidence.toUpperCase()}, ${originCountry.toUpperCase()}</span>
      Time offset by <span class="highlight time">${timezone_offset_with_dst} hours </span>from UTC</p></div>
    `;

    timeZoneItem.innerHTML = timeZoneHtml;
    htmlContainer.append(timeZoneItem);
    console.log(isItCloudy);
   //console.log(hours24)
   // addSkyClimate(hours24);
    isItCloudy <= 50? addSkyClimate(hours24, isItCloudy): addCloudySkyClimate(hours24,isItCloudy);
    
}

//form.addEventListener('submit', addSkyClimate);
const article = document.querySelector('#sky-display');
const headerBg = document.querySelector(".primary-header");
const body = document.querySelector(`body`);
const weatherContainer = document.querySelector('.weather-container');

function addSkyClimate(hours24, isItCloudy){
    setTimeout(()=> {
    //if( hours24 > 1 && hours24 < 4 ) { 
    //body.removeAttribute("style", "background");
   // body.setAttribute("style", "background: url(./images/nightSkyMountain.png);"); }
        body.removeAttribute("style", "background");
    if( isItCloudy > 25 && isItCloudy < 50 &&  hours24 > 8 && hours24 < 16) {
        body.setAttribute("style", "background: url(./images/cloudsunny.png);");  
    }
    if( isItCloudy < 24 && hours24 > 7 && hours24 < 16 ) {
       body.setAttribute("style", "background: url(./images/nightskymoon.png);");  
       body.setAttribute("style", "background: url(./images/cloudsunny.png);");
    }
    article.removeAttribute("id", "sky-display");
    //sunny not cloudy
    switch(hours24) {
        case `05`:
        case `06`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(108, 163, 199, 0.84), rgba(158, 207, 223, 0.56), rgba(175, 154, 79, 0.937), rgba(175, 57, 17, 0.938));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(108, 163, 199, 0.84), rgba(158, 207, 223, 0.56), rgba(175, 154, 79, 0.937), rgba(175, 57, 17, 0.938));");
        break;
        case `07`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgb(0,65,106,.94), rgb(228,229,230,.61), rgba(233, 214, 159, .85), rgba(188, 85, 30, 0.85));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgb(0,65,106,.94), rgb(228,229,230,.61), rgba(233, 214, 159, .85), rgba(188, 85, 30, 0.85));");
        break;
        case `08`:
        case `09`:    
        case `10`:
        case `11`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(108, 163, 199, 0.92), rgba(92, 143, 188, 1), rgba(173, 158, 109, 0.937), rgba(180, 125, 62, 1));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(108, 163, 199, 0.92), rgba(92, 143, 188, 1), rgba(173, 158, 109, 0.937), rgba(180, 125, 62, 1));");
        break; 
        case `12`:
        case `13`: 
        article.setAttribute("style", "background: radial-gradient( rgba(199, 191, 164, 0.837), rgba(211, 184, 130, 0.638),rgba(108, 163, 199, 0.74), rgba(92, 143, 188, 0.81));");
        headerBg.setAttribute("style", "background: linear-gradient( rgba(199, 191, 164, 0.837), rgba(211, 184, 130, 0.638),rgba(108, 163, 199, 0.74), rgba(92, 143, 188, 0.81));");
        break;
        case `14`:
        case `15`:
        case `16`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgb(0,65,106,.79), rgb(228,229,230,.71), rgb(159, 211, 233, .73));");   
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgb(0,65,106,.79), rgb(228,229,230,.71), rgb(159, 211, 233, .73));");   
        break;
        case `17`: //HOT SUN SETTING
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgba(70, 124, 199, 0.69), rgb(154, 135, 72), rgba(195, 79, 33, 0.61));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgba(70, 124, 199, 0.69), rgb(154, 135, 72), rgba(195, 79, 33, 0.61));");
        break;
        case `18`:  //HOT SUNSET
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgba(168, 168, 126, 0.99), rgb(188, 156, 132, .88), rgba(221, 161, 87, 0.92),  rgba(187, 58, 18, 0.81));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgba(168, 168, 126, 0.99), rgb(188, 156, 132, .88), rgba(221, 161, 87, 0.92),  rgba(187, 58, 18, 0.81));");
        body.setAttribute("style", "background: url(./images/sunsetSky.png);");
        break;
        case `19`:
        case `20`:
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgba(44, 74, 93, 0.65), rgba(177, 147, 118, 0.696), rgba(152, 123, 66, 0.68));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgba(44, 74, 93, 0.65), rgba(177, 147, 118, 0.696), rgba(152, 123, 66, 0.68));");
        break;
        case `21`:
        case `22`:
        case `23`:
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgb(0,65,106,.41), rgb(228,229,230,.41), rgba(233, 214, 159, 1));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgb(0,65,106,.41), rgb(228,229,230,.41), rgba(233, 214, 159, 1));");
        break;
        case `00`:
        case `01`:
        case `02`:
        case `03`:
        case `04`:
        article.setAttribute("style", "background: radial-gradient( rgb(0,65,106,.29), rgb(228,229,230,.21), rgba(233, 214, 159, .1), rgba(188, 85, 30, 0.36));"); 
        headerBg.setAttribute("style", "background: linear-gradient( rgb(0,65,106,.29), rgb(228,229,230,.21), rgba(233, 214, 159, .1), rgba(188, 85, 30, 0.36));"); 
        break;
        default: console.log(`not a valid response`);
        break;
        }

     
  }, 2900)
}

function addCloudySkyClimate(hours24, isItCloudy){
    setTimeout(()=> {
       // if( hours24 > 1 && hours24 < 4 ) { 
         //   body.removeAttribute("style", "background");
           // body.setAttribute("style", "background: url(./images/galaxySky.png);"); }
           body.removeAttribute("style", "background");
        if(isItCloudy > 80 && hours24 > 7 && hours24 < 20) {
            body.setAttribute("style", "background: url(./images/snowyclouds.png);");  
        }
        if( isItCloudy > 51 && isItCloudy < 79 && hours24 > 7 && hours24 <17 ) {
            body.setAttribute("style", "background: url(./images/cloudsDesktop.png);");
        }
        
        article.removeAttribute("id", "sky-display");
    // mostly cloudy sky
    switch(hours24) {
        case `05`:
        case `06`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(51, 59, 65, 0.94), rgba(208, 221, 218, 0.91), rgba(146, 128, 76, 0.9), rgba(206, 72, 28, 0.938) );");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(51, 59, 65, 0.94), rgba(208, 221, 218, 0.91), rgba(146, 128, 76, 0.9), rgba(206, 72, 28, 0.938) );");
        break;
        case `07`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgb(48, 55, 59), rgb(228,229,230, 7), rgba(233, 214, 159, .81), rgba(188, 85, 30, 0.965));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgb(48, 55, 59), rgb(228,229,230, 7), rgba(233, 214, 159, .81), rgba(188, 85, 30, 0.965));");
        break;
        case `08`:
        case `09`:    
        case `10`:
        case `11`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(80, 90, 97, 0.94), rgba(137, 147, 156, 0.92), rgba(173, 158, 109), rgba(180, 125, 62));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(80, 90, 97, 0.94), rgba(137, 147, 156, 0.92), rgba(173, 158, 109), rgba(180, 125, 62));");
        break; 
        case `12`:
        case `13`: 
        article.setAttribute("style", "background: radial-gradient( rgb(204, 208, 196), rgb(210, 190, 144),rgb(105, 112, 122), rgb(44, 48, 51));");
        headerBg.setAttribute("style", "background: radial-gradient( rgb(204, 208, 196), rgb(210, 190, 144),rgb(105, 112, 122), rgb(44, 48, 51));");
        break;
        case `14`:
        case `15`:
        case `16`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(23, 41, 52, 0.90), rgb(228,229,230,.85), rgba(133, 156, 166, .6));");   
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(23, 41, 52, 0.90), rgb(228,229,230,.85), rgba(133, 156, 166, .6));");   
        break;
        case `17`: //CLOUDY SUN SETTING
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgba(44, 74, 93, 0.99), rgba(189, 147, 121, 0.96), rgba(161, 129, 67, 0.98));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgba(44, 74, 93, 0.99), rgba(189, 147, 121, 0.96), rgba(161, 129, 67, 0.98));");
        break;
        case `18`:  //CLOUDY SUNSET
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgba(64, 69, 73), rgba(137, 155, 171, 0.96), rgb(163, 146, 102), rgba(176, 130, 102, 0.98));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgba(64, 69, 73), rgba(137, 155, 171, 0.96), rgb(163, 146, 102), rgba(176, 130, 102, 0.98));");
        body.setAttribute("style", "background: url(./images/sunsetSky.png);");
        break;
        case `19`:
        case `20`:
        article.setAttribute("style", "background: linear-gradient( to bottom left, rgba(23, 41, 52, 0.99), rgb(228,229,230,.81), rgba(97, 114, 121, 0.73));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom left, rgba(23, 41, 52, 0.99), rgb(228,229,230,.81), rgba(97, 114, 121, 0.73));");
        break;
        case `21`:
        case `22`:
        case `23`:
        article.setAttribute("style", "background: linear-gradient( to bottom right, rgb(0,65,106,.49), rgb(228,229,230,.61), rgba(233, 214, 159, .3));");
        headerBg.setAttribute("style", "background: linear-gradient( to bottom right, rgb(0,65,106,.49), rgb(228,229,230,.61), rgba(233, 214, 159, .3));");
        break;
        case `00`:
        case `01`:
        case `02`:
        case `03`:
        case `04`:
        article.setAttribute("style", "background: linear-gradient( top left to bottom right, rgb(0,65,106,.1), rgb(228,229,230,.1), rgba(233, 214, 159, 1));"); 
        headerBg.setAttribute("style", "background: linear-gradient( top left to bottom right, rgb(0,65,106,.1), rgb(228,229,230,.1), rgba(233, 214, 159, 1));"); 
        break;
        default: console.log(`not a valid response`);
        break;
        }
  }, 2900)
}


//---------PERIPHERAL FUNCTIONS BELOW ----------------------------------------------------------------------------------

function getTimeDifference(requestedLocationTimeDiff, originTimeDiff) {
    let timeDiff = requestedLocationTimeDiff - originTimeDiff;
    let absTimeDiff = Math.abs(timeDiff);
    if(timeDiff < 0 ) return `You are ahead by <i id="signPlus" class="fa-solid fa-plus"></i>${absTimeDiff} hours`
    if(timeDiff >= 1) return `You are behind by <i id="signMinus" class="fa-solid fa-minus"></i> ${absTimeDiff} hours`
    if(timeDiff == 0) return `There is no time difference`
}


//adds fly-away class to #plane-flying container so plane animation can initiate then removes class 
//setting up for next search query
const planeFlying = document.querySelector('#plane-flying');
const planeFrontDiv = document.querySelector('#plane-front');
const planeFront = document.querySelector('#plane-front');
function flyAway() {
    planeFlying.setAttribute('class', 'fly-away');
    planeFront.removeAttribute('class', 'close-up');
    weatherDashboard.setAttribute('style', 'opacity: 0;');
    setTimeout( () => { 
        planeFlying.removeAttribute('class', 'fly-away');
        weatherDashboard.setAttribute('style', 'opacity: 1;');
        planeFrontDiv.setAttribute('style', 'display: visible;');
        planeFront.setAttribute('class', 'close-up');
}, "2900")
    
}


/*
1st - Will auto-populate country input if 1 match remains
2nd- Will allow for selection of items in autocomplete list to target, click and populate into country input
3rd.- Once a country is selected will grab the matching code and insert into fetch call 
*/
const searchInput = document.getElementById("country-name");
const cityName = document.getElementById("city-name");
const stateName = document.getElementById("state-name");
const unitName = document.querySelector("#unit-name");
cityName.addEventListener("focus", suggestionsRemove);
stateName.addEventListener("focus", suggestionsRemove);
unitName.addEventListener("focus", suggestionsRemove);

searchInput.addEventListener('input', displayCountries);
searchInput.addEventListener('keyup', displayCountries);
searchInput.addEventListener("focus", suggestionsAppear);

function suggestionsRemove(){ suggestions.setAttribute("style","display:none")} /* makes suggestions invisible when another input is focused*/
function suggestionsAppear(){ suggestions.setAttribute("style","display:visible")}/* makes suggestions visible when focused */

/* --------get country obj array from local fetch, 
auto-completes and
 selects isoCode for country ------------------------------ */

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
