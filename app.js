const express = require('express');
const cors = require("cors");
const routes = require('./routes/router.js'); // Import the route module

require("./db/config");

const app = express();

 

app.use(express.json());
app.use(cors());

app.use('/', routes);



const PORT = process.env.PORT || 5000

app.listen(PORT);