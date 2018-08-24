const serviceConfig = require("../service-config.json");

module.exports = items => `
  <style>
  body {
    margin: 0;
    padding: 0;
    border: 0;
  }
  #wrapper {
    padding: 10px;
    margin: 0;
    border: 0;
  }
  #banner {
    width: 100%;
    padding-bottom: 15px
  }
  </style>
    ${items.map(item => {
      return `<link rel="stylesheet" href="${serviceConfig[item]}.css" />`;
    })}
`;
