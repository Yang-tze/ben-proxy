const serviceConfig = require("../service-config.json");
console.log(serviceConfig);

module.exports = (items, props) => `
  <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
  ${items
    .map(item => {
      return `<script src="${serviceConfig[item]}.js"></script>`;
    })
    .join("\n")}
  <script>
    ${items
      .map(
        item => `
      ReactDOM.hydrate(
        React.createElement(${item}, ${JSON.stringify(props[item])}),
        document.getElementById('${item}')
      );`
      )
      .join("\n")}
  </script>
`;
