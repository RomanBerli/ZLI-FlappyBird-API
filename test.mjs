const url = "mongodb://127.0.0.1:27017/"; //Database url
const dbName = "FlappyBird"; // Database Name
const client = new MongoClient(url); // Connection URL
client.connect(); // Use connect method to connect to the server
const db = client.db(dbName);
console.log("<-- Connected successfully to DB -->");

function addGravity(id) {
    let element = db.collection("games").find({id : id}, { projection: { _id: 0 } }).toArray()
    
}
