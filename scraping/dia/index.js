const path = require('path');
const fs = require('fs');
const moment = require('moment');
const request = require('request-promise');
const cheerio = require('cheerio');
const searchProduct = require('./searchProducts');
const URL = 'https://www.dia.es/compra-online/#';

// https://www.dia.es/compra-online/productos/frescos/c/WEB.001.000.00000?q=%3Arelevance&page=0&disp= >> page 1
// https://www.dia.es/compra-online/productos/frescos/c/WEB.001.000.00000?q=%3Arelevance&page=1&disp= >> page 2

// sort=name-asc >> sort name asc
// page=1 >> page 1
// q=%3Arelevance I suspect with this parameter search by query strings is aveliable
// https://www.dia.es/compra-online/productos/frescos/carne-y-aves/empanados-y-cocidos/c/WEB.001.001.00009?q=%3Arelevance&sort=name-asc
// https://www.dia.es/compra-online/productos/frescos/carne-y-aves/salchichas-chorizo-morcilla/c/WEB.001.001.00011?q=%3Arelevance%3Acategory%3AWEB.001.001.00000&sort=name-asc&show=all
// ?sort=name-asc&q=%3Arelevance&show=All#

const getCategoryUrl = (valueTag) => {
  const openQuote = 8;
  const closeQuote = valueTag.substr(8, valueTag.length - 1).indexOf('"');
  return valueTag.substr(openQuote, closeQuote);
};

const getTitle = (valueTag) => {
  const startTitle = valueTag.substr(8, valueTag.length - 1).indexOf('"') + 10;
  const closeTag = valueTag.substr(startTitle, valueTag.length - 1).indexOf('<');
  const title = valueTag.substr(startTitle, closeTag);
  return title;
};

const categories = {
  names: [],
}

const scrap = async () => {
  try {
    const queryparams = {
      activate: 'q=%3Arelevance',
      activateWithAll: 'q=%3Arelevance%3Acategory%3AWEB.001.001.00000',
      sort: {
        asc: 'sort=name-asc',
        desc: 'sort=name-desc'
      },
      showAll: 'show=All',
      page: 'page'
    };
    
    const response = await request(URL);

    const $ = cheerio.load(response);

    const nav = $('div[class="navigation-container"]').html();
    const nav$ = cheerio.load(nav);

    const ul = nav$('ul[id="nav-submenu-container"]').html();
    let items = ul.split('\n');

    items.forEach((e) => {
        if (e) {
            const valueTag = e.replace(/(\s+)/g, '');
            if (valueTag.substr(0, 6) === '<ahref') {
              const categoryUrl = getCategoryUrl(valueTag);
              
              const urlParts = categoryUrl.split('/').filter(part => (part !== ''));

              if (urlParts[1] === 'productos') {
                const [,,categoryName, subCategory, productType] = urlParts;
                const categoryTitle = getTitle(valueTag);
                
                if (!categories.names.includes(categoryName)) {
                  categories.names.push(categoryName);
                  categories[categoryName] = { name: categoryTitle, subCategoriesName: [] };
                } else {
                  if (!categories[categoryName].subCategoriesName.includes(subCategory)) {
                    categories[categoryName].subCategoriesName.push(subCategory);
                    categories[categoryName][subCategory] = { name: categoryTitle, productTypes: [] };
                  } else {
                    categories[categoryName][subCategory].productTypes.push(productType);
                    categories[categoryName][subCategory][productType] = { categoryUrl, products: [] };
                  }
                }
                // console.log(urlParts);
              }
            }
            // console.log(valueTag);
        }
    });

    const date = moment().format('YYYYMMDDHHmmss');
    const diaPath = `{$__dirname}../../data/dia`;

    // console.log(categories);
    let dates = fs.readFileSync(path.resolve(`${diaPath}/index.json`), { encoding: 'utf8' }).toString();

    dates = JSON.parse(dates);

    dates.dates.push(date);
    // fs.writeFileSync(path.resolve(`${diaPath}/${date}.json`), JSON.stringify(categories));
    // fs.writeFileSync(path.resolve(`${diaPath}/index.json`), JSON.stringify(dates));

    await searchProduct(categories);
  } catch (error) {
    throw error;
  }
};

scrap().catch((err) => { console.log(err); });
