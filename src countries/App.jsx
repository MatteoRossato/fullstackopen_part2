import {useState, useEffect} from 'react'
import axios from 'axios'

//Risultati dal filtro
const Results = ({matches}) => {
    if (matches.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    if (matches.length > 1) {
      return (
        <div>
          {matches.map(c => <p key={c.name.common}>{c.name.common}</p>)}
        </div>
      )
    }
    if (matches.length === 1) {
      return <Country country={matches[0]}/>
    }

    return null
  }

//Dettaglio paese se quello che vediamo è singolo
const Country = ({country}) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>

        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>

        <img src={country.flags.png} alt={country.flags.alt} width="200"/>
        <Weather city={country.capital[0]}/>

      </div>
    )
  }

//Meteo delal capitale
const Weather = ({city}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_KEY
    axios 
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => setWeather(response.data))
  }, [city])

  if (weather === null) {
    return null
  }

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}      
      />
      <p>Wind {weather.wind.speed}</p>
    </div>
  )
}  

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  // richiesta dal server per scaricare paesei
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  //filtro 
  const matches = countries.filter(c => 
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      find countries <input value={query} onChange={e => setQuery(e.target.value)}/>
      <Results matches={matches}/>
    </div>
  )
}

export default App
