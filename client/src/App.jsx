import { useState } from 'react'
import GymCard from "./components/GymCard";
import './App.css'

function App() {
  const [gyms, setGyms] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function handleSearch(){
    console.log("frontend latitude:", latitude);
    console.log("frontend longitude:", longitude);
    const response = await fetch(`http://localhost:5000/gyms?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    setGyms(data);
    console.log("button clicked");
    console.log(data);


  }

  function handleUseMyLocation(){
    navigator.geolocation.getCurrentPosition((position)=>{
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    })
  }

  

  return (
    <div className="app">

      <div className="search-bar">
        <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(lat)=> setLatitude(lat.target.value)}
      />

      <input
        type="text"
        placeholder="Longitude"
        value={longitude}
        onChange={(lng)=> setLongitude(lng.target.value)}
      />

      <button onClick = {handleSearch}>
        Find With Coordinates
      </button>
      </div>

      <button
        className="location-button" 
        onClick = {handleUseMyLocation}>
        Use My Location
      </button>

      {gyms.map((gym) => (
      <GymCard key ={gym.id} gym={gym}/>
      ))}

    </div>
    
      
      
  )
}

export default App
