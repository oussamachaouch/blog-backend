const express = require("express");
const {getOrCreateTranslationFileController, translateAllController} = require("../controller/translationController");

const router = express.Router();

// Generate translations dynamically
router.post("/all", translateAllController);

// Only GET, always uses en.json as source
router.get("/:lang", getOrCreateTranslationFileController);

// Serve existing translation file
// router.get("/translations/:lang", getTranslationFileController);


// Test endpoint to verify Hugging Face API connectivity
// router.get('/', (req, res) => {
//     const response = testHFApi();
//     res.send('Translation service is running');
// });

module.exports = router;