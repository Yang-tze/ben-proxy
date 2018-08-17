module.exports = items => `
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
        React.createElement(${item}),
        document.getElementById('${item}')
      );`
      )
      .join("\n")}
  </script>
`;
