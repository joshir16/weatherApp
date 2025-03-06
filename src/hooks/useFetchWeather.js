import { useEffect, useState } from "react";
import { API_KEY } from "../utils";
import { useAxiosFetch } from "./useAxiosFetch";

export function useFetchWeather(city, coordinates) {
  const [url, setUrl] = useState(null);

  const { data: weather, isLoading, error } = useAxiosFetch(url);

  useEffect(() => {
    if (!city && (!coordinates?.lat || !coordinates?.lon)) return; // Exit if both are null

    if (city) {
      setUrl(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    } else if (coordinates?.lat && coordinates?.lon) {
      setUrl(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates?.lat}&lon=${coordinates?.lon}&appid=${API_KEY}&units=metric`
      );
    }
  }, [city, coordinates]);

  return { weather, isLoading, error };
}
