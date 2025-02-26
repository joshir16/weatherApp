/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import "./Header.css";
import { Favourites } from "./Favourites";
import { NavBar } from "./NavBar";
import {
  fetchCurrentWeather,
  fetchForecastData,
  fetchWeatherByCity,
} from "./utils";

// const favCityData = [
//   {
//     cityname: "Chakrata",
//     lat: "30.7013248",
//     lon: "77.8703356",
//   },
//   {
//     cityname: "Delhi",
//     lat: "28.6517178",
//     lon: "77.2219388",
//   },
// ];

function App() {
  const [city, setCity] = useState("");
  // const [favourites, setFavourites] = useState(favCityData);

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  useEffect(function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        async function fetchWeather() {
          try {
            const weatherData = await fetchCurrentWeather(latitude, longitude);

            const parsedForecastData = await fetchForecastData(
              latitude,
              longitude
            );

            setWeatherData(weatherData);
            setForecastData(parsedForecastData);
          } catch (err) {
            console.log(err);
            setError(err);
          }
        }

        fetchWeather();
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, []);

  useEffect(
    function () {
      if (!city) return;

      async function fetchWeather() {
        try {
          const weatherData = await fetchWeatherByCity(city);

          const parsedForecastData = await fetchForecastData(
            weatherData.locationData[0].lat,
            weatherData.locationData[0].lon
          );

          setWeatherData(weatherData);
          setForecastData(parsedForecastData);
        } catch (err) {
          console.log(err);
          setError(err.message);
        }
      }

      fetchWeather();
    },
    [city]
  );

  return (
    <>
      <NavBar setCity={setCity}>
        <Favourites />
      </NavBar>

      <main>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <CurrentWeather weatherData={weatherData} />
        )}

        {error ? (
          <p className="error">{error}</p>
        ) : (
          <ForecastWeather forecastData={forecastData} />
        )}
      </main>
    </>
  );
}
export default App;

function CurrentWeather({ weatherData }) {
  if (!weatherData) return <p className="loading">Loading weather data...</p>;

  const locationData = weatherData.locationData[0];

  return (
    <section className="currentWeather">
      <div className="currentWeather_data">
        <div className="currentWeather_name">
          <h2 className="currentWeather_heading">
            {locationData.name},{" "}
            <span className="location_heading_state">{locationData.state}</span>
          </h2>
          <span className="location_heading_country">
            {locationData.country}
          </span>
        </div>
        <p className="current_temp">
          {parseInt(weatherData.data.main.temp)}&deg;<span>C</span>
        </p>
        <div className="current_min_max">
          <p>Max: {Number(weatherData.data.main.temp_max).toFixed(1)}&deg;</p>
          <p>Min: {Number(weatherData.data.main.temp_min).toFixed(1)}&deg;</p>
        </div>

        <div className="logo ">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.data.weather[0].icon.replace(
              "n",
              "d"
            )}@2x.png`}
            alt={weatherData.data.weather[0].main}
          />
          <p className="current_weather_main">
            {weatherData.data.weather[0].main}
          </p>
          <p className="current_weather_description">
            {weatherData.data.weather[0].description}
          </p>
        </div>

        <p className="current_humidity">
          Humidity <span>{weatherData.data.main.humidity}%</span>
        </p>
        <p className="current_wind_speed">
          Wind Speed{" "}
          <span>{Number(weatherData.data.wind.speed).toFixed(1)} m/s</span>
        </p>

        <p className="rain">
          {weatherData.data?.rain
            ? `It's raining! (${weatherData.data?.rain["1hr"]} mm)`
            : ``}
        </p>
      </div>
      <button className="addbtn" title="Add to Favourites">
        +
      </button>
    </section>
  );
}

function ForecastWeather({ forecastData }) {
  if (!forecastData) return <p className="loading">Loading forecast data...</p>;

  return (
    <section className="forecast">
      <ul className="forecast_list weather_card">
        {forecastData.slice(1).map((dayData) => (
          <ForecastCard dayData={dayData} key={dayData.date} />
        ))}
      </ul>
    </section>
  );
}

function ForecastCard({ dayData }) {
  return (
    <div className="forecast_card">
      <p className="day_data_card date_time">
        <span>
          {`
          ${String(new Date(dayData.date).getDate()).padStart(2, "0")} 
          ${new Date(dayData.date).toLocaleString("en-US", { month: "long" })}
        `}
        </span>
      </p>
      <div className="day_data_card day_logo">
        <img
          src={`https://openweathermap.org/img/wn/${dayData.iconCode.replace(
            "n",
            "d"
          )}@2x.png`}
          alt={dayData.weather}
        />
        <h3 className="day_heading">{dayData.weather}</h3>
      </div>

      <p className="day_data_card day_max">
        Max <span>{Number(dayData.avgMaxTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_max">
        Min <span>{Number(dayData.avgMinTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_wind">
        Wind <span>{Number(dayData.avgWindSpeed).toFixed(1)} m/s</span>
      </p>
      <p className="day_data_card day_humidity">
        Humidity <span>{Number(dayData.avgHumidity).toFixed(1)}%</span>
      </p>
    </div>
  );
}
