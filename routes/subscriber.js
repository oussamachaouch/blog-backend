import express from 'express';
import { getSubscribers, addSubscriber, getSubscriberById, updateSubscriber, unsubscribe } from '../controller/subscribersController.js';

const router = express.Router();

router.route('/subscribe').get(getSubscribers).post(addSubscriber);
router.route('/unsubscribe/:token').get(unsubscribe);
router.route('/subscribe/:id').get(getSubscriberById).put(updateSubscriber);

export default router;