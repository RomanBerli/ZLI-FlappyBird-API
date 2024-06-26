//Author: Roman Berli
//Date: 26.6.24
//Version: 1.0
//Desc. gamelogik not working

//Loop to Start Games

const frameRate = 1; // 30 frames per second
const frameDuration = 1000 / frameRate; // 33.33 milliseconds per frame

function gameLoop() {
    const start = Date.now();

    // Your game logic here
    console.log("Frame rendered at: " + new Date().toISOString());
    //------------------- Gamelogic -----------------------//
    try{
        const allLobbys = await //getAllLobbys //is an Array

        allLobbys.forEach(lobby => {
            
            
        });


    }catch{




    } 
    //-------------------------------------------//
    const elapsed = Date.now() - start;
    const nextFrameIn = Math.max(frameDuration - elapsed, 0);

    setTimeout(gameLoop, nextFrameIn);
}

// Start the game loop
setTimeout(gameLoop, frameDuration);
