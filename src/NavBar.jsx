/* eslint-disable react/prop-types */
import { useState } from "react";

export function NavBar({ setCity, children }) {
  const [query, setQuery] = useState("");
  function handleSubmit(e) {
    e.preventDefault();

    if (!query) return;

    setCity(query);
    setQuery("");
  }

  return (
    <header>
      <nav className="navBar">
        <h1>Weather</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="search"
            name="search"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
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
