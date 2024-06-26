//Author: Roman Berli
//Date: 26.6.24
//Version: 1.0
//Desc. Test API

import express from "express";
import cors from "cors";
//import session from "express-session";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
let games = [{
    id: 1,
    ispublic : true,
    maxplayer: 12,
    speed: 80

}];
let id = 1;

app.post("/lobby", (req, res) => {
    console.log(req.body);
    id++;  
    games.push( {
        id: id,
        ispublic : req.body.ispublic,
        maxplayer: req.body.maxplayer,
        speed: req.body.speed

    });
    console.log(games)
    res.status(201).send({msg: "worked", id: id})
});

app.get("/lobby", (req, res) => {
    console.log("Getting Games")
    console.log(games)
    res.status(201).send(games)
});

app.listen(port, () => {
    console.log(
        `Example app listening on port ${port} Link--> http://localhost:${port}/`
    );
});