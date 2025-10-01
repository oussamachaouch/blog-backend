import fs from "fs/promises";
import path from "path";
import { createTranslationFile } from "../services/translationByAIService.js";

const translationsDir = path.join(process.cwd(), "translations");

// POST /translate/all?sync=
export const translateAllController = async (req, res) => {
  const { codes } = req.body;
  const sync = req.query.sync;
  try {
    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ error: "No target languages provided" });
    }

    // run all translations in parallel and wait for them to finish
    const results = await Promise.allSettled(
      codes.map(async (lang) => await createTranslationFile(lang,sync) )
    );

    // collect successes and failures
    const success = [];
    const failed = [];

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        success.push(codes[idx]);
      } else {
        failed.push({ lang: codes[idx], reason: result.reason?.message });
      }
    });

    res.json({
      message: "Translation process completed.",
      success,
      failed,
    });

  } catch (err) {

    console.error("Unexpected error in translateAllController:", err);
    res.status(500).json({ error: "Translation failed unexpectedly" });

  }
};

// GET /translate/:lang?sync=
export const getOrCreateTranslationFileController = async (req, res) => {

  const { lang } = req.params;
  const filePath = path.join(translationsDir, `${lang}.json`);
  const sync = req.query.sync;
  let data;

  try {
    if(sync === 'true' || sync === true) {
      data = await createTranslationFile(lang,sync,true);
    }else {
      // Try to read the target language file
      const res = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(res);
    }
    return res.json(data);

  } catch (err) {
    if (err.code === "ENOENT") {
      // if the file does not exist, return a waiting message
      return res.status(202).json({ message: `${lang} Translation is still running on server. Please try again later.` });
    } else {
      return res.status(500).json({ error: "Failed to read translation file" });
    }
  }
};

// // GET /api/translations/:lang
// export const getTranslationFileController = async (req, res) => {
//   const { lang } = req.params;
//   const filePath = path.join(translationsDir, `${lang}.json`);

//   try {
//     const data = await fs.readFile(filePath, "utf-8");
//     res.json(JSON.parse(data));
//   } catch (err) {
//     res.status(404).json({ error: "Translation not found" });
//   }
// };