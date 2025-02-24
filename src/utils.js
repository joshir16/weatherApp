export const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchCurrentWeather(latitude, longitude) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("❌Something went wrong with weather.");
  const data = await res.json();
  if (data.cod !== 200) throw new Error("Weather not found.");
  console.log(data);

  const resp = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  );
  if (!resp.ok)
    throw new Error("❌Something went wrong with Location Details.");
  const locationData = await resp.json();
  if (locationData.length === 0) throw new Error("Location Details not found.");
  console.log(locationData);

  return { data, locationData };
}

const filterForecastData = function (data) {
  if (!data || !data.list) return [];
  const grouped = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD
    if (!grouped[date]) {
      grouped[date] = {
        tempSum: 0,
        maxtempSum: 0,
        mintempSum: 0,
        humiditySum: 0,
        windSpeed: 0,
        count: 0,
        iconCode: "",
        weather: "",
      };
    }
    grouped[date].tempSum += item.main.temp;
    grouped[date].maxtempSum += item.main.temp_max;
    grouped[date].mintempSum += item.main.temp_min;
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
    avgMaxTemp: (grouped[date].maxtempSum / grouped[date].count).toFixed(2),
    avgMinTemp: (grouped[date].mintempSum / grouped[date].count).toFixed(2),
    avgHumidity: (grouped[date].humiditySum / grouped[date].count).toFixed(2),
    avgWindSpeed: (grouped[date].windSpeed / grouped[date].count).toFixed(2),
  }));
};

export async function fetchForecastData(latitude, longitude) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) throw new Error("❌Something went wrong with Forcast Details.");
  const data = await res.json();
  if (data.cod !== "200") throw new Error("Forcast Details not found.");

  console.log(data);
  const parseData = filterForecastData(data);

  return parseData;
}
