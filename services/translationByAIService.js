import { InferenceClient } from "@huggingface/inference";
import fs from "fs/promises";
import path from "path";

// Initialize Hugging Face client
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY.trim());
const translationsDir = path.join(process.cwd(), "translations");

function extractTexts(obj, pathArr = []) {
  const texts = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      texts.push(...extractTexts(value, [...pathArr, key]));
    } else if (typeof value === "string") {
      texts.push({ path: [...pathArr, key], original: value });
    }
  }
  return texts;
}

function applyTranslations(obj, translations) {
  for (const { path, translated } of translations) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = translated;
  }
}

export const helsinkiLangMap = {
  en: "en",
  fr: "fr",
  es: "es",
  it: "it",
  de: "de",
  ar: "ar",
  zh: "zh",
  ru: "ru",
  ja: "jap",
  hi: "hi",
  sv: "sv",
  sk: "sk",
  id: "id",
  da: "da",
  el: "el",
  fi: "fi",
  he: "he",
  hu: "hu",
  ml: "ml",
  mul: "mul",
  ro: "ro",
  uk: "uk",
  ur: "ur",
  vi: "vi",
};

// @huggingface Helsinki-NLP/opus-mt-en-* AI translation method
async function translateUsingHelsinki(text, targetLanguage) {
    // Use Hugging Face translation model (NLLB-200)
  const model = `Helsinki-NLP/opus-mt-en-${helsinkiLangMap[targetLanguage]}`;
  try {
    const result = await hf.translation({ model, inputs: text });
    return result;
  } catch (error) {
    console.error("////////////////////// Translation error (Helsinki-nlp):", error ," //////////////////////");
    throw new Error("///////////////////// Translation service failed /////////////////////");
  }
}

// @huggingface facebook/nllb-200-3.3B AI translation method
async function translateUsingNllb(text, targetLanguage) {
  const model = `facebook/nllb-200-3.3B`;
  try {
  const result = await hf.translation({
    model: model,
    inputs: text,
    parameters: {
      src_lang: "eng_Latn",
      tgt_lang: nllbLangMap[targetLanguage] || "eng_Latn",
    }
  });
    return result;
  } catch (error) {
    console.error("////////////////////// Translation error (Hugging Face):", error ," //////////////////////");
    throw new Error("///////////////////// Translation service failed /////////////////////");
  }
}

// retry logic with exponential backoff
async function translateWithRetry(inputs, targetLanguage, retries = 3, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await translateUsingHelsinki(inputs, targetLanguage);
      //return await translateUsingNllb(inputs, targetLanguage);
      
    } catch (err) {
      console.error(`///////////////////// ❌ Translation failed (attempt ${attempt}):`, err.message," /////////////////////");
      if (attempt < retries) {
        console.warn(`/////////////////// ⏳ Retrying in ${delay / 1000}s... ///////////////////`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err; // rethrow after final attempt
      }
    }
  }
}

// process requests in small batches (6 at a time) to avoid rate limits
// async function processInBatches(items, batchSize, processor) {
//   const results = [];
//   for (let i = 0; i < items.length; i += batchSize) {
//     const batch = items.slice(i, i + batchSize);
//     const batchResults = await Promise.all(batch.map(processor));
//     results.push(...batchResults);
//   }
//   return results;
// }

// process requests (corrected by gpt) in small batches (6 at a time) to avoid rate limits
async function processInBatches(items, batchSize, fn) {
  const results = new Array(items.length); // To store translations in correct order
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex], currentIndex);
    }
  }

  // Create workers (limit concurrency)
  const workers = Array(Math.min(batchSize, items.length))
    .fill(null)
    .map(worker);

  await Promise.all(workers);
  return results;
}

// timeout wrapper if connection with server hangs forever
// async function withTimeout(promise, ms) {
//   let timer;
//   return Promise.race([
//     promise,
//     new Promise((_, reject) => {
//       timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
//     }),
//   ]).finally(() => clearTimeout(timer));
// }

/**
 * Translate multiple strings to a target language using Hugging Face
 * @param {object} jsonObj - JSON object to translate
 * @param {string} targetLanguage - Target language code (e.g., "fr" for French)
 * @returns {Promise<object>} - Translated JSON object
 */
export async function translateBatch(jsonObj, targetLanguage) {
  const textsToTranslate = extractTexts(jsonObj);

  //let translatedArray = [];
  if (textsToTranslate.length > 0) {
    try {
      console.warn(`/////////////////// start translating by AI for ${targetLanguage} ///////////////////`)

      // Run all translation requests in parallel
      //   const results = await Promise.all(
      //   textsToTranslate.map((t) =>
      //     hf.translation({ model, inputs: t.original })
      //       .then((res) => res.translation_text)
      //       .catch((err) => {
      //         console.error(`❌ Failed to translate "${t.original}" -> using fallback`, err);
      //         return t.original; // fallback: return original text
      //       })
      //   )
      // );

      // Run Batches by chunks to avoid rate limits
      const results = await processInBatches(
        textsToTranslate,
        5, // max 5 requests at a time
        async (t) => {
          console.log(`🔤 Translating "${t.original}" -> ${targetLanguage}`);
          return await translateWithRetry(t.original, targetLanguage).then((res) => res.translation_text)
        }
      );


      // old way - sequential
      // for (const t of textsToTranslate) {
      //   const result = await hf.translation({
      //     model: model,
      //     inputs: t.original,
      //   });
      //   translatedArray.push(result.translation_text);
      // }

      // Build final translations array
      const translations = textsToTranslate.map((t, idx) => ({
        path: t.path,
        translated: results[idx] || t.original,
      }));

      // Mutate original object with translations
      applyTranslations(jsonObj, translations);

      console.warn("/////////////////// translating by AI done ✅ ///////////////////")

      return jsonObj;

    } catch (error) {
      console.error("Translation error (Hugging Face):", error);
      throw new Error("Translation service failed");
    }
  }
}

export async function createTranslationFile(targetLanguage, sync = false, returnJson = false) {
  const filePath = path.join(translationsDir, `${targetLanguage}.json`);
  const enFilePath = path.join(translationsDir, "en.json");
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 5000;
  const fileExists = await checkTranslationFileExists(targetLanguage);

  if(!fileExists || sync) {  
    let lastError;
    console.warn('/////////////////////////// Creating translation file for ===> ', targetLanguage," ////////////////////////////");

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const enData = await fs.readFile(enFilePath, "utf-8");
        const enJson = JSON.parse(enData);
        const translatedJSON = await translateBatch(enJson, targetLanguage);

        await fs.mkdir(translationsDir, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(translatedJSON, null, 2));

        console.warn(`/////////////////////////// ${targetLanguage} translation completed ✅ /////////////////////////////`);

        if (returnJson) return translatedJSON;
        return true;

      } catch (translateErr) {

        lastError = translateErr;
        console.error(`Attempt ${attempt} failed for ${targetLanguage}:`, translateErr);

        if (attempt < MAX_RETRIES) {
          await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
      }
    }

    throw new Error(
      `Translation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
    );
  } else{
    console.log(`Translation file for ${lang} already exists, skipping...`);
  }

}

async function checkTranslationFileExists(lang) {
  const filePath = path.join(translationsDir, `${lang}.json`);
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}