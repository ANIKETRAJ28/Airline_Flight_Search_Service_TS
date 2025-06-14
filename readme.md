# ✈️ Airline Flight Search Service

This is the **Flight Search Service**, a part of a larger microservice-based architecture designed to support a modular and scalable flight booking platform.

---

## 🧱 Part of a Microservice Architecture

This project is one of several microservices that work together:

- 🚪 [API Gateway](https://github.com/ANIKETRAJ28/Airline_Api_Gateway_TS)
- ✈️ [Flight Search Service](.) _(You are here)_
- 🔐 [Auth Service](https://github.com/ANIKETRAJ28/Airline_Auth_Service_TS)
- 🚪 [Booking Service](https://github.com/ANIKETRAJ28/Airline_Booking_Service_TS)
- 🔔 [Reminder Service](https://github.com/ANIKETRAJ28/Airline_Reminder_Service_TS)

## 🛠 Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** for API server
- **PostgreSQL** as the database
- **Node-pg-migrate** for database migrations
<!-- - **Docker** (if used) -->

## Project Setup

### Clone Project

```bash
git clone https://github.com/ANIKETRAJ28/Airline_Flight_Search_Service_TS.git
```

### Install Dependencies

```
npm install
```

### Create `db.config.json` file in `src/config`

Add the following code

```bash
{
  "db": {
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432,
    "database": "airline_flight_search"
  }
}
```

### Create `.env` file

```bash
touch .env
```

### Add env variables

```bash
PORT=5000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flight_search
DATABASE_URL=postgres://postgres:postgres@localhost:5432/airline_flight_search
NODE_ENV=development
```

### Setup Database

#### Run the following commands

This will create the database with the name `airline_flight_search` in postgres dbms

```
npm run initialize:db
```

---

This will migrate all the databse changes

```
npm run migrate up
```

### Start the server

```
npm run start
```

## Important Commands

- Create db `npm run initialize:db`
- Create migration file `npm run migrate create <file_name>`
- Uplift migration `npm run migrate up`
- Revert migration `npm run migrate down`

## Database Architecture

<img src="./image.png" width="400"/>

## API Setup

Import [Postman Collection](./Flight_Search_Service.postman_collection.json) in your postman

### Api Structure

- Countries API
- Cities API
- Airplane API
- Airport API
- Flight API

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check the [issues page](../../issues)
