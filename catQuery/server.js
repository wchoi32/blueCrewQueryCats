const express = require('express');
const bodyParser = require('body-parser');

const cat = require('./routes/cat');
const cats = require('./routes/cats');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/cat', cat);
app.use('/cats', cats);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
