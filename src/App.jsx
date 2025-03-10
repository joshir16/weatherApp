import { useEffect, useState } from "react";

import "./styles/index.css";
import "./styles/App.css";
import "./styles/Header.css";

import { NavBar } from "./components/NavBar";
import { Favourites } from "./components/Favourites";
import { ErrorMessage, Loader } from "./components/Loader";
import { ForecastWeather } from "./components/ForecastWeather";
import { CurrentWeather } from "./components/CurrentWeather";

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
    setCity((curCity) => {
      if (curCity != selectedCity.name) return selectedCity.name;

      return curCity;
    });
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
          </>
        )}

        {isForecastLoading ? (
          <Loader />
        ) : (
          <>
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
