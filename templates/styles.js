module.exports = items => `
  ${items.map(item => {
    return `<link rel="stylesheet" href="/services/${item}.css" />`;
  })}
`;
