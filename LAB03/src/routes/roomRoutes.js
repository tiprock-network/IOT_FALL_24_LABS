import express from 'express'
import 'dotenv/config'
//import the client from postgres
import { client } from '../db.js'
//here we create the routing instance
const roomRoute = express.Router()

//@POST: CREATE Room
//Creates a new room with the specified name.
//implementing creation of a room, this involves inserting to the database
roomRoute.post('/rooms', async(req,res) => {
    //let's check the body for correct content
    const { rmName } = req.body

    //check for query
    const { limit } = req.query

    //check if consumer of this API entered the room name
    if(!rmName) return res.status(400).json(
        {
            message: "No room name was sent."
        }
    )

    try {
        let lim = limit ? limit : 1000000000;

        const qry = `WITH room_count AS (SELECT COUNT(*) AS cnt FROM rooms) INSERT INTO rooms(name) SELECT $1 FROM room_count WHERE cnt < $2 RETURNING *; `;

        const result = await client.query(qry, [rmName, lim])

        if (result.rows.length === 0) {
            return res.status(400).json({ message: `Maximum of ${lim} rooms allowed.` })
        }

        return res.status(201).json({ room: result.rows[0] })


        const baseUrl = process.env.BASE_URL.replace(/\/+$/, '');
        const location = `${baseUrl}/api/rooms/${result.rows[0].id}`;

        

        //if operation is successful then we return status code 201 Created
        return res.status(201).json({
            message: "New room created.",
            location: location,
        })
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)

        if(error.code = 23505) return res.status(400).json({
            message: "This room has already been added."
        })

        if(error.code = 23503) return res.status(400).json({
            message: "This room has already been added."
        })

        if(error.code = 23502) return res.status(400).json({
            message: "This field does not accept null values."
        })

        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})


//@GET: RETRIEVE All Rooms
//Retrieves a list of all rooms.
roomRoute.get('/rooms', async (req,res) => {
   
    try {
        //Implement Code for database here
        const qry = "SELECT DISTINCT ON (r.id) r.id AS id, r.name AS name, r.light AS light, t.temperature, t.timestamp FROM rooms r JOIN temperature_logs t ON r.id = t.room_id ORDER BY r.id, t.timestamp DESC;"
        const result = await client.query(qry)
        //if operation is successful then we return status code 200 OK
        return res.status(200).json({
           rooms: result.rows
        })
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})

//@GET: RETRIEVE Avg Rooms Temp
//Retrieves average temp. of all rooms.
roomRoute.get('/rooms/average-temperature', async (req,res) => {
   
    try {
        //Implement Code for database here
        const qry  = "SELECT AVG(temperature) AS average_temperature FROM temperature_logs;"
        const result = await client.query(qry)
        //if operation is successful then we return status code 200 OK
        const avgTemp = result.rows[0].average_temperature;
        const safeTemp = avgTemp && avgTemp > 0 ? parseFloat(avgTemp).toFixed(2) : 0.00;
        return res.status(200).json({
            average_temperature: safeTemp
        })
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})

//@GET: RETRIEVE All Temp Values
//Retrieves temp. of all rooms.
roomRoute.get('/rooms/temperature_logs', async (req,res) => {
   const { limit } = req.query
   
    try {
        //Implement Code for database here
        let lim = limit ? limit : 100;
        const qry = `SELECT room_id, temperature AS value, timestamp AS time FROM temperature_logs ORDER BY timestamp DESC LIMIT ${lim};`;

        const result = await client.query(qry)
        //if operation is successful then we return status code 200 OK
        const temps = result.rows;
        if(result.rowCount > 0){
                return res.status(200).json({temps})
        }else{
            return res.status(200).json({
            val: 0,
            date: null
        })
        }
        
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})



//@GET: RETRIEVE A Room
//Retrieves details of a room by its ID.
roomRoute.get('/rooms/:id', async (req,res) => {

    const { id } = req.params
    
    //check if the path contains the ID
    if(!id) return res.status(400).json({
        message: "Bad Request. No specific Id included."
    })
   
    try {
        //Implement Code for database here
        const qry = "SELECT r.id AS room_id, r.name AS room_name, t.temperature, t.timestamp FROM rooms r JOIN temperature_logs t ON r.id = t.room_id WHERE r.id = $1 ORDER BY t.timestamp DESC LIMIT 1;"

        const result = await client.query(qry, [id])

        //check if we do not return an empty value (if room was not found)
        if(result.rows.length<1) return res.status(404).json({
            message: `Room with ID, ${id} could not be found.`
        })

        //if operation is successful then we return status code 200 OK
        return res.status(200).json(
            result.rows[0]
        )
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.',
            error: error
        })
    }
})

//@GET: RETRIEVE A Room's Current Temperature
//Retrieves details of a room's temperature.
roomRoute.get('/rooms/temperature/:id', async (req,res) => {

    const { id } = req.params
    
    //check if the path contains the ID
    if(!id) return res.status(400).json({
        message: "Bad Request. No specific Id included."
    })
   
    try {
        //Implement Code for database here
        const qry  = "SELECT temperature FROM temperature_logs WHERE room_id = $1 ORDER BY timestamp DESC LIMIT 1;"
        const result = await client.query(qry,[id])

        //check if we do not return an empty value (if room was not found)
        if(result.rows.length<1) return res.status(404).json({
            message: `Room with ID, ${id} could not be found.`
        })

        //if operation is successful then we return status code 200 OK
        return res.status(200).json(
            result.rows[0]
        )
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})


//@PATCH: Update Room
//Updates the light status (on/off) of a room
roomRoute.patch('/rooms/:id/light', async(req,res) => {
    //let's check the body for correct content
    const { id } = req.params
    const { lightStatus } = req.body

    //check if the path contains the ID
    if(!id || !lightStatus) return res.status(400).json({
        message: "Bad Request. No specific Id or light status included."
    })

    

    try {
       
        const qry  = "UPDATE rooms SET light = $1 WHERE id = $2 RETURNING *;"
        const result = await client.query(qry,[lightStatus=="on"?false:true,id])

        //check if we do not return an empty value (if room was not found)
        if(result.rows.length<1) return res.status(404).json({
            message: `Room was not found.`,
        })

        //if operation is successful then we return status code 204 No Content
        return res.status(204).json({})
    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})

//@DELETE: Deleter Room by Id
//Deletes a room by its ID.
roomRoute.delete('/rooms/:id', async (req,res) => {
    //let's check the body for correct content
    const { id } = req.params
    
    //check if the path contains the ID
    if(!id) return res.status(400).json({
        message: "Bad Request. No specific Id or light status included."
    })
   
    try {
        //Implement Code for database here
        const qry  = "DELETE FROM rooms WHERE id = $1 RETURNING *;"
        const result = await client.query(qry,[id])

        //check for rooms returned if any
        if(result.rowCount == 0) return res.status(404).json({
            message: `Room was not found.`,
        })

        //if operation is successful then we return status code 200 OK
        return res.status(200).json({
           message: `Room with ID ${result.rows[0].id} and name ${result.rows[0].name} was deleted successfully.`
        })

    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})

//@PATCH: Turn on all lights in the room
//Turns on the lights in all rooms.
roomRoute.patch('/rooms/lights/on', async(req,res) => {
    

    try {
       
        const qry  = "UPDATE rooms SET light = TRUE;"
        const result = await client.query(qry)
        
        //check if we do not return an empty value (if room was not found)
        if(result.rowCount == 0) return res.status(404).json({
            message: `No rooms were found.`,
        })

        //if operation is successful then we return status code 204 No Content, this returns no body
        return res.status(204).json({})

    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})

//@PATCH: Turn off all lights in the room
//Turns off the lights in all rooms.
roomRoute.patch('/rooms/lights/off', async(req,res) => {
    
    try {
       
        const qry  = "UPDATE rooms SET light = FALSE;"
        const result = await client.query(qry)
        const baseUrl = process.env.BASE_URL.replace(/\/+$/, '');
        const location = `${baseUrl}/api/rooms/`;

        //check if we do not return an empty value (if room was not found)
        if(result.rowCount == 0) return res.status(404).json({
            message: `No rooms were found.`,
        })

        //if operation is successful then we return status code 204 No Content
        return res.status(204).json({})

    } catch (error) {
        console.log(`An error occurred: ${error.message}`)
        return res.status(500).json({
            message: 'An error occurred on our side. Please try again.'
        })
    }
})



export default roomRoute