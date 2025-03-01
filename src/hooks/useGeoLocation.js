import { useEffect, useState } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setError("Location access denied. Please enter a city manually.");
      }
    );
  }, []);

  return { coords, error };
}
