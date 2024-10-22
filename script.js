const city = document.getElementById('city');
const searchButton = document.getElementById('search');
const apiKey = "1e1e9e8caeae4074a9d51316242110"; 

// Displaying the location and date, image, textSatus
const locationElement = document.getElementById('location');
const dateDayElement = document.getElementById('dateDay');
const imageElement = document.getElementById('currentWeatherIcon');
const textStatusElement = document.getElementById('textStatus');

// Displaying the forecast data
const tempElement = document.getElementById('temp');
const feelsLikeElement = document.getElementById('feelsLike');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const precipitationElement = document.getElementById('precipitation');
const cloudCoverElement = document.getElementById('cloudCover');
const visibilityElement = document.getElementById('visibility');
const uvIndexElement = document.getElementById('uvIndex');
const windChillElement = document.getElementById('windChill');
const heatIndexElement = document.getElementById('heatIndex');

// for alert
const alertElement = document.getElementById('alertWindow');

// for home Location
const homeLocation = document.getElementById('homeLocation');
const setHomeLocation = document.getElementById('homeIcon');

async function getCurrentData(cityName) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const locationData = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        const timeDateData = `${data.location.localtime.slice(11, 16)} ${data.location.localtime.slice(0, 10)}`;
        
        locationElement.innerHTML = locationData;
        dateDayElement.innerHTML = timeDateData;
        imageElement.src = data.current.condition.icon;

        textStatusElement.innerHTML = `Current Temp. ${data.current.temp_c}°C, Feels like. ${data.current.feelslike_c}°C, ${data.current.condition.text}`;

        tempElement.innerHTML = `Temp. : ${data.current.temp_c}°C`;
        feelsLikeElement.innerHTML = `Feels Like : ${data.current.feelslike_c}°C`;
        windElement.innerHTML = `Wind : ${data.current.wind_kph} km/h || Wind Direction : ${data.current.wind_dir}`;
        humidityElement.innerHTML = `Humidity : ${data.current.humidity}%`;
        precipitationElement.innerHTML = `Precipitation : ${data.current.precip_mm} mm`;
        cloudCoverElement.innerHTML = `Cloud Cover : ${data.current.cloud}%`;
        visibilityElement.innerHTML = `Visibility : ${data.current.vis_km} km`;
        uvIndexElement.innerHTML = `UV Index : ${data.current.uv}`;
        windChillElement.innerHTML = `Wind Chill : ${data.current.windchill_c}°C`;
        heatIndexElement.innerHTML = `Heat Index : ${data.current.heatindex_c}°C`;

        const alertDataResponse = await fetch(`https://api.weatherapi.com/v1/alerts.json?key=${apiKey}&q=${cityName}`);
        const alertData = alertDataResponse.json();
        if (alertData.alerts.length > 0) {
            alertWindow.classList.remove('visible');
            alertElement.innerHTML = alertData.alerts[0].headline;
        } else {
            alertElement.innerHTML = '';
        }
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function getForecastData(cityName) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=7&aqi=no&alerts=no`); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const forecastData = data.forecast.forecastday;

        document.getElementById('forecastPanel').innerHTML = '';

        forecastData.forEach(element => {
            const newDiv = document.createElement('div');
            newDiv.className = 'forecastDay';
            newDiv.innerHTML = `
                <h3>${element.date}</h3>
                <img src="${element.day.condition.icon}" alt="weather icon">
                <p>${element.day.avgtemp_c}°C</p>
                <p>${element.day.totalprecip_mm} mm</p>
                <p>${element.day.daily_chance_of_rain}%</p>
                <p>${element.day.avgvis_km} km</p>
            `;
            document.getElementById('forecastPanel').appendChild(newDiv);
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

searchButton.addEventListener('click', () => {
    const cityName = city.value;
    if (cityName) {
        getCurrentData(cityName);
        getForecastData(cityName);
    } else {
        alert('Please enter a city name');
    }
});

homeLocation.addEventListener('click', () => {
    const homeCity = localStorage.getItem('homeLocation');
    getCurrentData(homeCity);
    getForecastData(homeCity);
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = localStorage.getItem('homeLocation');
    if (defaultLocation) {
        getCurrentData(defaultLocation);
        getForecastData(defaultLocation);
    } else {
        getCurrentData('London');
        getForecastData('London');
    }
});

setHomeLocation.addEventListener('click', () => {
    const homeCity = city.value;
    if(homeCity) {
        localStorage.setItem('homeLocation', homeCity);
        homeLocation.innerHTML = "";
        homeLocation.innerHTML = `${homeCity}`;
    } 
});
