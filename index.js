const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const onConnection = require("./app/socket");
require("dotenv").config();

const port = process.env.PORT || 3000;

const route = require("./routes/index");
const connectDatabase = require("./configs/database");
connectDatabase();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// middleware cors
app.use(cors());

// passport
app.use(passport.initialize());

// route init
route(app);

/**
 * socket io
 */

onConnection(server);

/**
 * Lestiening server
 */
server.listen(port, () => {
  console.log("listening on port " + port);
});
