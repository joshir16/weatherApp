import { useEffect, useState } from "react";
import { API_KEY, filterForecastData } from "../utils";
import { useAxiosFetch } from "./useAxiosFetch";

export function useFetchForecast(coords) {
  const [forecast, setForecast] = useState(null);
  const [url, setUrl] = useState(null);

  const { data, isLoading, error } = useAxiosFetch(url);

  useEffect(() => {
    if (!coords?.lat || !coords?.lon) return; // Exit if both are null

    setUrl(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
    );
  }, [coords]);

  useEffect(() => {
    const parsedData = filterForecastData(data);
    setForecast(parsedData);
  }, [data]);

  return { forecast, isLoading, error };
}
