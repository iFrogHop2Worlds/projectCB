const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const allureData = require("./api/allureData.route");
const glamourData = require("./api/glamourData.route")


const app = express();

app.use(cors());
process.env.NODE_ENV !== 'prod' && app.use(morgan("dev"));
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

// register API routes
app.use("/Allure", allureData)
app.use("/Glamour", glamourData)
// app.use("/post", beautyData)
// app.use("/status", express.static("build"))
// app.use("/", express.static("build"))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

module.exports = app;