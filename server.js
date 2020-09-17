const express = require("express");
const dotenv = require("dotenv");

// middleware
const logger = require("./middlewares/logger");

// routes
const bootcamps = require("./routes/boocamps");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(logger);

// mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
