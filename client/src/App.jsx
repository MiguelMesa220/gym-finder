import { useState } from 'react'
import './App.css'

function App() {
  const [gyms, setGyms] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function handleSearch(){
    const response = await fetch(`http://localhost:5000/gyms?lat${latitude}}&lng=${longitude}`);
    const data = await response.json();
    setGyms(data);
    console.log("button clicked");
    console.log(data);


  }

  

  return (
    <div>
      
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
        Find Gyms
      </button>


      {gyms.map((gym) => (
        <div key ={gym.id}>
          <h2>
            {gym.name}
          </h2>
          <p>
            {gym.address}
          </p>
          <p>
            {gym.rating} stars
          </p>
        </div>
      ))}
    </div>

  )
}

export default App
