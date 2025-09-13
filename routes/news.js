const express = require("express");
const { fetchNewsApi } = require("../services/newsApiService.js");
const { fetchRssFeeds } = require("../services/rssService.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // const [apiNews, rssNews] = await Promise.all([
    //   fetchNewsApi(),
    //   fetchRssFeeds()
    // ]);
    const apiNews = await fetchNewsApi();

    // Merge & sort by date
    // const allNews = [...apiNews, ...rssNews].sort(
    //   (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    // );

    const allNews = apiNews.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    res.json(allNews);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
});

module.exports = router;