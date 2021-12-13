const express = require('express');
const router = express.Router();
const { getBlogs , getBlogById , addBlog , updateBlog , deleteBlog } = require('../controller/blogController');


router
    .route('/')
    .get(getBlogs)
    .post(addBlog)

router
    .route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog)


module.exports = router;