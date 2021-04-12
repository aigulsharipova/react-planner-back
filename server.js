const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const port = 3001;

const app = express();
require('./config/database');

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, function() {
    console.log(`Express is listening on port:${port}`);
});

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);