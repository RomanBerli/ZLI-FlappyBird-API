import {countInCollection, writeSession, findAll, writeToken} from "./DB.mjs"
export {createSession, getAllSessions, getToken};


//-------------------  API Functions  ---------------------//

async function getAllSessions(status){
    try{
        let allSessions;
        if(status){
            allSessions = await findAll("sessions", {status : status})
        } else {
            allSessions = await findAll("sessions")
        }

        return allSessions;
    }catch{
        return ["no session"]
    }
}


async function createSession(token, maxPlayer, speed, ispublic){
    try{
        //validate
        if (!Number.isInteger(maxPlayer) || maxPlayer < 2 || maxPlayer > 20 ||!Number.isInteger(speed) || speed < 1 || speed > 100 || typeof ispublic !== 'boolean') {
            console.log("Data is not valid");
            return { status: 400 };
        }

        console.log("Data is valid");

        let sessionData = await writeSession(token, maxPlayer, speed, ispublic);

        if(sessionData.status){
            return {status : 500};
        }

        console.log("Session is now in DB")

        return {status: 201, sessionID: sessionData.id}
    }catch{
        return {status : 500};
    }
}

async function getToken(username, ip){
    try{
        //Generate Token
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = "";

        do {
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                token += characters[randomIndex];
              }
        } while (await findAll({token}).length > 0);
        
        //Token speichern
        if(await writeToken(username, token, ip)){
            return {username: username, token: token};
        }

        return
    }catch{
        return
    }
}