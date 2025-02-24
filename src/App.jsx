import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import "./Header.css";
import { Favourites } from "./Favourites";
import { NavBar } from "./NavBar";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");

  useEffect(function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, []);

  return (
    <>
      <NavBar setCity={setCity}>
        <Favourites />
      </NavBar>

      <main>
        <CurrentWeather />
        <ForecastWeather />
      </main>
    </>
  );
}
export default App;

function CurrentWeather() {
  return (
    <section className="currentWeather">
      <div className="currentWeather_data">
        <div className="currentWeather_name">
          <h2 className="currentWeather_heading">
            Noida, <span className="location_heading_state">{"UP"}</span>
          </h2>
          <span className="location_heading_country">{"IN"}</span>
        </div>
        <p className="current_temp">
          {parseInt(20)}&deg;<span>C</span>
        </p>
        <div className="current_min_max">
          <p>Max: {parseInt(21)}&deg;</p>
          <p>Min: {Number(19).toFixed(1)}&deg;</p>
        </div>

        <div className="logo ">
          <span>🌤️</span>
          {/* <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon.replace(
                "n",
                "d"
              )}@2x.png`}
              alt={weatherData.weather[0].main}
            /> */}
          <p className="current_weather_main">{"Clouds"}</p>
          <p className="current_weather_description">{"Some text"}</p>
        </div>

        <p className="current_humidity">
          Humidity <span>{34}%</span>
        </p>
        <p className="current_wind_speed">
          Wind Speed <span>{Number(2.4).toFixed(1)} m/s</span>
        </p>

        {/* <p className="rain">
            {weatherData?.rain
              ? `It's raining! (${weatherData?.rain["1hr"]} mm)`
              : ``}
          </p> */}
      </div>
      <button className="addbtn" title="Add to Favourites">
        +
      </button>
    </section>
  );
}

function ForecastWeather() {
  return (
    <section className="forcast">
      <ForcastCard />
      <ForcastCard />
      <ForcastCard />
      <ForcastCard />
      <ForcastCard />
    </section>
  );
}

function ForcastCard() {
  return (
    <li className="forcast_card">
      <div className="date_time">
        <span>
          {`
          ${String(new Date().getDate()).padStart(2, "0")} 
          ${new Date().toLocaleString("en-US", { month: "long" })}
        `}
        </span>
      </div>
      <div className="day_logo">
        <span>☀️</span>
        {/* <img
          src={`https://openweathermap.org/img/wn/${dayData.iconCode.replace(
            "n",
            "d"
          )}@2x.png`}
          alt={dayData.weather}
        /> */}
      </div>
      <h3 className="day_heading">{"Sunny"}</h3>

      <p className="day_data_card day_max">
        Max <span>{Number(25).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_max">
        Min <span>{Number(18).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_humidity">
        Wind <span>{Number(2.3).toFixed(1)} m/s</span>
      </p>
      <p className="day_data_card day_wind">
        Humidity <span>{Number(34).toFixed(1)}%</span>
      </p>
    </li>
  );
}
