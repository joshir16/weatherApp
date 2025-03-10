/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { API_KEY } from "../assets/utils";

export function Favourites({ favourites, setFavourites, setSelectedCity }) {
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

      localStorage.setItem(
        "favCities",
        JSON.stringify(updatedFavourites ?? [])
      );
      if (updatedFavourites.length == 0) return [];

      return updatedFavourites;
    });
  }

  return (
    <section className="favourites">
      <div
        className="favourites_heading"
        onClick={() => setIsOpen(() => !isOpen)}
      >
        <h2>Favourites</h2>
        <svg
          className={isOpen ? "rotate" : ""}
          viewBox="0 0 16 16"
          fill="#353535"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isOpen &&
        (favouritesData.length > 0 ? (
          <ul className="city_list">
            {favouritesData.map((cityData) => (
              <CityCard
                cityData={cityData}
                key={cityData.id}
                handleRemove={handleRemove}
                setSelectedCity={setSelectedCity}
              />
            ))}
          </ul>
        ) : (
          <p className="note">No favourites added.</p>
        ))}
    </section>
  );
}

function CityCard({ cityData, handleRemove, setSelectedCity }) {
  function handleSeletectCity(data) {
    setSelectedCity({
      name: data.name,
      lat: data.coord.lat,
      lon: data.coord.lon,
    });
  }

  return (
    <li className="city_item">
      <div
        className="city_card"
        role="button"
        onClick={() => handleSeletectCity(cityData)}
      >
        <img
          className="weather_icon"
          src={`https://openweathermap.org/img/wn/${cityData.weather[0].icon.replace(
            "n",
            "d"
          )}@2x.png`}
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
      </div>

      <button
        className="closebtn"
        title="Remove"
        onClick={() => handleRemove(cityData.id, cityData.name)}
      >
        ❌
      </button>
    </li>
  );
}
