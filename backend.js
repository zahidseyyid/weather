// İlk açıldığında konumdan çekilecek
async function onPageLoad() {
    try {
        const city = await getCity();

        await getWeatherInfo(city);
    } catch (error) {
        console.error("Bir hata oluştu: " + error);
    }
}

// Site açılınca çalışacak fonksiyonu çağırır
window.addEventListener("load", onPageLoad);

// Hava durumu bilgisi çekme
async function getWeatherInfo(city) {
    let apiKey = "e8de21c1f5fd4650b27133150230110";
    let queryUrl = "https://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + city + "&days=5&aqi=no&alerts=no";
    console.log(queryUrl);

    try {
        const responseWeather = await fetch(queryUrl);
        const weatherData = await responseWeather.json();

        var weatherCity = weatherData.location.name;
        var weatherTemp = Math.round(weatherData.current.temp_c);
        var weatherText = weatherData.current.condition.text;
        var weatherWind = weatherData.current.wind_kph;
        var weatherHumidity = weatherData.current.humidity;
        var currentHour = weatherData.location.localtime.split(" ")[1].split(":")[0];
        var todayMinTempc = weatherData.forecast.forecastday[0].day.mintemp_c;
        var todayMaxTempc = weatherData.forecast.forecastday[0].day.maxtemp_c;
        var todayText = weatherData.forecast.forecastday[0].day.condition.text;
        var tomorrowMinTempc = weatherData.forecast.forecastday[1].day.mintemp_c;
        var tomorrowMaxTempc = weatherData.forecast.forecastday[1].day.maxtemp_c;
        var tomorrowText = weatherData.forecast.forecastday[1].day.condition.text;
        var dayAfterMinTempc = weatherData.forecast.forecastday[2].day.mintemp_c;
        var dayAfterMaxTempc = weatherData.forecast.forecastday[2].day.maxtemp_c;
        var dayAfterText = weatherData.forecast.forecastday[2].day.condition.text;

        // Saatlik tahminleri diziye ekleme
        var hourlyForecasts = [];

        for (var i = 0; i <= 23; i++) {
            var hourFull = weatherData.forecast.forecastday[0].hour[i].time;
            var tempCHour = weatherData.forecast.forecastday[0].hour[i].temp_c;

            var forecastHour = parseInt(hourFull.split(' ')[1].split(':')[0]);
            hour = hourFull.split(" ")[1];

            if (hourlyForecasts.length <= 5) {
                if (forecastHour >= currentHour) {
                    hourlyForecasts.push(tempCHour);
                }
            }
        }


        //Günün detayları bilgileri
        document.getElementById("city").innerHTML = weatherCity;
        document.getElementById("current-condition").innerHTML = weatherText;
        document.getElementById("current-temperature").innerHTML = weatherTemp + "°C";
        document.getElementById("current-wind").innerHTML = weatherWind + "Km/s";
        document.getElementById("current-humidity").innerHTML = weatherHumidity + "%";

        //Günün bilgileri
        document.getElementById("today-text").innerHTML = todayText;
        document.getElementById("today-min-temp").innerHTML = todayMinTempc + "°C";
        document.getElementById("today-max-temp").innerHTML = todayMaxTempc + "°C";

        //Ertesi günün bilgileri
        document.getElementById("tomorrow-text").innerHTML = tomorrowText;
        document.getElementById("tomorrow-min-temp").innerHTML = tomorrowMinTempc + "°C";
        document.getElementById("tomorrow-max-temp").innerHTML = tomorrowMaxTempc + "°C";

        //İki gün sonrası bilgileri
        document.getElementById("dayAfter-text").innerHTML = dayAfterText;
        document.getElementById("dayAfter-min-temp").innerHTML = dayAfterMinTempc + "°C";
        document.getElementById("dayAfter-max-temp").innerHTML = dayAfterMaxTempc + "°C";

        //Saatlik hava durumu bilgisi
        for (var i = 0; i < hourlyForecasts.length; i++) {
            var temperatureId = "tempsHow" + (i);
            document.getElementById(temperatureId).innerHTML = hourlyForecasts[i] + "°C";
        }


    } catch (error) {
        console.error("API isteği sırasında bir hata oluştu: " + error);

    }
}


// Konumdan şehir çekme
async function getCity() {
    var geoUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=08be1f48f61c4b92aeec6286ee583f8e";

    try {
        const response = await fetch(geoUrl);
        const geoData = await response.json();
        var city = geoData.city;
        return city;
    } catch (error) {
        console.error("Konum isteği sırasında bir hata oluştu: " + error);
        return "";
    }
}

// Arama özelliği
const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("search-input");

// Buton ile arama
searchButton.addEventListener("click", () => {
    const newCity = cityInput.value.trim();
    if (newCity !== "") {
        getWeatherInfo(newCity);
        cityInput.value = "";
    }
});
// Enter ile arama
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const newCity = cityInput.value.trim();
        if (newCity !== "") {
            getWeatherInfo(newCity);
            cityInput.value = "";
        }
    }
});