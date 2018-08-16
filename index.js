require("dotenv").config();
require("newrelic");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const localRoutes = {
  related: "http://localhost:3001",
  images: "http://localhost:3002",
  products: "http://localhost:3003",
  reviews: "http://localhost:3004"
};

const ec2Routes = {
  related: "http://ec2-34-238-117-212.compute-1.amazonaws.com/",
  images: "http://ec2-54-153-53-170.us-west-1.compute.amazonaws.com/",
  products: "http://ec2-52-90-134-215.compute-1.amazonaws.com",
  reviews: "http://ec2-34-224-31-187.compute-1.amazonaws.com/"
};

let route = localRoutes;

app.use("/related/**", proxy({ target: route.related, changeOrigin: true }));
app.use("/images/**", proxy({ target: route.images, changeOrigin: true }));
app.use("/products/**", proxy({ target: route.products, changeOrigin: true }));
app.use("/reviews/**", proxy({ target: route.reviews, changeOrigin: true }));

app.get("/", (req, res) => {
  res.redirect("/1");
});

app.use("/*", express.static("./"));

app.listen(3000, () => console.log("Listening on port 3000"));
