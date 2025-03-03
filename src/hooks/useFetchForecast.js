import { useEffect, useState } from "react";
import { API_KEY, filterForecastData } from "../utils";

export function useFetchForecast(coords) {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords?.lat || !coords?.lon) return; // Exit if both are null

    setIsLoading(true);
    setError("");

    const controller = new AbortController();

    async function fetchLocation() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("❌Something went wrong with Forecast Details.");

        const data = await res.json();
        if (data.cod !== "200") throw new Error("Forecast Details not found.");

        const parsedData = filterForecastData(data);

        setForecast(parsedData);
        setIsLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();

    return () => controller.abort();
  }, [coords]);

  return { forecast, isLoading, error };
}
