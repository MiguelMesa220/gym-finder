
require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;

function getGymCategory(name){
    const lowerName = name.toLowerCase();

    if (
        lowerName.includes("goodlife") || 
        lowerName.includes("fit4less") ||
        lowerName.includes("lifetime") ||
        lowerName.includes("anytime fitness") || 
        lowerName.includes("planet fitness") || 
        lowerName.includes("la fitness") || 
        lowerName.includes("crunch") || 
        lowerName.includes("movati")
    ){
        return "Commercial Gym";
    }
    if (
        lowerName.includes("crossfit")
    ){
        return "Crossfit";
    }
    if(
        lowerName.includes("yoga") || lowerName.includes("pilates")
    ){
        return "Yoga/Pilates";
    }
    if (
        lowerName.includes("karate") ||
        lowerName.includes("jiu") || 
        lowerName.includes("martial") ||
        lowerName.includes("mma") ||
        lowerName.includes("boxing") || 
        lowerName.includes("taekwondo") ||
        lowerName.includes("judo") ||
        lowerName.includes("kickboxing") || 
        lowerName.includes("fighting")

    ){
        return "Martial Arts";
    }
     if (
        lowerName.includes("boulderz") ||
        lowerName.includes("rock") ||
        lowerName.includes("peak") || 
        lowerName.includes("bloc") ||
        lowerName.includes("climbing") ||
        lowerName.includes("boulders") ||
        lowerName.includes("rocks")
    ){
        return "Climbing";
    }
    return "Other";
    

}

async function getTravelTime(selfLat, selfLng, gymLat, gymLng, travelMode){
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes",{
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
        },

        body: JSON.stringify({
            origin: {
                location: {
                    latLng: {
                        latitude:selfLat,
                        longitude:selfLng

                    }
                }
            },
            destination: {
                location: {
                    latLng: {
                        latitude: gymLat,
                        longitude: gymLng
        }
      }
    },

    travelMode: travelMode
         })
        }
    );
    const data = await response.json();

    return data.routes[0];

}



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

   if(!latitude || !longitude){
    return res.status(400).json({error: "Couldn't Retrieve Latitude/Longitude"});
   }

   try{
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

   if(!response.ok) {
    return res.status(500).json({error: "Places API Request Failed"});
   }

   const data = await response.json();

   if(!data.places || data.places.length == 0){
    return res.status(404).json({error: "No Gyms Found"});
   }

   const route = await getTravelTime(
    Number(latitude),
    Number(longitude),
    43.6532,
    -79.3832
   );
   console.log(route);

   const formattedGymData = await Promise.all(
    data.places.map(async(place)=> {
        const driveRoute = await getTravelTime(
            Number(latitude),
            Number (longitude),

            place.location.latitude,
            place.location.longitude,
            "DRIVE"
        );
        const transitRoute = await getTravelTime(
            Number(latitude),
            Number (longitude),

            place.location.latitude,
            place.location.longitude,
            "TRANSIT"
        );

        return {
            id: place.id,
            name: place.displayName?.text,
            address: place.formattedAddress,
            rating: place.rating,
            category:getGymCategory(place.displayName?.text || ""),
            latitude: place.location.latitude,
            longitude: place.location.longitude,

            distance: haversineDistance(
                Number(latitude),
                Number(longitude),
                place.location.latitude,
                place.location.longitude
            ),

            driveDuration: driveRoute.duration,
            driveDistanceMeters: driveRoute.distanceMeters,

            transitDuration: transitRoute.duration,
            transitDistanceMeters: transitRoute.distanceMeters

         };

        })
        
    );
    res.json(formattedGymData);
   }
   catch(error){
    return res.status(500).json({error: "Internal Server Error"});
   }

}

);

app.get("/geocode", async(req,res)=>{
    const address = req.query.address;

    if (!address){
        return res.status(400).json({ error:"Missing Address"});
    }

    try{
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

        const response = await fetch(url);

        if(!response.ok){
            return res.status(500).json({error: "Google Geocoding API Request Failed"});
        }

        const data = await response.json();

        if(!data.results || data.results.length == 0){
            return res.status(404).json({error: "No Address Found"});
        }

        const location = data.results[0].geometry.location;

        res.json({
            latitude: location.lat,
            longitude: location.lng,
        });
    }
    catch (error){
        return res.status(500).json({error: "Internal Server Error"});

    }
});

app.get("/reverse-geocode", async(req,res) => {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const location = data.results[0].formatted_address;

    res.json({address: location});
});

app.get("/autocomplete", async (req, res)=>{
    const input = req.query.input;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const suggestions = data.predictions.map((prediction)=> ({
        description: prediction.description,
        placeID: prediction.place_id,
    }));
    res.json(suggestions);
});

app.listen(PORT, ()=> {
    console.log(`server running on http://localhost:${PORT}`);
})