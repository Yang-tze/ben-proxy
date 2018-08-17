require("dotenv").config();
require("newrelic");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

const apiConfig = require("./api-config.json");

const clientBundles = "./public/services";
const serverBundles = "./templates/services";
const serviceConfig = require("./service-config.json");
const services = require("./loader.js")(
  clientBundles,
  serverBundles,
  serviceConfig
);

const React = require("react");
const ReactDom = require("react-dom/server");
const Layout = require("./templates/layout");
const App = require("./templates/app");
const Scripts = require("./templates/scripts");

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props[item]);
    return ReactDom.renderToString(component);
  });
};

app.get("/:productId", function(req, res) {
  const {
    params: { productId }
  } = req;
  const props = {};
  const endpoints = Object.keys(apiConfig);
  const requests = [];
  endpoints.forEach(endpoint => {
    requests.push(
      axios.get(apiConfig[endpoint] + productId).then(info => {
        props[endpoint] = { productData: info.data };
      })
    );
  });
  Promise.all(requests).then(() => {
    const components = renderComponents(services, props);
    res.end(
      Layout(
        "Yang-tze",
        App(...components),
        Scripts(Object.keys(services), props)
      )
    );
  });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require("cors");
// const proxy = require("http-proxy-middleware");

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// const localRoutes = {
//   related: "http://localhost:3001",
//   images: "http://localhost:3002",
//   products: "http://localhost:3003",
//   reviews: "http://localhost:3004"
// };

// const ec2Routes = {
//   related: "http://ec2-34-238-117-212.compute-1.amazonaws.com/",
//   images: "http://ec2-54-153-53-170.us-west-1.compute.amazonaws.com/",
//   products: "http://ec2-52-90-134-215.compute-1.amazonaws.com",
//   reviews: "http://ec2-34-224-31-187.compute-1.amazonaws.com/"
// };

// let route = localRoutes;

// app.use("/related/**", proxy({ target: route.related, changeOrigin: true }));
// app.use("/images/**", proxy({ target: route.images, changeOrigin: true }));
// app.use("/products/**", proxy({ target: route.products, changeOrigin: true }));
// app.use("/reviews/**", proxy({ target: route.reviews, changeOrigin: true }));

// app.get("/", (req, res) => {
//   res.redirect("/1");
// });

// app.use("/*", express.static("./"));

// app.listen(3000, () => console.log("Listening on port 3000"));
