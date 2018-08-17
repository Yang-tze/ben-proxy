const siege = require("siege");
const { generateWeightedId, generateWeightedName } = require("./testData.js");

let sieger = siege().on(3000);

// GET product page
for (let i = 0; i < 100000; i++) {
  sieger = sieger.for(1).times.get(`/${generateWeightedId()}`);
}

// GET product by id
// for (let i = 0; i < 100000; i++) {
//   sieger = sieger.for(1).times.get(`/products/${generateWeightedId()}`);
// }

// GET product by name
// for (let i = 0; i < 100000; i++) {
//   sieger = sieger.for(1).times.get(`/products/name/${generateWeightedName()}`);
// }

sieger.attack();
