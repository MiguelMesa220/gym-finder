
require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;





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
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating",
        },
        body: JSON.stringify(requestBody),
   });

   const data = await response.json();

   const formattedGymData = data.places.map((place) => ({
    id: place.id,
    name: place.displayName?.text,
    address: place.formattedAddress,
    rating: place.rating
   }));
   
   res.json(formattedGymData);

});


app.listen(PORT, ()=> {
    console.log(`server running on http://localhost:${PORT}`);
} );

