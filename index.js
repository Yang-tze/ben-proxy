const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/1');
})

app.use('/*', express.static('./'));

app.listen(3000, () => console.log('Listening on port 3000'));
