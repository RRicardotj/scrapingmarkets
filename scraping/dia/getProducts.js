const moment = require('moment');
const request = require('request-promise');
const cheerio = require('cheerio');

// $('div[class="span-16 last"] > *')

module.exports = async (productsUrl) => {
  console.log(productsUrl);
  const response = await request(productsUrl);
  let $ = cheerio.load(response);

  const productsContainer = $('div[class="span-16 last"] > *').html();

  // const productsContainer$ = cheerio.load(productsContainer);
  // const divs = productsContainer$('div[class="span-3"]').html();
/*  
  let items = divs.split('\n');

  items.forEach((e) => {
    e = e.trim();
    if (e && e !== '') {
      // const valueTag = e.replace(/(\s+)/g, '');
      console.log(e);
    }
  });
  // console.log("#######################");
*/

  // console.log(productsContainer);
};