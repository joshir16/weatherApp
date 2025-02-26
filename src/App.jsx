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

function App() {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favCities") || "[]")
  );
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  function handleAddToFavourites(selectedCity) {
    setFavourites((prevFavourites) => {
      console.log(prevFavourites);
      if (!prevFavourites.some((city) => city.name === selectedCity.name)) {
        return [...prevFavourites, selectedCity];
      }
      return prevFavourites;
    });
  }

  useEffect(function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        async function fetchWeather() {
          try {
            const weatherData = await fetchCurrentWeather(latitude, longitude);

            const parsedForecastData = await fetchForecastData(
              latitude,
              longitude
            );

            setWeatherData(weatherData);
            setSelectedCity({
              id: weatherData.data.id,
              name: weatherData.locationData[0].name,
              state: weatherData.locationData[0].state,
              country: weatherData.locationData[0].country,
              lat: weatherData.locationData[0].lat,
              lon: weatherData.locationData[0].lon,
            });
            setForecastData(parsedForecastData);
          } catch (err) {
            console.log(err);
            setError(err.message || "Something went wrong!");
          }
        }

        fetchWeather();
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setError("Location access denied. Please enter a city manually.");
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
          setSelectedCity({
            id: weatherData.data.id,
            name: weatherData.locationData[0].name,
            state: weatherData.locationData[0].state,
            country: weatherData.locationData[0].country,
            lat: weatherData.locationData[0].lat,
            lon: weatherData.locationData[0].lon,
          });
          setForecastData(parsedForecastData);
        } catch (err) {
          console.log(err);
          setError(err.message || "Something went wrong!");
        }
      }

      fetchWeather();
    },
    [city]
  );

  useEffect(() => {
    localStorage.setItem("favCities", JSON.stringify(favourites ?? []));
  }, [favourites]);

  useEffect(() => {
    const storedFavourites = JSON.parse(
      localStorage.getItem("favCities") || "[]"
    );
    if (storedFavourites) setFavourites(storedFavourites);
  }, []);

  return (
    <>
      <NavBar setCity={setCity}>
        <Favourites
          favourites={favourites}
          setFavourites={setFavourites}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </NavBar>

      <main>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <CurrentWeather
              weatherData={weatherData}
              selectedCity={selectedCity}
              handleAddToFavourites={handleAddToFavourites}
            />
            <ForecastWeather forecastData={forecastData} />
          </>
        )}
      </main>
    </>
  );
}
export default App;

function CurrentWeather({ weatherData, handleAddToFavourites, selectedCity }) {
  if (!weatherData) return <p className="loading">Loading weather data...</p>;

  const locationData = weatherData.locationData[0];
  console.log(weatherData);

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
          <p>
            Max:{" "}
            <span>
              {Number(weatherData.data.main.temp_max).toFixed(1)}&deg;
            </span>
          </p>
          <p>
            Min:{" "}
            <span>
              {Number(weatherData.data.main.temp_min).toFixed(1)}&deg;
            </span>
          </p>
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

        <span className="current_rain">
          {weatherData.data?.rain
            ? `It's raining! (${weatherData.data?.rain["1h"]} mm)`
            : ``}
        </span>
      </div>
      <button
        className="addbtn"
        title="Add to Favourites"
        onClick={() => handleAddToFavourites(selectedCity)}
      >
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
