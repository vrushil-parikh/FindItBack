// NOTE
// Post model updated for category, image URLs, and createdBy now we just have to fetch user details automatic and store images with URLs.


import Post from '../models/post.js';

// Create a new post

export const createPost = async (req, res)=>{
    try{
    const post=new Post(req.body);
        await post.save();

        res.status(201).json(post);
    }catch(err){
        res.status(400).json({error: err.message});
        console.error("Error creating post:", err);
    }
};

export const getAllPosts = async (req,res)=>
{
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    }
    catch(err){
        res.status(400).json({error: err.message});
        console.error("Error fetching posts:", err);
    }
};

export const getPostById = async (req,res)=>{
    try{
        const post = await Post.findOne({postId: req.params.id});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json(post);
    }
    catch(err){
        res.status(400).json({error: err.message});
        console.error("Error fetching post:", err);
    }
};

export const updatePost = async (req,res)=>{
    try{
        const post = await Post.findOneAndUpdate({postId: req.params.id}, req.body, {new: true});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json(post);
    }
    catch(err){
        res.status(400).json({error: err.message});
        console.error("Error fetching post:", err);
    }
};

export const deletePost = async (req,res)=>{
    try{
        const post = await Post.findOneAndDelete({postId: req.params.id});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        res.status(200).json({message:"Post deleted successfully"});
      
    }  catch(err){
            res.status(400).json({error:err.message});
            console.error("Error deleting post:", err);
        }
};