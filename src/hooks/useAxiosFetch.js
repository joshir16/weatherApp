import { useEffect, useState } from "react";
import axios from "axios";

export function useAxiosFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const fetchData = async function () {
      try {
        const res = await axios.get(url, { signal: controller.signal });
        console.log(res.data);
        setData(res.data);

        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
        } else {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}
