
require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;

function haversineDistance(lat1, lng1, lat2, lng2){
    const R = 6371;
    const dlat = (lat2-lat1) * Math.PI / 180;
    const dlng = (lng2-lng1) * Math.PI / 180;

    const a = 
        Math.sin (dlat/2) * Math.sin (dlat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dlng/2) * Math.sin(dlng/2);
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;



}



app.get("/", (req, res) => {
    res.send("Backend functional");
});

app.get("/gyms", async (req, res) => {
   const latitude = req.query.lat;
   const longitude = req.query.lng;

   const url = "https://places.googleapis.com/v1/places:searchNearby";

   const requestBody = {
          includedTypes: ["gym"],
          maxResultCount: 15,
          locationRestriction: {
            circle: {
                center: {
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                },
                radius: 10000,
            },
          },
   };

   const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.location",
        },
        body: JSON.stringify(requestBody),
   });

   const data = await response.json();

   const formattedGymData = data.places.map((place) => ({
    id: place.id,
    name: place.displayName?.text,
    address: place.formattedAddress,
    rating: place.rating,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    distance: haversineDistance(Number(latitude), Number(longitude), place.location.latitude, place.location.longitude)
   }));
   
   res.json(formattedGymData);

});


app.listen(PORT, ()=> {
    console.log(`server running on http://localhost:${PORT}`);
} );

