const fs = require("fs");
const fetch = require("node-fetch");
const Promise = require("bluebird");
const exists = Promise.promisify(fs.stat);

const loadBundle = (cache, item, filename) => {
  // add a small delay to ensure pipe has closed
  setTimeout(() => {
    console.log(`Loading: ${filename}`);
    cache[item] = require(filename).default;
  }, 0);
};

const fetchBundles = (
  path,
  services,
  ext = "js",
  suffix = "",
  require = false
) => {
  Object.keys(services).forEach(item => {
    const filename = `${path}/${item}${suffix}.${ext}`;
    exists(filename)
      .then(() => {
        require ? loadBundle(services, item, filename) : null;
      })
      .catch(err => {
        if (err.code === "ENOENT") {
          const url = `${services[item]}${suffix}.${ext}`;
          console.log(`Fetching: ${url}`);
          fetch(url).then(res => {
            const dest = fs.createWriteStream(filename);
            res.body.pipe(dest);
            res.body.on("end", () => {
              require ? loadBundle(services, item, filename) : null;
            });
          });
        } else {
          console.log("WARNING: Unknown fs error");
        }
      });
  });
};

module.exports = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(clientPath, services, "css");
  fetchBundles(serverPath, services, "js", "-server", true);

  return services;
};
