import express from 'express';
import { getBlogs, getBlogById, addBlog, updateBlog, deleteBlog } from '../controller/blogController.js';

const router = express.Router();

router.route('/').get(getBlogs).post(addBlog);
router.route('/:id').get(getBlogById).put(updateBlog).delete(deleteBlog);

export default router;