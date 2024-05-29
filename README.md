# EPYTODO

Web site for tasks management

create a file epytodo.sql

epytodo.sql:

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_time DATETIME NOT NULL,
    status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

cat epytodo.sql | mysql -u your_username -p ---> To Import the Schema into MySQL
Replace your_username with your MySQL username. You'll be prompted to enter your MySQL password.


SHOW DATABASES --> to view databases;
USE epytodo --> to access the database epytodo;
SHOW TABLES --> to view your table (user, todo);
DESCRIBE user --> to show the container of the user;
DESCRIBE todo --> to show the container of the todo;


Step 1: Project Structure

- .env
- package.json
- src/
  - config/
    - db.js
  - index.js
  - middleware/
    - auth.js
    - notFound.js
  - routes/
    - auth/
      - auth.js
    - todos/
      - todos.js
      - todos.query.js
  - user/
    - user.js
    - user.query.js

Step 2: Install Required Packages
npm install express mysql2 dotenv jsonwebtoken bcryptjs body-parser

Step 3: Create Configuration Files
Create a db.js file inside the src/config/ directory to handle the database connection.


// src/config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

module.exports = pool.promise();

Step 4: Set Up Express Server
Create an index.js file as the main entry point of your application and set up the Express server.

// src/index.js
const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth/auth'));
app.use('/todos', require('./routes/todos/todos'));

// not Middleware 
app.use(require('./middleware/notFound'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
Step 5: Create Middleware
Create middleware functions for authentication (auth.js) and handling 404 errors (notFound.js) as described in the project structure.

Step 6: Define Routes
Create route handlers for authentication (auth.js) and todos (todos.js) inside their respective directories under src/routes/.

Step 7: Implement User and Todo Modules
Create modules for handling user operations (user.js, user.query.js) and todo operations (todos.js, todos.query.js) inside their respective directories under src/user/ and src/routes/todos/.


Step 8: Environment Variables
Create a .env file at the root of your project directory and define the required configuration variables:

MYSQL_DATABASE=epytodo
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_ROOT_PASSWORD=your_mysql_password
PORT=3000
SECRET=your_secret_key_for_jwt
Replace your_mysql_username and your_mysql_password with your MySQL credentials, and choose a secure value for SECRET to be used for JWT encryption.
