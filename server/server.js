require('dotenv').config();
const cors = require('cors');
const express = require('express');

const createDatabase = require('./config/createDatabase');
const database = require('./config/initializeDatabase');
const articleRoute = require('./routes/articleRoute');

const app = express();
app.use(express.json());

// Сross-origin resource sharing permission.
app.use(cors());

app.use('/api', articleRoute);

// Parsing site.
require('./utils/parser')();

// Synchronization with DB, if success -> server starts.
(async () => {
    try {
        await createDatabase();
        await database.sync();
        app.listen(process.env.APP_PORT, () => {
            console.log(`Server listening on port ${process.env.APP_PORT}.`);
        });
    } catch (err) {
        console.error(`Connection failed at port: ${process.env.APP_PORT}`, err);
    };
})();