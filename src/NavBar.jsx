/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export function NavBar({ setCity, children }) {
  const [query, setQuery] = useState("");
  const inputEl = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;

    setCity(query);
    setQuery("");
  }

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <header>
      <nav className="navBar">
        <h1>WeatherApp</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="search"
            name="search"
            type="text"
            placeholder="Search City, State..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            ref={inputEl}
          />
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
      </nav>

      {children}
    </header>
  );
}
