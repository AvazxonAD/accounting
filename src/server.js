const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router/index");

app.use(express.json());
app.use(cors());

const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3005;

app.use(express.static("../public"));

app.use(router);

app.use(require("./middleware/errorHandler"));

app.listen(PORT, () => {
  console.log(`server runing on port : ${PORT}`.blue);
});
