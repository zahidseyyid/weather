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

    try {
        const responseWeather = await fetch(queryUrl);
        const weatherData = await responseWeather.json();

        var weatherCity = weatherData.location.name;
        var weatherTemp = Math.round(weatherData.current.temp_c);
        var weatherTextEng = weatherData.current.condition.text;
        var weatherWind = weatherData.current.wind_kph;
        var weatherHumidity = weatherData.current.humidity;
        var currentHour = weatherData.location.localtime.split(" ")[1].split(":")[0];
        var todayMinTempc = weatherData.forecast.forecastday[0].day.mintemp_c;
        var todayMaxTempc = weatherData.forecast.forecastday[0].day.maxtemp_c;
        var todayTextEng = weatherData.forecast.forecastday[0].day.condition.text;
        var tomorrowMinTempc = weatherData.forecast.forecastday[1].day.mintemp_c;
        var tomorrowMaxTempc = weatherData.forecast.forecastday[1].day.maxtemp_c;
        var tomorrowTextEng = weatherData.forecast.forecastday[1].day.condition.text;
        var dayAfterMinTempc = weatherData.forecast.forecastday[2].day.mintemp_c;
        var dayAfterMaxTempc = weatherData.forecast.forecastday[2].day.maxtemp_c;
        var dayAfterTextEng = weatherData.forecast.forecastday[2].day.condition.text;

        // Textleri türkçe çevirme
        const havaDurumuCevir = {
            "Sunny":"Güneşli",
            "Partly cloudy":"Parçalı Bulutlu",
            "Cloudy":"Bulutlu",
            "Overcast":"Çok Bulutlu",
            "Mist":"Sisli",
            "Patchy rain nearby":"Bölgesel düzensiz yağmur yağışlı",
            "Patchy snow nearby":"Bölgesel düzensiz kar yağışlı",
            "Patchy sleet nearby":"Bölgesel düzensiz karla karışık yağmurlu",
            "Patchy freezing drizzle nearby":"Bölgesel düzensiz donmuş çisenti",
            "Thundery outbreaks in nearby":"Bölgesel düzensiz gök gürültülü yağmurlu",
            "Blowing snow":"Tipi",
            "Blizzard":"Kar fırtınası",
            "Fog":"Puslu",
            "Freezing fog":"Dondurucu sis",
            "Patchy light drizzle":"Bölgesel düzensiz hafif çisenti",
            "Light drizzle":"Hafif çisenti",
            "Freezing drizzle":"Dondurucu çisenti",
            "Heavy freezing drizzle":"Yoğun dondurucu çisenti",
            "Patchy light rain":"Düzensiz hafif yağmurlu",
            "Light rain":"Hafif yağmurlu",
            "Moderate rain at times":"Ara ara orta kuvvetli yağmurlu",
            "Moderate rain":"Orta kuvvetli yağmurlu",
            "Heavy rain at times":"Ara ara şiddetli yağmurlu",
            "Heavy rain":"Şiddetli yağmurlu",
            "Light freezing rain":"Hafif dondurucu yağmurlu",
            "Moderate or heavy freezing rain":"Orta kuvvetli veya Şiddetli dondurucu yağmurlu",
            "Light sleet":"Hafif karla karışık yağmur",
            "Moderate or heavy sleet":"Orta kuvvetli veya şiddetli karla karışık yağmur",
            "Patchy light snow":"Düzensiz hafif karlı",
            "Light snow":"Hafif karlı",
            "Patchy moderate snow":"Düzensiz orta kuvvetli karlı",
            "Moderate snow":"Orta kuvvetli karlı",
            "Patchy heavy snow":"Düzensiz yoğun kar yağışlı",
            "Heavy snow":"Yoğun kar yağışlı",
            "Ice pellets":"Buz taneleri",
            "Light rain shower":"Hafif sağnak yağışlı",
            "Moderate or heavy rain shower":"Orta kuvvetli veya yoğun sağnak yağışlı",
            "Torrential rain shower":"Şiddetli sağnak yağmur",
            "Light sleet showers":"Hafif karla karışık sağnak yağış",
            "Moderate or heavy sleet showers":"Orta kuvvetli veya yoğun karla karışık sağnak yağış",
            "Light snow showers":"Hafif sağnak şeklinde kar",
            "Moderate or heavy snow showers":"Orta kuvvetli veya yoğun ve sağnak şeklinde kar",
            "Light showers of ice pellets":"Hafif buz taneleri şeklinde sağnak yağış",
            "Moderate or heavy showers of ice pellets":"Orta kuvvetli veya yoğun buz taneleri sağnak yağışlı",
            "Patchy light rain in area with thunder":"Bölgesel gök gürültülü düzensiz hafif yağmur",
            "Moderate or heavy rain in area with thunder":"Bölgesel gök gürültülü orta kuvvetli veya şiddetli yağış",
            "Patchy light snow in area with thunder":"Bölgesel gök gürültülü düzensiz hafif kar yağışlı",
            "Moderate or heavy snow in area with thunder":"Bölgesel gök gürültülü orta kuvvetli veya yoğun kar yağışlı",
         };
        
         const weatherText = havaDurumuCevir[weatherTextEng];
         const todayText = havaDurumuCevir[todayTextEng];
         const tomorrowText = havaDurumuCevir[tomorrowTextEng];
         const dayAfterText = havaDurumuCevir[dayAfterTextEng];

        // Saatlik tahminleri diziye ekleme
        var hourlyForecasts = [];
        var dayIndex = 0;
        var hourIndex = 0;

        for (var i = 0; i <= 30; i++) {
            var hourFull = weatherData.forecast.forecastday[dayIndex].hour[hourIndex].time;
            var tempCHour = weatherData.forecast.forecastday[dayIndex].hour[hourIndex].temp_c;

            var forecastHour = parseInt(hourFull.split(' ')[1].split(':')[0]);

            if (hourlyForecasts.length <= 5) {
                if (forecastHour >= currentHour) {
                    hourlyForecasts.push(tempCHour);
                }
            }
            hourIndex++;
                // Saat 23:00'e geldiğinde, bir sonraki güne geç
                if (forecastHour === 23) {
                    dayIndex++;
                    hourIndex = 0;
                    currentHour = 0; // Saati sıfırla
                }
        }

        console.log(hourlyForecasts);

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
