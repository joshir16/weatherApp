/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { API_KEY } from "./utils";

export function Favourites({ favourites, setFavourites }) {
  const [isOpen, setIsOpen] = useState(true);
  const [favouritesData, setFavouritesData] = useState([]);

  useEffect(
    function () {
      async function fetchFavWeather() {
        try {
          const favWeatherData = await Promise.all(
            favourites.map(async (city) => {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
              );
              if (!res.ok)
                throw new Error("❌ Something went wrong with weather.");

              return res.json();
            })
          );
          setFavouritesData(favWeatherData);
        } catch (err) {
          console.error(err.message);
        }
      }

      if (favourites.length > 0) {
        fetchFavWeather();
      } else {
        setFavouritesData([]); // Reset the state when favourites is empty
      }
    },
    [favourites]
  );

  /**  Remove City from Favourites */
  function handleRemove(id, name) {
    setFavourites((prevFavourites) => {
      if (!Array.isArray(prevFavourites)) return []; // Ensure it's always an array

      const updatedFavourites = prevFavourites.filter(
        (city) => city.id !== id && city.name !== name
      );

      console.log("Updated Favourites:", updatedFavourites); // Debugging log
      localStorage.setItem(
        "favCities",
        JSON.stringify(updatedFavourites ?? [])
      );
      console.log(updatedFavourites);
      if (updatedFavourites.length == 0) return [];

      setFavouritesData(updatedFavourites);

      return updatedFavourites;
    });
  }

  return (
    <section className="favourites">
      <h2 onClick={() => setIsOpen(() => !isOpen)}>Favourites</h2>
      {isOpen &&
        (favouritesData.length > 0 ? (
          <ul className="city_box">
            {favouritesData.map((cityData) => (
              <CityCard
                cityData={cityData}
                key={cityData.id}
                handleRemove={handleRemove}
              />
            ))}
          </ul>
        ) : (
          <p className="note">No favourites added.</p>
        ))}
    </section>
  );
}

function CityCard({ cityData, handleRemove }) {
  return (
    <div className="city-card">
      <img
        className="weather_icon"
        src={`https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`}
        alt={cityData.weather[0].main}
      />
      <div className="city">
        <p>{cityData.name}</p>
        <span>{cityData.sys.country}</span>
      </div>
      <div>
        <p>{Number(cityData.main.temp).toFixed(1)} &deg; C</p>
        <span>{cityData.weather[0].main}</span>
      </div>

      <button
        className="closebtn"
        title="Remove"
        onClick={() => handleRemove(cityData.id, cityData.name)}
      >
        x
      </button>
    </div>
  );
}
