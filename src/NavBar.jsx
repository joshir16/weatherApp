// eslint-disable-next-line react/prop-types
export function NavBar({ query, setQuery }) {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <nav className="navBar">
      <h2>Weather</h2>
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
  );
}
