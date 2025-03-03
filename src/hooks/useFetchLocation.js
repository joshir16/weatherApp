import { useEffect, useState } from "react";
import { API_KEY } from "../utils";

export function useFetchLocation(city, coordinates) {
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city && (!coordinates?.lat || !coordinates?.lon)) return; // Exit if both are null

    setIsLoading(true);
    setError("");

    async function fetchLocation() {
      try {
        let url = "";
        if (city) {
          url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
        } else if (coordinates?.lat && coordinates?.lon) {
          url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("❌Something went wrong with Location.");
        const data = await res.json();
        if (data.length === 0) throw new Error("Location not found.");

        setLocation(data[0]);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();
  }, [city, coordinates]);

  return { location, isLoading, error };
}
