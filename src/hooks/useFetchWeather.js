import { useEffect, useState } from "react";
import { API_KEY } from "../utils";

export function useFetchWeather(city, coordinates) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city && (!coordinates?.lat || !coordinates?.lon)) return; // Exit if both are null

    setIsLoading(true);
    setError("");

    async function fetchLocation() {
      let url = "";
      if (coordinates?.lat && coordinates?.lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates?.lat}&lon=${coordinates?.lon}&appid=${API_KEY}&units=metric`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("❌Something went wrong with Weather.");
        const data = await res.json();
        if (data.cod !== 200) throw new Error("Weather not found.");

        setWeather(data);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();
  }, [city, coordinates]);

  return { weather, isLoading, error };
}
