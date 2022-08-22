const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
const db = require('./app/models');
const dbConfig = require('./app/config/db.config.js');
const Role = db.role;

db.mongoose.connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

// Creates user roles
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'moderator' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

var corsOptions = {
    origin: 'https://localhost:8081'
};
app.use(cors(corsOptions));

// Parse requests of type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: 'app-session',
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);

// Base endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Lupiya!" });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// Set port to listen 
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});