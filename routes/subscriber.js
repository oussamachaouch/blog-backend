const express = require('express');
const router = express.Router();
const { getSubscribers, addSubscriber, getSubscriberById, updateSubscriber, unsubscribe } = require('../controller/subscribersController');

router
    .route('/subscribe')
    .get(getSubscribers)
    .post(addSubscriber)

router
    .route('/unsubscribe/:token')
    .get(unsubscribe)

router
    .route('/subscribe/:id')
    .get(getSubscriberById)
    .put(updateSubscriber)

module.exports = router;