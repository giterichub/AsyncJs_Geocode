const authKey = "https://geocode.xyz/51.50354,-0.12768?geoit=xml&auth=12136512126515e15934668x7284";
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const submitButton = document.getElementById('submit');
const countriesContainer = document.querySelector('.countries');

const drawFlag = function (data1, className = '') {
    const html = `
          <article class="country ${className}">
              <img class="country__img" src="${data1.flags.png}" />
              <div class="country__data">
              <h3 class="country__name">${data1.name.common}</h3>
              <h4 class="country__region">${data1.region}</h4>
              <p class="country__row"><span>👫</span>${((data1.population) / 1000000).toFixed(1)}M</p>
              <p class="country__row"><span>🗣️</span>${data1.languages[Object.keys(data1.languages)[0]]}</p>
              <p class="country__row"><span>💰</span>${data1.currencies[Object.keys(data1.currencies)[0]].name}</p>
              </div>
          </article>
      `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  }

submitButton.addEventListener('click', function(){
    const latitudeValue = latitude.value;
    const longitudeValue = longitude.value;
    getCoordinates(latitudeValue, longitudeValue);
});

const fetchCountry = function (code) {
    return fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then(response => {
        if (!response.ok) throw new Error(`Neighbor country not found (${response.status})`);
        return response.json();
      });
  }
//   const specialOperation = async function (neighbourCountriesArray) {
//     const fetchedCountries = neighbourCountriesArray.map(code => fetchCountry(code));
//     const fetchedCountriesArray = await Promise.all(fetchedCountries);
//     fetchedCountriesArray.forEach(data => drawFlag(data[0], 'neighbour'));
//   }
const getCoordinates = async function (latitudeValue, longitudeValue){
   try { 
    const fetchCoordinatesResponse = await fetch(`https://geocode.xyz/${latitudeValue},${longitudeValue}?geoit=json&auth=12136512126515e15934668x72484`)
    const jsonResponse = await fetchCoordinatesResponse.json();
    console.log(`You are in ${!(jsonResponse.state.length) ? 'a state is not specified' : jsonResponse.state}, ${jsonResponse.country}`);
    const fetchCountryResponse = await fetch(`https://restcountries.com/v3.1/name/${jsonResponse.country}`)
    if (!fetchCountryResponse.ok) throw new Error(`Country not found ${jsonCountryData.status}`);
    const jsonCountryData = await fetchCountryResponse.json();
    const [countryData] = jsonCountryData;
    
    
    const countries = document.querySelector('.countries');
    countries.innerHTML = '';
    drawFlag(countryData);

        const neighbourCountriesArray = countryData.borders;
        if (!neighbourCountriesArray) throw new Error(`No neighbouring country found`);
  
        const fetchedCountries = neighbourCountriesArray.map(code => fetchCountry(code));
        const fetchedCountriesArray = await Promise.all(fetchedCountries);

        fetchedCountriesArray.forEach(data => drawFlag(data[0], 'neighbour'));
  
        const allNeighborBorders = fetchedCountriesArray
          .flatMap(neighbour => neighbour[0].borders || []);
        const uniqueNeighborBorders = [...new Set(allNeighborBorders)];
  
        const fetchedCountries2 = uniqueNeighborBorders.map(code => fetchCountry(code));
        const fetchedCountries2Array = await Promise.all(fetchedCountries2);
        fetchedCountries2Array.forEach(data => drawFlag(data[0], 'neighbour1'));
    } catch (error){
        console.log(`Something went wrong ${err}`);
        countriesContainer.insertAdjacentHTML('beforeend', `Something went wrong ${err}q`);
        countriesContainer.style.opacity = 1;
    }
};
  getCoordinates(-33.933, 18.474)