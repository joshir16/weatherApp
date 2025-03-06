import { useEffect, useState } from "react";
import { API_KEY } from "../utils";
import { useAxiosFetch } from "./useAxiosFetch";

export function useFetchLocation(city, coordinates) {
  const [url, setUrl] = useState(null);

  const { data: location, isLoading, error } = useAxiosFetch(url);

  useEffect(() => {
    if (!city && (!coordinates?.lat || !coordinates?.lon)) return; // Exit if both are null

    if (city) {
      setUrl(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`
      );
    } else if (coordinates?.lat && coordinates?.lon) {
      setUrl(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`
      );
    }
  }, [city, coordinates]);

  return { location, isLoading, error };
}
