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
  const [addCity, setAddCity] = useState(null);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favCities") || "[]")
  );
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  function handleAddToFavourites(addCity) {
    setFavourites((prevFavourites) => {
      if (!prevFavourites.some((city) => city.name === addCity.name)) {
        return [...prevFavourites, addCity];
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

            setError("");
            setWeatherData(weatherData);
            setAddCity({
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

          setError("");
          setWeatherData(weatherData);
          setAddCity({
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

  useEffect(() => {
    async function fetchWeather() {
      try {
        if (!selectedCity) return;

        const weatherData = await fetchCurrentWeather(
          selectedCity.lat,
          selectedCity.lon
        );

        const parsedForecastData = await fetchForecastData(
          selectedCity.lat,
          selectedCity.lon
        );

        setError("");
        setWeatherData(weatherData);
        setAddCity({
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
  }, [selectedCity]);

  return (
    <>
      <NavBar setCity={setCity}>
        <Favourites
          favourites={favourites}
          setFavourites={setFavourites}
          addCity={addCity}
          setAddCity={setAddCity}
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
              addCity={addCity}
              favourites={favourites}
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

function CurrentWeather({
  weatherData,
  favourites,
  handleAddToFavourites,
  addCity,
}) {
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
        onClick={() => handleAddToFavourites(addCity)}
      >
        <svg
          className={
            favourites.some((city) => city.name === addCity.name)
              ? "selected"
              : ""
          }
          viewBox="0 0 24 24"
          fill="#353535"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
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
