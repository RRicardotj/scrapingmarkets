// const moment = require('moment');
const request = require('../request');
const cheerio = require('cheerio');

// $('div[class="span-16 last"] > *')

module.exports = async (productsUrl) => {
  console.log(productsUrl);
  const response = await request(productsUrl);
  let $ = cheerio.load(response);

  // const productsContainer = $('div[class="span-16 last"]').html();
  const productsContainer = $('div[class="span-16 last"] > div').each((i, element) => {
    if (i === 16) {
      console.log($(element).html());
    }
  });

/*
  const productsContainer$ = cheerio.load(productsContainer);
  const divs = productsContainer$('div[class^="span-3"]').html();

  let items = productsContainer.split('\n');

  const products = [];

  let product;
  items.forEach((e) => {
    e = e.trim();
    if (e && e !== '') {
      const valueTag = e.replace(/(\s+)/g, '');
      console.log(valueTag);
      // console.log(e);
      if (e.substr(0, 21) === '<div class="prod_grid'){
        product = {};
        // console.log(e);
      }

      if (product) {

      }
    }
  });
*/
  // console.log("#######################");

  // console.log(productsContainer);
};