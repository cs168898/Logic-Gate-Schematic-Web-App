# Logic Gate Schematic Web App

This project is a full-stack web application for creating, editing, and saving logic gate schematics using a text-based interface. It consists of a React frontend and a Spring Boot backend.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Important Files Overview](#important-files-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Features

- Draw logic gate schematics by describing them in plain text.
- Save and load projects (requires user login).
- AI-assisted schematic generation.
- Download netlists.
- User authentication and project management.

---

## Project Structure

```
Logic-Gate-Schematic-Web-App/
│
├── LogicGates-backend/        # Spring Boot backend (Java)
│   ├── src/
│   ├── public/
│   └── ...
│
├── logic-gates-app/           # React frontend (JavaScript)
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md                  # This file
```

---

## Important Files Overview

### Backend (Spring Boot)

- **LogicGates-backend/src/main/java/FYP/LogicGates/LogicGatesBackendApplication.java**  
  Main entry point for the Spring Boot backend.

- **LogicGates-backend/src/main/resources/application-dev.properties**  
  Backend configuration for local development (database, logging, etc).

- **LogicGates-backend/src/main/java/FYP/LogicGates/controller/**  
  Contains REST controllers for user and project management.

- **LogicGates-backend/src/main/java/FYP/LogicGates/service/**  
  Service interfaces for business logic.

- **LogicGates-backend/src/main/java/FYP/LogicGates/service/impl/**  
  Implementations of service interfaces.

- **LogicGates-backend/src/main/java/FYP/LogicGates/entity/**  
  JPA entity classes mapping to database tables.

- **LogicGates-backend/public/index.html**  
  Placeholder HTML for backend static content.

### Frontend (React)

- **logic-gates-app/src/index.jsx**  
  Entry point for the React application.

- **logic-gates-app/src/App.jsx**  
  Main React component, sets up routing and context providers.

- **logic-gates-app/src/pages/home.jsx**  
  Main page for the logic gate editor and project management.

- **logic-gates-app/src/components/**  
  Reusable UI components (header, login, landing page, etc).

- **logic-gates-app/src/utils/**  
  Utility functions for parsing user input, API calls, and more.

- **logic-gates-app/services/**  
  API service functions for interacting with the backend.

- **logic-gates-app/vite.config.js**  
  Vite configuration for the frontend build and dev server.

- **logic-gates-app/public/index.html**  
  HTML template for the frontend.

---

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Java JDK** (v17+ recommended)
- **Maven** (for building the backend)
- **PostgreSQL** (for backend database)

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Logic-Gate-Schematic-Web-App
```

### 2. Install Frontend Dependencies

```bash
cd logic-gates-app
npm install
```

### 3. Install Backend Dependencies

Make sure you have Maven installed.

```bash
cd ../LogicGates-backend
mvn clean install
```

---

## Running the Application

### Backend

1. **Configure Database**:  
   Edit `LogicGates-backend/src/main/resources/application-dev.properties` (for local dev) with your PostgreSQL credentials.

2. **Start the Backend**:

```bash
cd LogicGates-backend
mvn spring-boot:run
```

- The backend will run on [http://localhost:8080](http://localhost:8080) by default.

### Frontend

1. **Start the Frontend**:

```bash
cd logic-gates-app
npm run dev
```

- The frontend will run on [http://localhost:3000](http://localhost:3000) by default.

---

## Environment Variables

- The frontend uses `VITE_BACKEND_URL` to connect to the backend.
- You can set this in a `.env` file in `logic-gates-app/`:

```
VITE_BACKEND_URL=http://localhost:8080
```

---

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Register or log in to create and save projects.
3. Enter logic gate descriptions in the provided text area. Example:

    ```
    name: And Gate;
    type: AND;
    input: A,B;
    output: C;
    ```

4. Use the sidebar to manage projects.
5. Use the AI feature for schematic suggestions.

---

## Troubleshooting

- **Port Conflicts**: Make sure ports 8080 (backend) and 3000 (frontend) are free.
- **Database Connection Issues**: Ensure PostgreSQL is running and credentials are correct.
- **CORS Issues**: The backend allows requests from `http://localhost:3000` by default.

---

## Credits

Created by Samuel Yew Han Sen  
LinkedIn: https://www.linkedin.com/in/samuelyew/

---
