export {countInCollection, writeSession, findAll, writeToken, deleteOneWithFilter};

//Connect to DB
import { MongoClient } from "mongodb";

//---: Connect to DB :---//
const url = "mongodb://127.0.0.1:27017/"; //Database url
const dbName = "FlappyBird"; // Database Name
const client = new MongoClient(url); // Connection URL
await client.connect(); // Use connect method to connect to the server
const db = client.db(dbName);

console.log("<-- Connected successfully to DB -->");
//---: ------------ : ---//


//Basic Functions
async function findAll(collection,filter){
   try{
    if(filter == null){
      filter = {};
    }
    return await db.collection(collection).find(filter, { projection: { _id: 0 } }).toArray()
  } catch {
    return null
  }
}

async function countInCollection(collection, filter){
  try{
    return await db.collection(collection).countDocuments(filter)
  } catch{
    return -1;
  }
}

async function writeSession(token, maxPlayer, speed, ispublic) {
  console.log(token +" is creating a Session\n------------")

  try{
      console.log("Getting GameID");
      let gameID = await db.collection("sessions").findOne({},{ sort: { sessionId: -1 }});
      console.log("Got gameID");
      if(gameID == null){
        gameID = 1000;
      }else{
        gameID = gameID.sessionId + 1;
      }
      
      console.log("GameID is "+gameID+"\nWriting into DB");

      console.log(await db.collection("sessions").insertOne({sessionId: gameID, maxPlayer: maxPlayer, speed: speed, ispublic: ispublic, status: "lobby", players: {player1: token}, owner : token}));
      return{id : gameID}
  } catch {
      return {status: 500}
  }
}

async function writeToken(username, token, ip){
  try{
    console.log("writing into DB for token")
    let res = await db.collection("token").insertOne({token: token, username: username, ip : ip});
    if(res.acknowledged){
      return true;
    } else{
      return false;
    }
  }catch{
    return false
  }
}

async function deleteOneWithFilter(collection, filter){
  try{
    console.log(filter)
    let res = await db.collection(collection).deleteOne(filter);
    console.log(res)
    return res.deletedCount
  }catch{
    return false
  }
}


function closeConnection() {
  client.close();
}