import { useState } from 'react'
import './App.css'

function App() {
  const [gyms, setGyms] = useState([]);

  async function handleSearch(){
    const response = await fetch("http://localhost:5000/gyms?lat=43&lng=-79");
    const data = await response.json();
    setGyms(data);
    console.log("button clicked");
    console.log(data);
  }

  

  return (
    <div>
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
