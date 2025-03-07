import { useEffect, useReducer } from "react";
import axios from "axios";

const innitialState = {
  data: null,
  isLoading: true,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        data: null,
        error: action.payload || "Failed to fetch data",
      };

    default:
      return state;
  }
}

export function useAxiosFetch(url) {
  const [state, dispatch] = useReducer(dataReducer, innitialState);

  useEffect(() => {
    if (!url) {
      return;
    }

    const controller = new AbortController();
    const fetchData = async function () {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await axios.get(url, { signal: controller.signal });

        if (Array.isArray(res.data)) {
          dispatch({ type: "FETCH_SUCCESS", payload: res?.data[0] });
        } else {
          dispatch({ type: "FETCH_SUCCESS", payload: res?.data });
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
        } else {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: err?.response?.data?.message || err?.message,
          });
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return state;
}
