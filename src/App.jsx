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
    console.log(data);

    if (data.cod !== 200) throw new Error("Weather not found.");

    setWeatherData(data);
    fetchLocationDetails(data.name);
  };

  const fetchLocationDetails = async function (cityName) {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );

    if (!res.ok)
      throw new Error("❌Something went wrong with Location Details.");

    const data = await res.json();
    console.log(data);

    if (data.length === 0) throw new Error("Location Details not found.");

    setLocationData(data);
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
            <MyLocation weatherData={weatherData} locationData={locationData} />
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

          <div className="current_weather">
            <p className="cur_temp">{parseInt(weatherData.main.temp)}&deg;</p>
            <div className="min_max current_weather_detail_card">
              <p>Max: 22</p>
              <p>Min: 10</p>
            </div>
            <div className="logo ">
              <span>☀️</span>
              <p>{weatherData.weather[0].main}</p>
            </div>

            <div className="humidity current_weather_detail_card">
              <span>💧</span>
              <p>
                Humidity <span>{weatherData.main.humidity}%</span>
              </p>
            </div>

            <div className="wind_speed current_weather_detail_card">
              <span>💨</span>
              <p>
                Wind Speed{" "}
                <span>{Number(weatherData.wind.speed).toFixed(1)} m/s</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mylocation_weather weather_card">
          <div className="day_data">1</div>
          <div className="day_data">2</div>
          <div className="day_data">3</div>
          <div className="day_data">4</div>
          <div className="day_data">5</div>
        </div>
      </div>
    </section>
  );
}

export default App;
