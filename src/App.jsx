/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./App.css";
import { Favourites } from "./Favourites";
import { NavBar } from "./NavBar";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  const fetchLocationDetails = async function (cityName) {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );

    if (!res.ok)
      throw new Error("❌Something went wrong with Location Details.");

    const data = await res.json();

    if (data.length === 0) throw new Error("Location Details not found.");

    await setLocationData(data);
  };

  const fetchForcast = async function (city) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok)
      throw new Error("❌Something went wrong with Forcast Details.");

    const data = await res.json();

    if (data.cod !== "200") throw new Error("Forcast Details not found.");

    setForecastData(data);
  };

  const fetchWeatherbyCords = async function (latitude, longitude) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("❌Something went wrong with weather.");

    const data = await res.json();
    // console.log("by cords", data);

    if (data.cod !== 200) throw new Error("Weather not found.");

    setWeatherData(data);

    fetchLocationDetails(data.name);

    fetchForcast(data.name);
  };

  useEffect(function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        fetchWeatherbyCords(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setError("Please allow location access to fetch weather data.");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar city={city} setCity={setCity}>
        <Favourites />
      </NavBar>

      <main>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <MyLocation
              weatherData={weatherData}
              locationData={locationData}
              forecastData={forecastData}
            />
          </>
        )}
      </main>
    </>
  );
}

function MyLocation({ weatherData, locationData, forecastData }) {
  if (!weatherData || !forecastData)
    return <p className="loading">Loading weather data...</p>;

  if (!locationData || locationData.length === 0)
    return <p className="loading">Loading location data...</p>;

  const location = locationData[0]; // Get the first location result

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

  const parsedForecastData = forecastData
    ? filterForecastData(forecastData)
    : [];

  return (
    <section className="mylocation">
      <h2>My Location</h2>

      <div className="mylocation_card">
        <div className="mylocation_data weather_card">
          <div className="mylocation_name">
            <h2 className="mylocation_heading">
              {location.name},{" "}
              <span className="location_heading_state">{location.state}</span>
            </h2>
            <span className="location_heading_country">{location.country}</span>
          </div>
          <p className="current_temp">
            {parseInt(weatherData.main.temp)}&deg;<span>C</span>
          </p>

          <div className="current_min_max">
            <p>Max: {parseInt(weatherData.main.temp_max)}&deg;</p>
            <p>Min: {Number(weatherData.main.temp_max).toFixed(1)}&deg;</p>
          </div>

          <div className="logo ">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon.replace(
                "n",
                "d"
              )}@2x.png`}
              alt={weatherData.weather[0].main}
            />
            <p className="current_weather_main">
              {weatherData.weather[0].main}
            </p>
            <p className="current_weather_description">
              {weatherData.weather[0].description}
            </p>
          </div>

          <p className="current_humidity">
            Humidity <span>{weatherData.main.humidity}%</span>
          </p>
          <p className="current_wind_speed">
            Wind Speed{" "}
            <span>{Number(weatherData.wind.speed).toFixed(1)} m/s</span>
          </p>

          <p className="rain">
            {weatherData?.rain
              ? `It's raining! (${weatherData?.rain["1hr"]} mm)`
              : ``}
          </p>

          <button className="addbtn" title="Add to Favourites">
            +
          </button>
        </div>

        <ul className="forcast weather_card">
          {parsedForecastData.slice(1).map((dayData) => (
            <ForcastCard dayData={dayData} key={dayData.date} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;

function ForcastCard({ dayData }) {
  return (
    <div className="forcast_card">
      <div className="date_time">
        <span>{`${String(new Date(dayData.date).getDate()).padStart(
          2,
          "0"
        )} / ${String(new Date(dayData.date).getMonth()).padStart(
          2,
          "0"
        )}`}</span>
      </div>
      <div className="day_logo">
        <img
          src={`https://openweathermap.org/img/wn/${dayData.iconCode.replace(
            "n",
            "d"
          )}@2x.png`}
          alt={dayData.weather}
        />
      </div>
      <h3 className="day_heading">{dayData.weather}</h3>

      <p className="day_data_card day_max">
        Max <span>{Number(dayData.avgMaxTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_max">
        Min <span>{Number(dayData.avgMinTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_humidity">
        Wind <span>{Number(dayData.avgWindSpeed).toFixed(1)} m/s</span>
      </p>
      <p className="day_data_card day_wind">
        Humidity <span>{Number(dayData.avgHumidity).toFixed(1)}%</span>
      </p>
    </div>
  );
}
