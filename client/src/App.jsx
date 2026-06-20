import { useState } from 'react'
import GymCard from "./components/GymCard";
import './App.css'

function App() {
  const [gyms, setGyms] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [sortMode, setSortMode] = useState("drive");
  const [commercialOnly, setCommercialOnly] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const [address, setAddress] = useState("");

  async function handleSearch(){
    const geoResponse = await fetch(`http://localhost:5000/geocode?address=${encodeURIComponent(address)}`);
    const geoData = await geoResponse.json();

    const response = await fetch(`http://localhost:5000/gyms?lat=${geoData.latitude}&lng=${geoData.longitude}`);
    const data = await response.json();
    setGyms(data);


  }

  async function handleAddressChange(e){
    const value = e.target.value;
    setAddress(value);

    if (value.length < 3){
      setSuggestions([]);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/autocomplete?input=${encodeURIComponent(value)}`
    );

    const data = await response.json();
    setSuggestions(data);

  }

  function handleUseMyLocation(){
    navigator.geolocation.getCurrentPosition(async (position)=>{
      const lat= position.coords.latitude;
      const lng= position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      const response = await fetch(`http://localhost:5000/reverse-geocode?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      setAddress(data.address);
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

  const filteredGyms = commercialOnly? sortedGyms.filter((gym)=>gym.category === "Commercial Gym"): sortedGyms;

  return (
    <div className="app">
      <h1>FIND YOUR GYM</h1>
      <p className="subtitle">
        DISCOVER TOP GYMS NEAR YOU
      </p>

      <div className="search-bar">
        <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter address"
        />
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion)=>( 
              <div
                className="suggestion-item" 
                key={suggestion.placeId}
                onClick={()=>{
                  setAddress(suggestion.description);
                  setSuggestions([]);
              }}>
                {suggestion.description}
              </div>
            ))}
            </div>
        )}
      <button onClick = {handleSearch}>
        Search
      </button>
      </div>

      <button
        className="location-button" 
        onClick = {handleUseMyLocation}>
        Use My Location
      </button>

      <div className="checkerbox">
        <label>Commercial Gyms Only</label>
        
        <input
        type="checkbox"
        checked={commercialOnly}
        onChange={(e)=>setCommercialOnly(e.target.checked)}
        style={{width: '20px'}}
        />
      </div>

      <select value={sortMode} onChange={(e)=> setSortMode(e.target.value)}>
        <option value="drive">Drive Time</option>
        <option value="transit">Transit Time</option>
        <option value="distance">Distance</option>
        <option value="rating">Rating</option>
      </select>

      {filteredGyms.map((gym) => (
      <GymCard key ={gym.id} gym={gym}/>
      ))}

    </div>
    
      
      
  )
}

export default App
