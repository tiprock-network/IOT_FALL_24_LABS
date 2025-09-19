import PromptSync from "prompt-sync"
import { generateRandTemp, generateRandomId, inpuTypeCheck } from "./utilities.js"


const prompt  = PromptSync()

let rooms_db = {}

/**
 * This function adds a room by creating a new object and adding it to the rooms database.
 */
const addRoom = async () => {
   
        try {
            const rmName = prompt('Enter room name: ')
            //add room to the json file (the json file will be our db in this case)
            const newRoom = {
                [rmName]: {
                    "id": generateRandomId(),
                    "temp": generateRandTemp(),
                    "lights": false
                }
            }

            //add room to volatile memory
            rooms_db = { ...rooms_db, ...newRoom}
            //console.log(rooms_db)
           
            console.log(`${rmName} has been added.`)

        } catch (error) {
            console.log(`Error adding room. Try again. Error: ${error.message}`.red)
        }
      
}
    

/**
 * This function toggles the light of a room by switching the states of lighting.
 */
const toggleLight = () => {
    const rmName = prompt('Enter room name to toggle light: ')
    //find room by name
    const searchResult = rooms_db[rmName]

    if(!searchResult) throw new Error(`No room with the name ${rmName} found. Please use option 4 to check for rooms added or add a new room.\n`.red)

    //if found
    if(!searchResult.lights){
        rooms_db[rmName].lights = true
        console.log(`${rmName} light is now On.`.blue)
    }else{
        rooms_db[rmName].lights = false
        console.log(`${rmName} light is now Off.`.gray)
    }

    //console.log(rooms_db)

}

/**
 * This function sets the temperature of the room, given the user prompt.
 */
const setTemp = () => {
    const rmName = prompt('Enter room name to set temperature: ')
    //set the temperature
    //find room by name
    const searchResult = rooms_db[rmName]

    if(!searchResult) throw new Error(`No room with the name ${rmName} found. Please use option 4 to check for rooms added or add a new room.\n`.red)
    //get user input -> this will be later on converted to float
    const newTemp = prompt('Enter new temperature: ')

    //if found
    //check the room temperature entered by the user and the values the user has input
    if(!inpuTypeCheck(newTemp,'number')) throw new Error(`Value entered: ${newTemp} is not a valid value, please enter a number.`)
    //check for the value of user input it should not be
    if(parseFloat(newTemp) > 68 || parseFloat(newTemp) < 8) throw new Error('Maximum room temperature is 68 degrees celsius and minimum is 8 degrees celsius.')

    rooms_db[rmName].temp = parseFloat(newTemp).toFixed(1) //to 1 decimal point
    //give message
    //Unicode value for degrees celsius (℃) is \u2103
    console.log(`${rmName} temperature is now ${newTemp}  \u2103`)
   

    //console.log(rooms_db)

}

/**
 * This function displays all available rooms and their details.
 */
const displayRooms = () => {
    if(Object.keys(rooms_db).length === 0) throw new Error('Please add rooms to switch off lights.'.red)

    for(const room in rooms_db){
        const roomDetails = rooms_db[room]

        console.log(`Room: ${room}, Light: ${roomDetails.lights?'On':'Off'}, Temperature: ${roomDetails.temp}  \u2103`)
    }
}

/**
 * This function turns off lights in all rooms in the rooms database.
 */
const turnOffAllLights = () => {
    
    if(Object.keys(rooms_db).length === 0) throw new Error('Please add rooms to switch off lights.'.red)

    for(const room in rooms_db){
        rooms_db[room].lights = false
    }

    
    console.log('All lights have been switched off.')
    console.log(rooms_db)
}

export { addRoom, toggleLight, setTemp, displayRooms, turnOffAllLights }