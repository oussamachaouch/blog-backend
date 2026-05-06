import express from 'express';
import { fetchNewsApi } from '../services/newsApiService.js';
import { fetchRssFeeds } from '../services/rssService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apiNews = await fetchNewsApi();

    const allNews = apiNews.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    res.json(allNews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
});

export default router;