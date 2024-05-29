const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth/auth');
const userRoutes = require('./routes/user/user');
const todosRoutes = require('./routes/todos/todos');
const unkownpage = require('./middleware/notFound');


const app = express();
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/todos', todosRoutes);

app.use(unkownpage);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
