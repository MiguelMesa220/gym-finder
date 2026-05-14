import "./GymCard.css"
function GymCard({gym}) {
    
    return (
    <div className="gym-card">
      <div key ={gym.id}>
      <h2>{gym.name}</h2>
      <p>{gym.address}</p>
      <p>{gym.rating} stars</p>
    </div>


    </div>
    
    )
}

export default GymCard