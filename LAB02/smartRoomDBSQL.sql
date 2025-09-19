-- Database: smartroomdb

-- DROP DATABASE IF EXISTS smartroomdb;

CREATE DATABASE smartroomdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;*/



CREATE TABLE rooms(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL,
	light BOOLEAN DEFAULT FALSE
);

CREATE TABLE temperature_logs(
	id SERIAL PRIMARY KEY,
	room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
	temperature INTEGER CHECK (temperature BETWEEN -5 AND 40),
	timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM temperature_logs;
