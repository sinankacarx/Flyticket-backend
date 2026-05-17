# ✈️ SinanJet | Advanced Airline Ticket Reservation System

SinanJet is an enterprise-grade, full-stack airline reservation portal built with the MERN/PERN equivalent architecture using **React (Vite)**, **Node.js (Express)**, and **MySQL**. It features dynamic flight searching, interactive real-time seat mapping, cascade-safe booking/cancellations, and a robust administrative control panel designed with strict input validation and relational database integrity.

---

## 📌 Table of Contents
1. [Key Features](#-key-features)
2. [Engineering Highlights & Architecture](#-engineering-highlights--architecture)
3. [Technologies Used](#%EF%B8%8F-technologies-used)
4. [Database Schema Overview](#%EF%B8%8F-database-schema-overview)
5. [API Endpoints Documentation](#-api-endpoints-documentation)
6. [System Installation & Setup](#-system-installation--setup)
7. [Administrative Credentials](#-administrative-credentials)

---

## 🌟 Key Features

### 👤 Passenger Portal
* **Smart Flight Search:** Dynamic multi-city routing filter with real-time past-date and past-hour validation algorithms.
* **Interactive Seat Selector:** Real-time visual seat matrix displaying taken and available seats dynamically synced with the database.
* **Smooth UX Navigation:** Automatic smooth-scrolling mechanics focusing instantly on flight search results.
* **Secure Boarding Pass Generation:** Post-booking generation of digital tickets complete with automated dynamic QR Code integration.
* **My Tickets Panel:** Session-guarded panel allowing users to view their active flights and request secure cancellations.

### 👑 Administrative Control Panel
* **Live Statistics Dashboard:** Real-time calculation of total revenue, total tickets sold, flight counts, and dynamically calculated "Most Popular Route".
* **Flight Management (CRUD):** Interface to create, read, update, and delete flights.
* **Air Traffic Conflict Prevention:** Automated prevention system that blocks matching takeoff/landing timelines at the same airports.
* **Relational Safety Gates:** Strict controls preventing same-city round-trips (e.g., Ankara to Ankara) and preventing past-dated flight entries.

---

## 🧠 Engineering Highlights & Architecture

As a computer engineering project, SinanJet emphasizes relational stability, security, and algorithmic efficiency over basic CRUD operations:

* **ACID-Compliant SQL Transactions:** Flight cancellations by admins employ strict database transactions (`beginTransaction`, `commit`, `rollback`). If an active flight with passenger records is aborted, all associated tickets and flight entities are securely wiped in a cascading workflow—guaranteeing no orphaned data or memory leaks if network dropouts occur.
* **Race Condition Prevention:** Seat allocation routes implement backend-level criteria boundaries to block "Overbooking". Even under high concurrency or simultaneous clicks, maximum seat capacity caps are tightly preserved.
* **Session Guarding & Security:** Passwords are fully encrypted using **Bcrypt** hashing (10 salt rounds). Route endpoints are protected using stateless **JWT (JSON Web Tokens)** ensuring authorization state management.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Component-based modern SPA reactive UI |
| **Frontend** | Tailwind CSS | Utility-first, fully responsive fluid layouts |
| **Frontend** | React Router DOM | Secure declarative client-side route guards |
| **Backend** | Node.js & Express.js | Event-driven, asynchronous RESTful API architecture |
| **Database** | MySQL | Robust relational schema, indexes, and transactional queries |
| **Security** | JWT & Bcrypt | Stated session security and encrypted user hashing |

---

## 🗄️ Database Schema Overview

The relational structure consists of four main optimized tables managed with explicit primary and foreign key constraints:
* `cities`: Stores geographical nodes (`city_id`, `city_name`, `latitude`, `longitude`).
* `flights`: Manages schedules and pricing dynamically based on Haversine distance computations.
* `tickets`: Links passenger sessions directly to seats and flight entities.
* `admins` & `users`: Stores secure credential records.

---

## 📑 API Endpoints Documentation

### 🟢 Public & Passenger Endpoints
* `GET /api/cities` - Fetches all available global city nodes.
* `GET /api/flights/search` - Searches future flights dynamically based on origin, destination, and datetime variables.
* `GET /api/flights/:flight_id/taken-seats` - Dynamically maps out currently reserved seats.
* `POST /api/tickets` - Executes seat checking and books a ticket.
* `GET /api/my-tickets/:email` - Fetches active passenger tickets via token/session confirmation.
* `DELETE /api/tickets/:ticket_id` - Safely voids a booking and increments available seating.

### 🔴 Administrative Endpoints
* `POST /api/admin/login` - Authenticates administrative dashboard sessions.
* `GET /api/admin/flights` - Lists all raw flight objects arranged chronologically.
* `GET /api/admin/tickets` - Manifest display of every ticket ledger in the system.
* `POST /api/flights` - Injects a new flight route (Triggers conflict and past-date filters).
* `PUT /api/flights/:id` - Updates baseline flight pricing, capacity, and timing metadata.
* `DELETE /api/flights/:id` - Triggers the cascading **SQL Transaction** to erase a flight schedule.

---

## ⚙️ System Installation & Setup

### 1. Database Provisioning
1. Initialize your local MySQL server instance.
2. Create a target database named `flyticket_db`.
3. Import the structured snapshot `sinanjet_db.sql` file provided in the backend directory repository root.

### 2. Backend Initialization
```bash
cd backend
npm install
node server.js
```
*The backend core engine will boot up and bind to `http://localhost:5000`.*

### 3. Frontend Deployment
```bash
cd frontend
npm install
npm run dev
```
*Vite will compile the assets. Open the local address provided in your terminal to view the application.*

---

## 🔐 Administrative Credentials

To test and grade advanced backend error handling, aviation conflicts, and transaction rollbacks, use the following login access vectors:

* **Admin Username:** admin
* **Admin Password:** 123456

---
Developed with 🧡 by Sinan Kaçar - MSKÜ Computer Engineering