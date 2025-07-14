import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import cities from "./cities";
import axios from "axios";
import {
  weeks,
  option,
  hours,
  citycardclass,
  inputcardclass,
} from "./constants";
import SwitchLabels from "./Toggle";

export default function CityCardComponent(cityprop) {
  console.log("city prop", cityprop);
  //const { city, cityCard, setCityCard, handleDelete } = city;
  // const [cityCard, setCityCard] = useState([]);
  const [isCriteriaButton, setIsCriteriaButton] = useState("Criteria");
  const [toggleCriteria, setToggleCriteria] = useState(false);
  const [isTime, setIsTime] = useState("select");
  const [toggleTime, setToggleTime] = useState(false);
  const [allToggle, setAllToggle] = useState(false);
  const [citycardToggle, setCitycardToggle] = useState(false);

  async function handleSelectCriteri(hours, city) {
    setToggleTime(!toggleTime);
    if (isCriteriaButton === "Today") {
      let today = new Date();
      let formattedDate = today.toISOString().split("T")[0];

      let time = "T";
      const current = formattedDate + time + hours;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m`;

      const cityData = await axios.get(url);
      const timeData = cityData.data.hourly.time;
      const indexOfTime = timeData.indexOf(current);
      const newTemp = cityData.data.hourly.temperature_2m[indexOfTime];

      const newArr = cityprop.cityCard.map((City) => {
        if (City.city_name === city.city_name) {
          return { ...City, app_temp: newTemp };
        } else {
          return City;
        }
      });

      cityprop.setCityCard(newArr);
    }
  }

  function toggleData(Toggle, city) {
    if (Toggle) {
      const newArr = cityprop.cityCard.map((City) => {
        if (City.city_name === city.city_name) {
          return { ...City, toggle: Toggle };
        } else {
          return City;
        }
      });

      cityprop.setCityCard(newArr);
    } else {
      const newArr = cityprop.cityCard.map((City) => {
        if (City.city_name === city.city_name) {
          return { ...City, toggle: false };
        } else {
          return City;
        }
      });

      cityprop.setCityCard(newArr);
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
  }
  useEffect(
    () => console.log("useEffect", isCriteriaButton),
    [isCriteriaButton]
  );
  function handleTime() {
    setToggleTime(!toggleTime);
  }

  return (
    <div className="percity" key={cityprop.city.city_name}>
      <span className="cityname">City : {cityprop.city.city_name}</span>
      <span className="citytemp">Temp : {cityprop.city.app_temp} &deg;C </span>
      <button
        className="delete-button"
        onClick={() => cityprop.handleDelete(cityprop.city.city_name)}
      >
        ❌
      </button>
      <div className="citytoggle">
        <SwitchLabels
          city={cityprop.city}
          toggleData={toggleData}
          Toggle={citycardToggle}
          setToggle={setCitycardToggle}
        />
        {cityprop.city.toggle && (
          <div className="undercitycard">
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
                (isCriteriaButton === "Today" ||
                  isCriteriaButton === "Tomorrow") && (
                  <ul className="time">
                    {hours.map((hour, index) => (
                      <li
                        onClick={() => handleSelectCriteri(hour, cityprop.city)}
                        key={index}
                      >
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
          </div>
        )}
      </div>
    </div>
  );
}
