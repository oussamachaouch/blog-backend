import Parser from "rss-parser";
const parser = new Parser();

const feeds = [
  "https://techcrunch.com/feed/",
  "https://www.theverge.com/rss/index.xml"
];

export async function fetchRssFeeds() {
  let results = [];
  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      results = results.concat(
        feed.items.map(item => ({
          source: feed.title,
          title: item.title,
          url: item.link,
          publishedAt: item.pubDate,
          description: item.contentSnippet || "",
        }))
      );
    } catch (error) {
      console.error("Error fetching RSS:", error.message);
    }
  }
  return results;
}