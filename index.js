const express = require('express');
const morgan = require('morgan');
const { errorHandling } = require('./src/middelware/errorHandling');
const route = require('./src/routes/route')

const app = express();
const PORT = 3100;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(route);
app.use(errorHandling);

app.listen(PORT, () => {
   console.log(`Server on port ${PORT}`);
});