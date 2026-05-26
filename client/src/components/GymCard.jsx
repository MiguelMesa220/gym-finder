import "./GymCard.css"
function GymCard({gym}) {
    
    return (
    <div className="gym-card">
      <div key ={gym.id}>
      <h2>{gym.name}</h2>
      <p>{gym.address}</p>
      <p>{gym.rating} stars</p>
      <p>{gym.distance.toFixed(2)} km away</p>
      <p>{Math.round(parseInt(gym.driveDuration)/60)} min drive</p>
      <p>{Math.round(parseInt(gym.transitDuration)/60)} min via transit</p>
    </div>


    </div>
    
    )
}

export default GymCard