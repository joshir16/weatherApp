import { useEffect, useState } from "react";
import { API_KEY } from "../utils";

export function useFetchLocation(coords) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    async function fetchLocation() {
      if (!coords || !coords.lat || !coords.lon) return;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("❌Something went wrong with Location.");
        const data = await res.json();
        if (data.cod !== 200) throw new Error("Location not found.");
        console.log(data);

        setLocation(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setError(err);
      }
    }

    fetchLocation();
  }, [coords]);

  return { location, isLoading, error };
}
