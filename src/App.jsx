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
  const [forcastData, setForcastData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherbyCords = async function (latitude, longitude) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("❌Something went wrong with weather.");

    const data = await res.json();
    console.log("by cords", data);

    if (data.cod !== 200) throw new Error("Weather not found.");

    setWeatherData(data);

    fetchLocationDetails(data.name);

    fetchForcast(data.name);
  };

  const fetchLocationDetails = async function (cityName) {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );

    if (!res.ok)
      throw new Error("❌Something went wrong with Location Details.");

    const data = await res.json();

    if (data.length === 0) throw new Error("Location Details not found.");

    setLocationData(data);
  };

  const fetchForcast = async function (city) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok)
      throw new Error("❌Something went wrong with Forcast Details.");

    const data = await res.json();
    console.log("forcast", data);

    if (data.cod !== "200") throw new Error("Forcast Details not found.");

    setForcastData(data);
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
      <NavBar city={city} setCity={setCity} />

      <main>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <Favourites />
            <MyLocation
              weatherData={weatherData}
              locationData={locationData}
              forcastData={forcastData}
            />
          </>
        )}
      </main>
    </>
  );
}

function MyLocation({ weatherData, locationData }) {
  if (!weatherData) return <p className="loading">Loading weather data...</p>;

  if (!locationData || locationData.length === 0)
    return <p className="loading">Loading location data...</p>;

  const location = locationData[0]; // Get the first location result

  console.log();

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
            <p>Max: 22&deg;</p>
            <p>Min: 10&deg;</p>
          </div>

          <div className="logo ">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Icon"
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

        <div className="forcast weather_card">
          <ForcastCard />
          <ForcastCard />
          <ForcastCard />
          <ForcastCard />
          <ForcastCard />
        </div>
      </div>
    </section>
  );
}

export default App;

function ForcastCard() {
  return (
    <div className="forcast_card">
      <div className="date_time">
        <span>{"Today"}</span>|<span>{"03:00"}</span>
      </div>
      <div className="day_logo">
        <span>☀️</span>
      </div>
      <h3 className="day_heading">Clear Sky</h3>

      <p className="day_data_card day_max">
        Max <span>20&deg; c</span>
      </p>
      <p className="day_data_card day_max">
        Min <span>16&deg; c</span>
      </p>
      <p className="day_data_card day_humidity">
        Wind <span>68 m/s</span>
      </p>
      <p className="day_data_card day_wind">
        Humidity <span>68%</span>
      </p>
    </div>
  );
}
