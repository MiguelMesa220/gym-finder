import { useState } from 'react'
import GymCard from "./components/GymCard";
import './App.css'

function App() {
  const [gyms, setGyms] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const[sortMode, setSortMode] = useState("drive");

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

  const sortedGyms = [...gyms].sort((a,b)=>{
    if (sortMode ==="drive") {
      return parseInt(a.driveDuration) - parseInt(b.driveDuration);
    }
    if (sortMode ==="transit") {
      return parseInt(a.transitDuration) - parseInt(b.transitDuration);
    }
    if (sortMode ==="distance") {
      return parseInt(a.distance) - parseInt(b.distance);
    } 
    if (sortMode ==="rating") {
      return parseInt(b.rating) - parseInt(a.rating);
    } 
    return 0; 
  });

  return (
    <div className="app">
      <h1>FIND YOUR GYM</h1>
      <p className="subtitle">
        DISCOVER TOP GYMS NEAR YOU
      </p>

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

      <select value={sortMode} onChange={(e)=> setSortMode(e.target.value)}>
        <option value="drive">Drive Time</option>
        <option value="transit">Transit Time</option>
        <option value="distance">Distance</option>
        <option value="rating">Rating</option>
      </select>

      {sortedGyms.map((gym) => (
      <GymCard key ={gym.id} gym={gym}/>
      ))}

    </div>
    
      
      
  )
}

export default App
