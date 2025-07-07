# new_attendance

A prototype attendance tracking system using **Node.js**, **Express**, and **MongoDB**.
The project demonstrates a simple backend API for registering users, logging in, and
recording attendance. A placeholder Google Sheets integration is included.

## Structure

- `server/`
  - `server.js` – main Express app
  - `config/db.js` – MongoDB connection
  - `models/` – Mongoose models for users and attendance
  - `routes/` – API routes for authentication and attendance
  - `googleSheets.js` – stub for pushing updates to Google Sheets

## Usage

1. Install dependencies (requires Node.js):
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node server/server.js
   ```

API endpoints are exposed under `/api`. Adjust the MongoDB connection string via
`MONGO_URI` environment variable.
