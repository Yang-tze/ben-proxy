module.exports = (title, content, scripts, styles) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${styles}
      <title>${title}</title>
    </head>
    <body>
      <img id="banner" src="https://s3-us-west-1.amazonaws.com/viamis/Screen+Shot+2018-08-04+at+3.29.49+PM.png" />
      <div id="wrapper">
        ${content}
      </div>
    </body>
    ${scripts}
  </html>
`;
