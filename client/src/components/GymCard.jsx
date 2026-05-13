function GymCard({gym}) {
    
    return (
    
    <div key ={gym.id}>
      <h2>{gym.name}</h2>
      <p>{gym.address}</p>
      <p>{gym.rating} stars</p>
    </div>
    )
}

export default GymCard