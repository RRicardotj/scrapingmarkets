const getProducts = require('./getProducts');

// ?sort=name-asc&q=%3Arelevance&show=All#
module.exports = async (categories) => {
  for (const categoryName of categories.names) {
    const category = categories[categoryName];

    for (const subCategoryName of category.subCategoriesName) {
      console.clear();
      console.log(`Searching ${categoryName} - ${subCategoryName}`);
      const subCategory = category[subCategoryName];
      for (const productTypeName of subCategory.productTypes) {
        const productType = subCategory[productTypeName];
        const productUrl = `${encodeURI(`https://www.dia.es${productType.categoryUrl}`)}?sort=name-asc&q=%3Arelevance&show=All#`;

        const products = await getProducts(productUrl);
        productType.products = products;
      }
    }
  }
};