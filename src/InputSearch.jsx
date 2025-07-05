import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import cities from "./cities";
import axios from "axios";
import { weeks, option, hours } from "./constants";

const InputSearch = () => {
  const [cityname, setcityname] = useState("");
  const [searchCity, setSearchCity] = useState([]);
  const [cityCard, setCityCard] = useState([]);
  const [isCriteriaButton, setIsCriteriaButton] = useState("Criteria");
  const [toggleCriteria, setToggleCriteria] = useState(false);
  const [isTime, setIsTime] = useState("select");
  const [toggleTime, setToggleTime] = useState(false);
  const [criteriaSelect, setCriteriaSelect] = useState(false);

  console.log(weeks);
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId); // Clear any existing timeout
      timeoutId = setTimeout(() => func(...args), delay); // Set new timeout
    };
  }

  async function handleSelectCriteria(parameter) {
    setToggleTime(!toggleTime);
    if (isCriteriaButton === "Today") {
      let today = new Date();
      let formattedDate = today.toISOString().split("T")[0];
      console.log(formattedDate, parameter);
      let time = "T";
      const current = formattedDate + time + parameter;

      const newData = await Promise.all(
        cityCard.map(async (city) => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m`;

          const cityData = await axios.get(url);
          const timeData = cityData.data.hourly.time;
          const indexOfTime = timeData.indexOf(current);
          const newTemp = cityData.data.hourly.temperature_2m[indexOfTime];

          return { ...city, app_temp: newTemp };
        })
      );

      console.log(newData);
      setCityCard(newData);
    }
  }

  function handleToggleCriteria() {
    setToggleCriteria(!toggleCriteria);
    setToggleTime(false);
    setIsCriteriaButton("Criteria");
  }

  function handleListCriteria(option) {
    setIsCriteriaButton(option);
    setToggleCriteria(!toggleCriteria);
    setToggleTime(false);
    console.log(isCriteriaButton);
  }
  useEffect(() => console.log(isCriteriaButton), [isCriteriaButton]);
  function handleTime() {
    setToggleTime(!toggleTime);
  }

  async function handlecityclick(city) {
    const lat = city.latitude;
    const lon = city.longitude;
    console.log(lat, lon);
    const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=c81acb0bcdcb4709859511fa98a7cf0f`;

    const cityclick = await axios.get(url);
    //console.log(cityclick.data?.data?.[0]);
    const citycheck = cityclick.data?.data?.[0];
    if (!cityCard.some((item) => item.city_name === citycheck.city_name)) {
      setCityCard((cityCard) => [...cityCard, cityclick.data?.data?.[0]]);
    }

    //console.log(cityCard);
    setSearchCity([]);
    setcityname("");
  }
  function handleDelete(index) {
    const filteredcard = cityCard.filter((city) => city.city_name !== index);
    setCityCard(filteredcard);
  }
  useEffect(() => {
    console.log(cityCard);
  }, [cityCard]);

  function setCity(inputvalue) {
    const filteredcities = cities.filter((city) =>
      city.city.toLowerCase().includes(inputvalue.toLowerCase())
    );
    console.log(filteredcities);
    setSearchCity(filteredcities);
    //}
  }
  const debounceinput = useCallback(debounce(setCity, 1500), []);

  useEffect(() => {
    if (cityname) {
      debounceinput(cityname);
    } else {
      setSearchCity([]);
    }
  }, [cityname]);
  return (
    <div className="parentinput">
      <div className="input">
        Search for any city :
        <input
          className="inputfield"
          type="text"
          placeholder="city name"
          value={cityname}
          onChange={(e) => setcityname(e.target.value)}
        />
        <div>
          select criteria :{" "}
          <button onClick={() => handleToggleCriteria()}>
            {isCriteriaButton}
          </button>
          {isCriteriaButton !== "Criteria" && (
            <button className="criteria" onClick={() => handleTime()}>
              {isTime}
            </button>
          )}
        </div>
      </div>
      <div>
        {toggleCriteria && (
          <ul className="timetype">
            {option.map((option, index) => (
              <li key={index} onClick={() => handleListCriteria(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}

        {toggleTime &&
          (isCriteriaButton === "Today" || isCriteriaButton === "Tomorrow") && (
            <ul className="time">
              {hours.map((hour, index) => (
                <li onClick={() => handleSelectCriteria(hour)} key={index}>
                  {hour}
                </li>
              ))}
            </ul>
          )}
        {toggleTime && isCriteriaButton === "Weekly" && (
          <ul>
            {weeks.map((week, index) => (
              <li key={index}>{week}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {searchCity.length > 0 && (
          <ul className="list">
            {searchCity.map((city, index) => (
              <li key={index} onClick={() => handlecityclick(city)}>
                {city.city}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <div className="citycard">
          {cityCard.map((city) => (
            <div className="percity" key={city.city_name}>
              <span>City : {city.city_name}</span>
              <span>Temp : {city.app_temp} &deg;C </span>
              <button
                className="delete-button"
                onClick={() => handleDelete(city.city_name)}
              >
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputSearch;
