const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const localRoutes = {
  3001: 'http://localhost:3001',
  3002: 'http://localhost:3002',
  3003: 'http://localhost:3003',
  3004: 'http://localhost:3004',
}

const ec2Routes = {
  3001: 'http://ec2-34-238-117-212.compute-1.amazonaws.com/',
  3002: 'http://ec2-54-153-53-170.us-west-1.compute.amazonaws.com/',
  3003: 'http://ec2-52-90-134-215.compute-1.amazonaws.com',
  3004: 'http://ec2-34-224-31-187.compute-1.amazonaws.com/',
}

let route = ec2Routes;

app.use('/related/**', proxy({target: route[3001], changeOrigin: true}));
app.use('/images/**', proxy({target: route[3002], changeOrigin: true}));
app.use('/products/**', proxy({target: route[3003], changeOrigin: true}));
app.use('/reviews/**', proxy({target: route[3004], changeOrigin: true}));

app.get('/', (req, res) => {
  res.redirect('/1');
});

app.use('/*', express.static('./'));

app.listen(3000, () => console.log('Listening on port 3000'));
