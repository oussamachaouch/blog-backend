// node scripts/sync-translations.js
import fetch from "node-fetch";

const PORT = process.env.PORT || 3000;
const API_URL = `http://localhost:${PORT}/translate/all?sync=true`; // adjust port
const languages = ["fr", "it", "es","de"]; // extend as needed

(async () => {
    console.log("🔄 body to send....",JSON.stringify({ codes: languages }));
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes: languages }),
    });
    const data = await res.json();
    console.log("✅ Sync complete:", data);
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
})();