export function Favourites() {
  return (
    <section className="favourites">
      <h2>Favourites</h2>
      <div className="city_box">
        <CityCard />
        <CityCard />
        <CityCard />
        <CityCard />
        <CityCard />
      </div>
    </section>
  );
}

function CityCard() {
  return (
    <div className="city-card">
      <span className="weater_icon">☀️</span>
      <div className="city">
        <p>New Delhi</p>
        <span>In</span>
      </div>
      <div>
        <p>15&deg; C</p>
        <span>Clear Sky</span>
      </div>
    </div>
  );
}
