/* eslint-disable react/prop-types */
import { Loader } from "./Loader";

export function CurrentWeather({
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
