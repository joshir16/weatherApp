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
            <div className="mylocation_data">
              <div className="mylocation_heading">
                <h2>
                  Noida, <span>Uttar Pradesh</span>
                </h2>
                <span>IN</span>
              </div>

              <div className="current_weather">
                <p className="cur_temp">20&deg;</p>
                <div className="min_max">
                  <p>Max: 22</p>
                  <p>Min: 10</p>
                </div>
                <div className="logo">
                  <span>☀️</span>
                  <p>Clear Sky</p>
                </div>

                <div className="current_weather_cards">
                  <span>💧</span>
                  <p>
                    Humidity
                    <span>69%</span>
                  </p>
                </div>

                <div className="current_weather_cards">
                  <span>💨</span>
                  <p>
                    Wind Speed
                    <span>69%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mylocation_weather"></div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
