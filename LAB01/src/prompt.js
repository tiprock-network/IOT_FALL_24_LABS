import PromptSync from "prompt-sync"
import { promptMenuOptionsTxt, inpuTypeCheck } from "./utilities.js"
import colors from 'colors'
import { addRoom, displayRooms, setTemp, toggleLight, turnOffAllLights } from './rooms.js'

const prompt = PromptSync()


const promptMenuHandler = async () => {
    //try catch has been added to capture all the errors and display the errors that have been thrown
    try{   
        //display the prompt menu
        console.log(promptMenuOptionsTxt)

        //capture user input
        let choice = prompt('Enter your choice: ')
        let attempt = 0
        let attemptCount = 3

        //Check if the value entered is a number for 3 attempts
        while(!inpuTypeCheck(choice,'number') && attempt<3){
            attempt++
            choice = prompt(`Please enter a valid choice (you have ${attemptCount} attempts left): `.yellow)
            attemptCount--
            
        }

        //exit if attempts are more than 3
        if(attempt==3){
            console.log('Ending session...'.red)
            return
        }
        
        //use switch-case to select appropriate actions
        switch(parseInt(choice)){
            case 1:
                await addRoom()
                break;
            case 2:
                toggleLight()
                break;
            case 3:
                setTemp()
                break;
            case 4:
                displayRooms()
                break;
            case 5:
                turnOffAllLights()
                break;
            case 6:
                return;
            default:
                console.log('Invalid choice, please try again.\n'.red)
               
        }

        //This allows a user to decide to exit or continue performing other tasks
        let exitChoice = prompt(`Do you want to exit (Y/N)?`.yellow)
        if(exitChoice == "y" || exitChoice == "Y"){
            return
        }else if(exitChoice == "n" || exitChoice == "N"){
            //Recursion is used here to bring back the menu until user decides to exit
            promptMenuHandler()
        }else{
            return   
        }
    }catch(error){
        console.log(`Oops! Something went wrong. Error: ${error.message}`.red)
        promptMenuHandler()
    }
}

export default promptMenuHandler