module.exports = (items, props) => `
  <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  ${items
    .map(item => {
      return `<script src="/services/${item}.js"></script>`;
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
