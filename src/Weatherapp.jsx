import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

const api_key = "e32b6f5b1a6240c78ec91333cb53bc90";
const Weatherapp = () => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lon: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  console.log(currentLocation);

  const lat = currentLocation.lat;
  const lon = currentLocation.lon;
  const wholedata = {};

  const fetchurl = async (lat, lon, wholedata) => {
    if (!lat || !lon) return;
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=c81acb0bcdcb4709859511fa98a7cf0f`;
    //const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`;

    let data = await axios.get(url);
    console.log("data", data);
    setWeatherData(data?.data?.data?.[0]);
    console.log("weather data", weatherData);
  };

  useEffect(() => {
    fetchurl(lat, lon);
  }, [currentLocation]);
  console.log(weatherData);

  return (
    <div className="current-city">
      Your current city : {weatherData?.city_name}
      <div>Current Temperature : {weatherData?.app_temp} &deg;C</div>
    </div>
  );
};
export default Weatherapp;
