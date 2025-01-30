import { useState } from "react";
import "./App.css";
import { Favourites } from "./Favourites";
import { NavBar } from "./NavBar";

function App() {
  return (
    <>
      <NavBar />

      <main>
        <Favourites />

        <section className="mylocation">
          <h2>My Location</h2>

          <div className="mylocation_card">
            <div className="mylocation_data weather_card">
              <div className="mylocation_name">
                <h2 className="mylocation_heading">
                  Noida,{" "}
                  <span className="location_heading_state">Uttar Pradesh</span>
                </h2>
                <span className="location_heading_country">IN</span>
              </div>

              <div className="current_weather">
                <p className="cur_temp">20&deg;</p>
                <div className="min_max current_weather_detail_card">
                  <p>Max: 22</p>
                  <p>Min: 10</p>
                </div>
                <div className="logo ">
                  <span>☀️</span>
                  <p>Clear Sky</p>
                </div>

                <div className="humidity current_weather_detail_card">
                  <span>💧</span>
                  <p>
                    Humidity <span>69%</span>
                  </p>
                </div>

                <div className="wind_speed current_weather_detail_card">
                  <span>💨</span>
                  <p>
                    Wind Speed <span>69%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mylocation_weather weather_card">daily Weather</div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
