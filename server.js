const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const colors = require("colors");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// connect to DB
connectDB();

// routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// body parser
app.use(express.json());

// file upload
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close server and exit
  server.close(() => process.exit(1));
});
