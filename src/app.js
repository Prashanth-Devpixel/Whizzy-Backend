// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const routes = require("./routes");

// const app = express();

// app.use(cors({ origin: "*" })); // 👈 or specify your frontend domain later
// app.use(helmet());
// app.use(express.json());

// // API Routes
// app.use("/api", routes);

// // Health check
// app.get("/", (req, res) => res.json({ message: "API is running 🚀" }));

// module.exports = app;


// backend/src/app.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const morgan = require("morgan");

const app = express();

// ----------------------------------------------------------------------
// 🚨 ADJUSTED CORS CONFIGURATION 🚨
// Set the origin to your frontend's address: http://localhost:5173
// 'credentials: true' is necessary for passing Firebase Auth tokens/cookies.
const corsOptions = {
    origin: '*', // <-- Set to your specific frontend URL!
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // <-- Crucial for auth tokens
};
app.use(cors(corsOptions)); 
// ----------------------------------------------------------------------

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => res.json({ message: "API is running 🚀" }));

module.exports = app;
