import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const CACHE_DURATION = 120 * 60 * 1000; // X minutes (10 minutes in ms)

// In-memory cache
let cache = {
  timestamp: 0,
  data: null
};

export async function fetchNewsApi() {
  const now = Date.now();
  // Check if cached data is still valid
  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    console.log("✅ Returning cached news");
    return cache.data;
  }

  console.log("🌍 Fetching fresh news from NewsAPI...");
  try {
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${NEWS_API_KEY}`;
    const { data } = await axios.get(url);

    const response = data.articles.map(article => ({
      source: "NewsAPI",
      title: article.title,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      description: article.description,
    }));

    // Save to cache
    cache = {
      timestamp: now,
      data: response,
    };


    return response
  } catch (error) {
    console.error("Error fetching NewsAPI:", error.message);
    // Fallback to last cached data if available
    if (cache.data) {
      console.log("⚠️ Returning stale cached news due to error");
      return cache.data;
    }
    return [];
  }
}