import { useEffect, useState } from "react";
import './App.css';
import Forecast from "./forecast/Forecast.js";
import logo from './mlh-prep.png'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);

  // const [hourlyTemps, setHourlyTemps] = useState([
  //   {id: 1, min: 21, max: 32, desc: "cloudy"},
  //   {id: 2, min: 20, max: 34, desc: "cloudy"},
  //   {id: 3, min: 19, max: 30, desc: "cloudy"},
  //   {id: 4, min: 21, max: 32, desc: "cloudy"},
  //   {id: 5, min: 21, max: 32, desc: "cloudy"},
  //   {id: 6, min: 21, max: 32, desc: "cloudy"},
  //   {id: 7, min: 21, max: 32, desc: "cloudy"},
  // ]);

  useEffect(() => {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric" + "&appid=" + process.env.REACT_APP_APIKEY)
      .then(res => res.json())
      .then((result) => {
        console.log(result)
        setIsLoaded(true);
        // if(result['cod'] !== 200){
        //   console.log(result['cod']);
        //   console.log("hello shit")
        //   setIsLoaded(false)
        // }
        // else{
        console.log(result.list)
        let hourlyForecast = []
        result.list.forEach((fc) => {
          hourlyForecast.push({
            condition: fc.weather[0].description, 
            date: new Date(fc.dt * 1000),
            feels_like: fc.main.feels_like,
            temperature: {
              minimum: fc.main.temp_min,
              maximum: fc.main.temp_max, 
            }
          })
        })
        console.log(hourlyForecast)
        setIsLoaded(true);
        setResults(hourlyForecast)
        //}
      }, 
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [city])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return <>
      <img className="logo" src={logo} alt="MLH Prep Logo"></img>
      <div>
        <h2>Enter a city below 👇</h2>
        <input
          type="text"
          value={city}
          onChange={event => setCity(event.target.value)} />
        {/* <div className="Results">
          {!isLoaded && <h2>Loading...</h2>}
          {console.log(results)}
          {isLoaded && results && <>
            <h3>{results.weather[0].main}</h3>
            <p>Feels like {results.main.feels_like}°C</p>
            <i><p>{results.name}, {results.sys.country}</p></i>
          </>}
        </div> */}
        {
          <div className="Results">
            {isLoaded && results && <>
              <Forecast hourlyForecast={results}/>
            </>}
          </div>
        }
      </div>
    </>
  }
}

export default App;
