import { constants } from 'fs'
import { access, mkdir } from 'fs/promises'
/**
 * This function returns a random temperature in degrees celsius between 0 and 50.
 * @returns {number}
 * @example const temp =  generateRandTemp()
 */
const generateRandTemp = () => Math.floor(Math.random()*50)

//this function generates a random id for the rooms
const generateRandomId = () => (Math.round(Date.now() * Math.floor(Math.random()*1334))).toString().slice(0,4)

//prompt menu text
const promptMenuOptionsTxt = `
        Smart Room Setup Assistant\n
        1. Add a Room\n
        2. Toggle Light\n
        3. Set Temperature\n
        4. Display Rooms\n
        5. Turn Off All Lights\n
        6. Exit\n
        `

/**
 * This function checks for the correct value type of a given value in the function and returns true statement if correct type is used.
 * @param {any} value 
 * @param {any} varType 
 * @returns {boolean} true | false
 * @example const textCheck = inputTypeCheck(45,'number')
 */
const inpuTypeCheck = (value, varType) => {
    //if the value type is correct then a true result is returned
    switch(varType){
        case 'number': //check for a number value
            let val = parseFloat(value)
            if (typeof val !== varType) return false
            if (varType === 'number' && isNaN(val)) return false
            return true
        case 'string': //check for a string value
            if (typeof value !== varType) return false
            if (varType === 'number' && isNaN(value)) return false
            return true
        default:
            return false

    }
    
}


export { generateRandTemp, generateRandomId, promptMenuOptionsTxt, inpuTypeCheck }