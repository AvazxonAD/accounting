const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./index.routes");

app.use(express.json({limit: '50mb'}));
app.use(cors());
require("colors");

const PORT = process.env.PORT || 3005;

app.use(express.static("../public"));
app.use(require('./middleware/response.metods'))
app.use(router);
app.use('*', (req, res) => {
  res.error('Page not found', 404);
});
app.use(require("./middleware/errorHandler"));

app.listen(PORT, () => {
  console.log(`server runing on port : ${PORT}`.blue);
});