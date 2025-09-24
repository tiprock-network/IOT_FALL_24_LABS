//const pool = require("../db");
import { client } from "../db.js" //our connection pool

 // Function to log temperature every 5 seconds
 const logTemperature = async (roomId) => {
        try {
            const temperature = Math.floor(Math.random() * (26 - 18 + 1)) + 18

            const timestamp = new Date()

            await client.query( "INSERT INTO temperature_logs (room_id, temperature, timestamp) VALUES($1, $2, $3)", [roomId, temperature, timestamp])
            console.log(`Logged temperature for room ${roomId}\n------------------------------------------------------`.gray)
            console.log(`Temp ( \u2103 ): ${temperature} | Created At: ${timestamp.toLocaleDateString()}`.blue)
            console.log(`------------------------------------------------------\n`.gray)
        } catch (err) {

            console.error(`Error logging temperature: ${err}`)
        }
    }

// Start logging temperature every 5 seconds
const startLogging = async () => {
    setInterval(async () => {
    const res = await client.query("SELECT id FROM rooms;")
    for (const row of res.rows) {
        logTemperature(row.id)
    }
    }, 5000)// Every 5 seconds
}

export {startLogging}