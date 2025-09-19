import 'colors'
import 'dotenv/config'
import { Pool } from 'pg'

const config = {
    user:  process.env.DB_USER || 'none',
    password: process.env.DB_PASSWORD || 'none',
    host: process.env.DB_HOST || 'none',
    port: process.env.DB_PORT || 'none',
    database: process.env.DB || 'noneS',
}

//TODO: Try a connection string

const pool = new Pool(config)


const connectToDb = async () => {
    try {
        await pool.connect()
        console.log('Application connected to database successfully.'.green)
    } catch (error) {
        console.log(`Failed to connect to the database.\nError Message: ${error.message?error.message:'None'}`.red)
        pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client '.red, err)
            process.exit(-1)
        }) 
    }
}

const client = await pool.connect()

export {connectToDb, client}