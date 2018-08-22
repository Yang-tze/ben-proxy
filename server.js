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
    console.log(result);
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
