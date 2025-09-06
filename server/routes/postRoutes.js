import { Router } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';

const postRoutes = Router();

postRoutes.post('/createpost', createPost);
postRoutes.get('/getallposts', getAllPosts);
postRoutes.get('/getpost/:id', getPostById);
postRoutes.put('/updatepost/:id', updatePost);
postRoutes.delete('/deletepost/:id', deletePost);

export default postRoutes;