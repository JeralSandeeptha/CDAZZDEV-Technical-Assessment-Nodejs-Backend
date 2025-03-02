# Express.js API with TypeScript and PostgreSQL

This repository contains the source code for a Expressjs API with Typescript that integrates with a React Application. The project is designed to run locally, providing a backend setup for demonstration purposes.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
    - [Run project thorugh Nodejs](#run-project-through-nodejs)
- [Test Application](#test-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a RESTful API built with Express.js and TypeScript, using PostgreSQL as the database.

## Getting Started

Follow the instructions below to set up and run the project locally.

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)
- As a Language [Setup Typescript](https://www.typescriptlang.org/)
```js
npm install -g typescript
```
- As a Database [Download PostgreSQL](https://www.postgresql.org/download/)
- As a database Management tool [Download PgAdmin](https://www.pgadmin.org/download/)

# Project Structure

- **Utils**: Include all the utility functions
- **Cypress**: Include all the E2D tests
- **Config**: Include all the configurations such as Database and logger
- **Controllers**: Include all the controllers to handle business logic of each request and responses
- **Routes**: Include all the routes for handle API request
- **Middleswares**: Include all the middlewares to handle and authenticate related request and responses
- **Tests**: Include all the unit and intergration testing
- **Types**: Include all the Typescript types for ensure the type safety

# Database Schema

![ER Diagram](https://res.cloudinary.com/dv9ax00l4/image/upload/v1740752660/err_gvy9wp.png)

- Create a database called `OnlineLearningPlatform`
- Run the below sql commands to create tables
```sql
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM admin;

CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM student;

CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM course;
```

## Environment Variables

- Create .env file inside the project root folder.
- Add these variables to .env file.
```bash
PORT=3000
DATABASE_URL=postgres://postgres:1234@localhost:5432/OnlineLearningPlatform
JWT_SECRET=my_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Running the Project

### Run project thorugh Nodejs

For production server
```bash
npm start
```

For development server
```bash
npm run dev
```

## Test Application

```bash
npm run test
```

## API Documentation

This is the [API Documentation](https://documenter.getpostman.com/view/20760727/2sAYdhLWT5)

## Contributing

- Feel free to fork the repository and submit pull requests to contribute to the project.

## License

- This project is licensed under the MIT License.