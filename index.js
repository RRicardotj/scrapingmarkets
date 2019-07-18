const request = require('request-promise');
const cheerio = require('cheerio');
const URL = 'https://www.imdb.com/title/tt6320628/?ref_=nv_sr_1?ref_=nv_sr_1';

const scrap = async () => {
  try {
    const response = await request(URL);

    const $ = cheerio.load(response);

    const title = $('div[class="title_wrapper"] > h1').text().trim();
    const rating = $('span[itemprop="ratingValue"]').text();
    const other = $('span[itemprop="reviewCount"]').text();

    console.log(title, rating);
  } catch (error) {
    throw error;
  }
};

scrap().catch((err) => { console.log(err); });
