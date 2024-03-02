const fetch = require("node-fetch");

const returnScraperApiUrl = (apiKey) =>
  `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

const getProductSearch = async (searchQuery) => {
  const apiKey = process.env.SCRAPER_API_KEY;
  const scraperUrl = returnScraperApiUrl(apiKey);

  try {
    const response = await fetch(`${scraperUrl}&url=https://www.amazon.com/s?k=${searchQuery}`);
    const data = await response.json();
    if (Array.isArray(data)) {
        const limitedResults = data.slice(0, 3);
        return limitedResults;
      } else if (data && typeof data === 'object' && data.results) {
        const limitedResults = data.results.slice(0, 3);
        return limitedResults;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }
  } catch (error) {
    console.log(`Error: ${error}`);
    return { error: error.message };
  }
};

module.exports = { getProductSearch };
