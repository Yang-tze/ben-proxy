require("dotenv").config();
require("newrelic");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
const redis = require("./redis");
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
const serviceNames = Object.keys(services);

const React = require("react");
const ReactDom = require("react-dom/server");
const Layout = require("./templates/layout");
const App = require("./templates/app");
const Scripts = require("./templates/scripts");
const Styles = require("./templates/styles");

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props[item]);
    return ReactDom.renderToString(component);
  });
};

const queryDbById = (productId, req, res) => {
  const props = {};
  const requests = [];
  serviceNames.forEach(serviceName => {
    requests.push(
      axios.get(apiConfig[serviceName] + productId).then(info => {
        props[serviceName] = { productData: info.data };
      })
    );
  });
  Promise.all(requests).then(() => {
    const components = renderComponents(services, props);
    const result = Layout(
      "Yang-tze",
      App(...components),
      Scripts(serviceNames, props),
      Styles(serviceNames)
    );
    redis.setnx(productId, result);
    res.end(result);
  });
};

app.get("/:productId", function(req, res) {
  const {
    params: { productId }
  } = req;
  redis.get(productId, (err, reply) => {
    if (reply) {
      res.end(reply);
    } else {
      queryDbById(productId, req, res);
    }
  });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
