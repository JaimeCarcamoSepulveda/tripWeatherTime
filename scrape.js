/*

//https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

const countryTableList = document.querySelector('.wikitable tbody');
const cNames = Array.from(countryTableList.querySelectorAll('tr > td:nth-child(1) > a'));
const isoCodes = Array.from(countryTableList.querySelectorAll('tr > td:nth-child(4) > a span'));

const countries = [...cNames.map(link=> link.textContent)];
const codes = [...isoCodes.map(link=> link.textContent)];

const countryCodes = {};

countries.forEach((element,index) => {
    countryCodes[element] = codes[index]; 
});

JSON.stringify(countryCodes);

save in folder as countryCodes.json 

*/


const inputCountry = document.querySelector('#unit-name');
inputCountry.addEventListener("change", displayMatches);
inputCountry.addEventListener("keyup", displayMatches);
//window.addEventListener("DOMContentLoaded", getCountryCodes);


const endpoint = "countryCodes.json";
let countries = {};

    fetch(endpoint)
        .then(res => res.json())
        .then(Codes => {
            countries = Codes; 
            //console.log(countries);   
        })
  
function getCountryCodes(countryMatch, countries) {
    //console.log(countries); 
    //console.log(countryText) 
   return countries.filter(place => {
        const regex = new RegExp(countryMatch, 'gi');
        return place.country.match(regex)
    }); 
}


function displayMatches () {
   const matchArray = getCountryCodes(this.value, countries)
   console.log(matchArray)
    //console.log(this.value)
}


/*

GET LIST OF COUNTRIES FROM
 https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes 
add to page input. Has COUNTRY CODES as needed for API URL.
where: 
    fahrenehit ->  &units=imperial
    celsius   -->  &units=metric
 */
