// const moment = require('moment');
const request = require('../request');
const cheerio = require('cheerio');

// $('div[class="span-16 last"] > *')

const getUniqueProduct = (html) => {
  let $ = cheerio.load(html);

  const title = $('a[class="productMainLink"]').attr('title').trim();
  const atag$ = cheerio.load($('a[class="productMainLink"]').html());
  const imgUrl = atag$('span[class="thumb"] > img').attr('data-original');
  const price = $('p[class="price"]').text().trim();
  const pricePerUnit = $('p[class="pricePerKilogram"]').text().trim();
  
  return { title, price, pricePerUnit, imgUrl };
};

module.exports = async (productsUrl) => {
  try {
    const response = await request(productsUrl);
    let $ = cheerio.load(response, { decodeEntities: false });

    // const productsContainer = $('div[class="span-16 last"]').html();\
    const products = [];
    $('div[class="span-16 last"] > div').each((i, element) => {
      products.push(getUniqueProduct(element));
    });

    return products;
  } catch (error) {
    throw error;
  }
};