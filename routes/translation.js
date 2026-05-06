import express from 'express';
import { getOrCreateTranslationFileController, translateAllController } from '../controller/translationController.js';

const router = express.Router();

// Generate translations dynamically
router.post('/all', translateAllController);

// Only GET, always uses en.json as source
router.get('/:lang', getOrCreateTranslationFileController);

export default router;