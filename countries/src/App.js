import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [ showCountry, setShowCountry ] = useState(false)
  return (
    <div>
      {country.name}
      <button onClick={() => setShowCountry(!showCountry)}>
        {showCountry ? 'hide' : 'show'}
      </button>
      {showCountry
        ? <DetailedCountry 
          name={country.name}
          capital={country.capital}
          population={country.population}
          languages={country.languages}
          flag={country.flag}
         />
        : ''}
    </div>
  )
}

const Language = ({ language }) => {
  return (
    <li>{language.name}</li>
  )
}

const DetailedCountry = ({ name, capital, population, languages, flag }) => {
  const altTextFlag = `Flag of ${name}`
  return (
    <div>
      <h2>{name}</h2>
      <p>
        capital {capital} <br></br>
        population {population}
      </p>

      <h3>languages</h3>
      <ul>
        {languages.map(language =>
          <Language key={language.name} language={language} />)}
      </ul>

      <img src={flag} alt={altTextFlag} />
    </div>
  )
}

const Display = ({ countriesToShow, length }) => {
  if (length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (length > 1) {
    return (
      <div>
        {countriesToShow.map(country => 
        <Country key={country.name} country={country}/>
        ) }
      </div>
    )
  } else if (length > 0) {
    return (
      <div>
        {/*know that only 1 country left*/}
        <DetailedCountry 
          name={countriesToShow[0].name}
          capital={countriesToShow[0].capital}
          population={countriesToShow[0].population}
          languages={countriesToShow[0].languages}
          flag={countriesToShow[0].flag}
        />
      </div>
    )
  } else {
    return (
      <div>No matches, specify another filter</div>
    )
  }
}

const Filter = ({ searchTerm, handleFilteredSearch }) => {
  return (
    <div>
      find countries <input value={searchTerm} onChange={handleFilteredSearch} />
    </div>
  )
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ searchTerm, setSearchTerm ] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
    })
  }, [])

  const handleFilteredSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const countriesToShow = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <Filter searchTerm={searchTerm} 
      handleFilteredSearch={handleFilteredSearch} />

      <Display countriesToShow={countriesToShow} length={countriesToShow.length} />
    </div>
  )
}

export default App;