const getRandomNumberWeightedTowardMax = (max) => {
  if (Math.random() < 0.1) {
    return Math.ceil(Math.random() * 0.9 * max);
  }
  return 0.9 * max + Math.ceil(Math.random() * 0.1 * max);
};

const ltrs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const generateName = (index, length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ltrs[index % 10];
    index = Math.floor(index / 10);
  }
  return result;
};

// For use with siege, which is better suited for GET requests
const generateWeightedId = () => getRandomNumberWeightedTowardMax(10000000);
const generateWeightedName = () => {
  const id = getRandomNumberWeightedTowardMax(10000000);
  return generateName(id, 7);
};

// For use with artillery, which is better suited for PATCH/POST requests
const generateProductInfo = (context, events, done) => {
  context.vars.id = getRandomNumberWeightedTowardMax(10000000);
  context.vars.product_name = 'brand';
  context.vars.is_prime = 1;
  context.vars.num_questions = 50;
  context.vars.product_name = generateName(context.vars.id, 4);
  context.vars.product_price = 0.99;
  context.vars.product_tier = 'first';
  context.vars.review_totals = [5, 5, 5, 5, 5];
  context.vars.seller_name = 'ben';
  context.vars.stock_count = 1;
  context.vars.thumbnail_url = 'url';
  return done();
};

module.exports = {
  generateWeightedId,
  generateWeightedName,
  generateProductInfo,
};
