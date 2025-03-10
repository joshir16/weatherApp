export const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// fetch current weather by latitude / longitude
// export async function fetchCurrentWeather(latitude, longitude) {
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
//   );
//   if (!res.ok) throw new Error("❌Something went wrong with weather.");
//   const data = await res.json();
//   if (data.cod !== 200) throw new Error("Weather not found.");

//   const resp = await fetch(
//     `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
//   );
//   if (!resp.ok)
//     throw new Error("❌Something went wrong with Location Details.");
//   const locationData = await resp.json();
//   if (locationData.length === 0) throw new Error("Location Details not found.");

//   return { data, locationData };
// }

// filter forecast data --------------------
export const filterForecastData = function (data) {
  if (!data || !data.list) return [];
  const grouped = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD
    if (!grouped[date]) {
      grouped[date] = {
        tempSum: 0,
        maxtempSum: [],
        mintempSum: [],
        humiditySum: 0,
        windSpeed: 0,
        count: 0,
        iconCode: "",
        weather: "",
      };
    }
    grouped[date].tempSum += item.main.temp;
    grouped[date].maxtempSum.push(item.main.temp_max);
    grouped[date].mintempSum.push(item.main.temp_min);
    grouped[date].humiditySum += item.main.humidity;
    grouped[date].windSpeed += item.wind.speed;
    grouped[date].count += 1;
    grouped[date].iconCode = item.weather[0].icon;
    grouped[date].weather = item.weather[0].main;
  });

  return Object.keys(grouped).map((date) => ({
    date,
    iconCode: grouped[date].iconCode,
    weather: grouped[date].weather,
    avgTemp: (grouped[date].tempSum / grouped[date].count).toFixed(2),
    avgMaxTemp: Math.max(...grouped[date].maxtempSum),
    avgMinTemp: Math.min(...grouped[date].mintempSum),
    avgHumidity: (grouped[date].humiditySum / grouped[date].count).toFixed(2),
    avgWindSpeed: (grouped[date].windSpeed / grouped[date].count).toFixed(2),
  }));
};

// fetch weather forecast -------------------
// export async function fetchForecastData(latitude, longitude) {
//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
//   );

//   if (!res.ok) throw new Error("❌Something went wrong with Forecast Details.");
//   const data = await res.json();
//   if (data.cod !== "200") throw new Error("Forecast Details not found.");

//   const parseData = filterForecastData(data);

//   return parseData;
// }

// fetch weather by city ---------------------
// export async function fetchWeatherByCity(city) {
//   const resp = await fetch(
//     `https://api.openweathermap.org/geo/1.0/direct?q=${city}}&appid=${API_KEY}`
//   );
//   if (!resp.ok)
//     throw new Error("❌Something went wrong with Location Details.");
//   const locationData = await resp.json();
//   if (locationData.length === 0)
//     throw new Error(`Location(${city}) not found.`);

//   const res = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${locationData[0].lat}&lon=${locationData[0].lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
//   );
//   if (!res.ok) throw new Error("❌Something went wrong with weather.");
//   const data = await res.json();
//   if (data.cod !== 200) throw new Error(`Weather for ${city} not found.`);

//   return { data, locationData };
// }
