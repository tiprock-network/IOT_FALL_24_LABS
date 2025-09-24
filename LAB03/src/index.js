import 'dotenv/config'
import 'colors'

import { connectToDb } from './db.js'
import { startLogging } from './plugins/sensorPlugin.js'
import express from 'express'

//bring in the routes
import roomRoute from './routes/roomRoutes.js'




//connect to the database - to connect to pg server
await connectToDb()

//sensor starts sending data to DB
await startLogging()

//initialize the application
const app = express()
//set the view template
app.set('view engine', 'ejs')
//set the public file

app.use(express.static('public'))
//add middleware necessary for body-parsing
app.use(express.json())
//added for form data - application/x-www-form-urlencoded; multipart/form-data
app.use(express.urlencoded(
    {extended:false}
))

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

//start the base URL with the dashboard
app.get('/', async (req,res) => {
    const avgTempResponse = await fetch(`${BASE_URL}:${PORT}/api/rooms/average-temperature`,{
        method: 'GET',
        headers:{
            'Content-Type':'application/json'
        }
    })

    if(!avgTempResponse.ok){
        return res.render('dashboard',{avgTemp:'--.-'})
    }

    const avgTempBody = await avgTempResponse.json()
    const avgTemp = avgTempBody.average_temperature
    res.render('dashboard',{avgTemp:avgTemp})
})

//start the base URL with the dashboard
app.get('/about', (req,res) => {
    res.render('about')
})


app.use('/api', roomRoute) //here we use the route



app.listen(PORT, async () => {
    console.log('Carnegie'.bgRed.white)
    console.log('Mellon'.bgRed.white)
    console.log('University'.bgRed.white)
    console.log('Africa\n'.white)
    console.log('--------------------------------------------------------------------------')
    console.log('Author: Theophilus Owiti | Email: towiti@andrew.cmu.edu | \u00a9 2025')
    console.log('--------------------------------------------------------------------------\n')
    console.log(`App listening on PORT: ${PORT}...`.yellow)
})