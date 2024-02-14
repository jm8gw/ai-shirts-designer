import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import dalleRoutes from "./routes/dalle.routes.js";

dotenv.config();

const app = express();  // create an express app
app.use(cors());    // enable cors
app.use(express.json({ limig: "50mb"}));  // enable json parsing with a limit of 50mb

app.use('/api/v1/dalle', dalleRoutes);  // use the dalle routes

app.get("/", (req, res) => { // create a get request
    res.status(200).json({ message: "Hello from DALL.E!"})
});

app.listen(8080, () => { // be able to listen on specific port
    console.log("Server is running on port 8080");
});