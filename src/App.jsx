/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import "./Header.css";
import { NavBar } from "./NavBar";
import { Favourites } from "./Favourites";
import { ErrorMessage, Loader } from "./Loader";

import { useGeolocation } from "./hooks/useGeoLocation";
import { useFetchLocation } from "./hooks/useFetchLocation";
import { useFetchWeather } from "./hooks/useFetchWeather";
import { useFetchForecast } from "./hooks/useFetchForecast";

function App() {
  const [city, setCity] = useState("");
  const { coords } = useGeolocation();
  const [coordinates, setCoordinates] = useState(coords);
  const [selectedCity, setSelectedCity] = useState("");
  const [addCity, setAddCity] = useState(null);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favCities") || "[]")
  );

  const [isLoader, setIsLoader] = useState(null);
  const [isError, setIsError] = useState(null);

  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useFetchLocation(city ?? null, coords ?? null);

  // updating coordinates on basis of location
  useEffect(() => {
    setCoordinates({
      lat: location?.lat,
      lon: location?.lon,
    });
  }, [location]);

  const {
    weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useFetchWeather(city ?? null, coordinates ?? null);

  const {
    forecast,
    isLoading: isForecastLoading,
    error: forecastError,
  } = useFetchForecast(coordinates ?? null);

  // updating value addCity to add it to fav
  useEffect(() => {
    setAddCity({
      id: weather?.id,
      name: location?.name,
      state: location?.state,
      country: location?.country,
      lat: location?.lat,
      lon: location?.lon,
    });
  }, [weather, location]);

  // updating fav list by clicking
  function handleAddToFavourites(addCity) {
    setFavourites((prevFavourites) => {
      if (!prevFavourites.some((city) => city.id === addCity.id)) {
        return [...prevFavourites, addCity];
      }
      return prevFavourites;
    });
  }

  // updating local storage
  useEffect(() => {
    localStorage.setItem("favCities", JSON.stringify(favourites ?? []));
  }, [favourites]);

  useEffect(() => {
    const storedFavourites = JSON.parse(
      localStorage.getItem("favCities") || "[]"
    );
    if (storedFavourites) setFavourites(storedFavourites);
  }, []);

  // updating city to fetch weather details and forecast
  useEffect(() => {
    setCity(selectedCity.name);
  }, [selectedCity]);

  useEffect(() => {
    setIsLoader(isLocationLoading || isWeatherLoading || isForecastLoading);
  }, [isLocationLoading, isWeatherLoading, isForecastLoading]);

  useEffect(() => {
    setIsError(locationError || weatherError || forecastError);
  }, [locationError, weatherError, forecastError]);

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
        {isLoader ? (
          <Loader />
        ) : (
          <>
            {weather && location && !isError && (
              <CurrentWeather
                weatherData={weather ?? null}
                locationData={location ?? null}
                weatherError={weatherError}
                addCity={addCity}
                favourites={favourites}
                handleAddToFavourites={handleAddToFavourites}
              />
            )}

            {forecast && !isError && (
              <ForecastWeather
                forecastData={
                  locationError || weatherError ? null : forecast ?? null
                }
              />
            )}
          </>
        )}

        {isError && <ErrorMessage message={isError} />}
      </main>
    </>
  );
}
export default App;

function CurrentWeather({
  weatherData,
  locationData,
  addCity,
  favourites,
  handleAddToFavourites,
}) {
  if (!weatherData) return <Loader />;

  return (
    <section className="currentWeather">
      <div className="currentWeather_data">
        <div className="currentWeather_name">
          <h2 className="currentWeather_heading">
            {locationData?.name},{" "}
            <span className="location_heading_state">
              {locationData?.state}
            </span>
          </h2>
          <span className="location_heading_country">
            {locationData?.country}
          </span>
        </div>
        <p className="current_temp">
          {parseInt(weatherData?.main.temp || 0)}&deg;<span>C</span>
        </p>
        <div className="current_min_max">
          <p>
            Max:{" "}
            <span>{Number(weatherData?.main.temp_max).toFixed(1)}&deg;</span>
          </p>
          <p>
            Min:{" "}
            <span>{Number(weatherData?.main.temp_min).toFixed(1)}&deg;</span>
          </p>
        </div>

        <div className="logo ">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon.replace(
              "n",
              "d"
            )}@2x.png`}
            alt={weatherData?.weather[0].main}
          />
          <p className="current_weather_main">{weatherData?.weather[0].main}</p>
          <p className="current_weather_description">
            {weatherData?.weather[0].description}
          </p>
        </div>

        <p className="current_humidity">
          Humidity <span>{weatherData?.main.humidity}%</span>
        </p>

        <p className="current_wind_speed">
          Wind Speed{" "}
          <span>{Number(weatherData?.wind.speed).toFixed(1)} m/s</span>
        </p>

        <span className="current_rain">
          {weatherData?.rain
            ? `It's raining! (${weatherData?.rain["1h"]} mm)`
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
  if (!forecastData) return <Loader />;

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
