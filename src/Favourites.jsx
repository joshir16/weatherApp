import { useState } from "react";

export function Favourites() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="favourites">
      <h2 onClick={() => setIsOpen(() => !isOpen)}>Favourites</h2>
      {isOpen && (
        <div className="city_box">
          <CityCard
            icon={`☁️`}
            temp={`12`}
            weatherType={`Clouds`}
            city={`New Delhi`}
            country={`In`}
          />
        </div>
      )}
    </section>
  );
}

// eslint-disable-next-line react/prop-types
function CityCard({ icon, temp, weatherType, city, country }) {
  return (
    <div className="city-card">
      <span className="weater_icon">{icon}</span>
      <div className="city">
        <p>{city}</p>
        <span>{country}</span>
      </div>
      <div>
        <p>{temp}&deg; C</p>
        <span>{weatherType}</span>
      </div>

      <button className="closebtn" title="Remove">
        x
      </button>
    </div>
  );
}
