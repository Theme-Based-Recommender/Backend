// Updated version of the getAmazonProductSearch function using async/await

const { getJson } = require("serpapi");

const getAmazonProductSearch = async (items) => {
  try {
    const results = await Promise.all(items.map(async (item) => {
      return new Promise((resolve, reject) => {
        getJson({
          engine: "google_shopping",
          q: item,
          start: 0,
          num: 4,
          api_key: process.env.SERP_API
        }, (json) => {
          if (json.error) {
            reject(json.error);
          } else {
            resolve({
              category: item,
              results: json["shopping_results"]
            });
          }
        });
      });
    }));

    const bundles = [];
    const products = [];
    const maxLength = Math.max(...results.map(result => result.results.length));

    for (let i = 0; i < maxLength; i++) {
      const bundle = results.map(result => {
        if (result.results[i] !== undefined) {
          return {
            name: result.results[i].title,
            url: result.results[i].link,
            image: result.results[i].thumbnail,
            stars: result.results[i].rating ? result.results[i].rating : undefined,
            total_reviews: result.results[i].reviews,
            price_string: result.results[i].price,
            ...result.results[i]
          };
        }
        return undefined;
      }).filter(item => item !== undefined);
      if (bundle.length > 0) {
        bundles.push(bundle);
      }
    }

    results.forEach(result => {
      products.push({
        name: result.category,
        res: result.results.map(item => ({
          name: item.title,
          url: item.link,
          image: item.thumbnail,
          stars: item.rating ? item.rating : undefined,
          total_reviews: item.reviews,
          price_string: item.price,
          ...item
        }))
      });
    });

    console.log('Bundles:', JSON.stringify(bundles, null, 2));
    console.log('Products:', JSON.stringify(products, null, 2));
    return {
      bundles: bundles,
      products: products
    };
  } catch (error) {
    console.error('Error in promises:', error);
  }
};

module.exports = { getAmazonProductSearch };