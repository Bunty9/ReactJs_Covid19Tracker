import './App.css';
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';


function App() {
 
  const [countries, setcoutries ] = useState([])
  const [country , setCountry] = useState('worldwide')
  const [countryInfo , setCountryInfo] = useState({});
 
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response)=> response.json())
    .then((data)=>{
      setCountryInfo(data)
    })
  },[])
  useEffect(()=>{
      const getCountriesData = async()=>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response)=> response.json())
        .then((data)=> { const countries = data.map((country)=>(
          {
          name:country.country,
          value:country.countryInfo.iso2
          }
        ))
        setcoutries(countries)
        },
      );
      }
      getCountriesData()
  },[]);
 
 const onCountryChange = async (event) =>{
   const contryCode = event.target.value;
   setCountry(contryCode);

   const url = 
   country === "worldwide"
   ?"https://disease.sh/v3/covid-19/all"
   :`https://disease.sh/v3/covid-19/countries/${contryCode}`

   await fetch(url)
   .then((response)=> response.json())
   .then((data)=>{
     setCountry(contryCode);
     setCountryInfo(data)
   })
 }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header"> 
                <h1>COVID-19 TRACKER</h1>
                <FormControl className="app__dropdown">
                  <Select variant='outlined' value={country}  onChange = {onCountryChange}>
                    <MenuItem value="worldwide">Wordlwide</MenuItem>
                    {countries.map((country)=>(
                      <MenuItem value={country.value} >{country.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
              </div>

              <div className= "app__stats">
                  <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}  />
                  <InfoBox title="Recoveries" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
                  <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>


                  
              </div>
              <Map/>
      </div>
      <div className="app__right">

      </div>
    </div>
  );
}

export default App;
 