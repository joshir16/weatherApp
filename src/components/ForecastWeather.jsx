/* eslint-disable react/prop-types */
import { Loader } from "./Loader";

export function ForecastWeather({ forecastData }) {
  if (!forecastData) return <Loader />;

  return (
    <section className="forecast">
      <ul className="forecast_list weather_card">
        {forecastData.slice(1).map((dayData) => (
          <ForecastCard dayData={dayData} key={dayData.date} />
        ))}
      </ul>
    </section>
  );
}
function ForecastCard({ dayData }) {
  return (
    <div className="forecast_card">
      <p className="day_data_card date_time">
        <span>
          {`
          ${String(new Date(dayData.date).getDate()).padStart(2, "0")} 
          ${new Date(dayData.date).toLocaleString("en-US", { month: "long" })}
        `}
        </span>
      </p>
      <div className="day_data_card day_logo">
        <img
          src={`https://openweathermap.org/img/wn/${dayData.iconCode.replace(
            "n",
            "d"
          )}@2x.png`}
          alt={dayData.weather}
        />
        <h3 className="day_heading">{dayData.weather}</h3>
      </div>

      <p className="day_data_card day_max">
        Max <span>{Number(dayData.avgMaxTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_max">
        Min <span>{Number(dayData.avgMinTemp).toFixed(1)}&deg; c</span>
      </p>
      <p className="day_data_card day_wind">
        Wind <span>{Number(dayData.avgWindSpeed).toFixed(1)} m/s</span>
      </p>
      <p className="day_data_card day_humidity">
        Humidity <span>{Number(dayData.avgHumidity).toFixed(1)}%</span>
      </p>
    </div>
  );
}
