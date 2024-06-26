//Author: Roman Berli
//Date: 26.6.24
//Version: 1.0
//Desc. API code 

import express, { response } from "express";
import cors from "cors";
import {createSession, getAllSessions, getToken} from "./Funktion.mjs";
import {deleteOneWithFilter, countInCollection} from "./DB.mjs"
//import session from "express-session";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//-------------------  Token auth  --s-------------------//

const checkToken = async function (req, res, next){
    console.log("validation")
    try{
        let token = req.body.token
        console.log("Checking Token: "+token)
        if(1 === await countInCollection("token", { token: token })) { 
            console.log("Token valid")
            next()
        } else {            
            console.log("Token is not valid");
            return res.sendStatus(401);
        }
    } catch{            
        console.log("Token is not valid");
        return res.sendStatus(500);
    }
}
//------- Login & Logout ---------//

//Done 17.06 - 15:40
app.post("/logout", async (req, res) => {
    try{
        let {username, token} = req.body;
        console.log(username+" löscht token: "+token)
        let antwort = await deleteOneWithFilter("token", {username : username, token: token});

        if(antwort === 1){
        return res.sendStatus(204);
        }
        return res.sendStatus(400);
    }catch{
        return res.sendStatus(500);
    }
});

//Done 17.06 
app.post("/login", checkToken, async (req, res) => {
    try{
        let username = req.body.username;
        let ip = req.ip;

        if(!username){
            console.log("Post Login -400 no Username")
            return res.status(400).send("I need a username");
        } 
        else if(!typeof username === 'string' || username.length < 3 || username.length > 51){
            console.log("Post Login -400 -Not passed Validation")
            return res.status(400).send("Username does not match criteria");
        }

        console.log("passed validation");

        let token = await getToken(username, ip);
        
        console.log("Wrote into DB:\nusername: "+token.username+"\ntoken:  "+token.token);

        if(!token){
            return res.sendStatus(400);
        }

        return res.status(201).send({message: "Login successful", token: token})
    }catch{
        return res.sendStatus(500);
    }
});

//------------------------------//


//Done 17.6
app.get("/session",async (req, res) => {
    try{
        return res.status(200).send(await getAllSessions(req.body.status))
    } catch {
        return res.sendStatus(500);
    }
});

//Done 17.6 
app.post("/session", async (req, res) => {
    try{
        let {token, maxPlayer, speed, ispublic} = req.body;
        console.log("Creating new Session\n"+"Token: "+token+"\nMaxPlayer: "+maxPlayer+"\nSpeed: "+speed+"\nIspublic: "+ispublic+"\n-----------------") //To delete

        let response = await createSession(token, maxPlayer, speed, ispublic);

        if (response.status === 201){
            console.log("Create session worked");
            return res.status(201).send({message: "Session has been created!", sessionID : response.sessionID});
        } else{
            console.log("Create session didnt work -1");
            return res.sendStatus(response.status);
        }
        
    } catch {
        console.log("Create session didnt work -2");
        return res.sendStatus(500);
    }
});

//------- Join Sessions -------//

//
app.post("/join/game/:id",checkToken, async (req, res) => {
    try{
        const {token, birdcolor, } = req.body
        const gameID = req.params.id;

        let antwort = await joinSession();

        return res.send(gameID);
    } catch {
        return res.sendStatus(500);
    }
});


// This has to be at the bottom. If a request isn't processed before, it will be processed here, and a 404 status code will be sent.
app.use("/API", (req, res) => {
    res.status(404);
    res.sendFile("C:/Users/berli/02_ZLI_Workspace/FlappyBird_API/index.html");
});

app.listen(port, () => {
    console.log(
        `Example app listening on port ${port} Link--> http://localhost:${port}/`
    );
});