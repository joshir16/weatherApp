export function NavBar() {
  return (
    <nav className="navBar">
      <h2>Weather</h2>
      <div>
        <input
          className="search"
          name="search"
          type="text"
          placeholder="Search..."
        />
      </div>
    </nav>
  );
}
