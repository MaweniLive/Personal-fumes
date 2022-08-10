const express = require("express");
const app = express();
const fs = require("fs");

const bodyParser = require("body-parser");
const router = require("../routes/categoryRoutes");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(_dirname + "/" + "index.html");
});
