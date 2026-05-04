const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Backend functional");
});

app.get("/gyms", (req, res) => {
   const latitude = req.query.lat;
   const longitude = req.query.lng;

   console.log(latitude, longitude)

   res.json({latitude, longitude})
});

app.listen(PORT, ()=> {
    console.log(`server running on http://localhost:${PORT}`);
} );

