const Blog = require('../models/blogModel');

const getBlogs = (req,res) => {
    Blog.find()
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        res.status(404).send("Blogs not found");
    })
}


const getBlogById = (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
        res.status(404).send("Blog not found");
    })
}

const addBlog = (req,res) => {
    Blog.create(req.body)
        .then((result) => {
            res.send("blog created");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("Error creating blog");
        })
}

const updateBlog = async (req,res) => {
    const id = req.params.id;
    try {
        await Blog.findByIdAndUpdate(id,req.body)
       const result = await Blog.findById(id);
       return res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send("Error updating blog");
    }
   

}

const deleteBlog = (req,res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(()=> {
        res.send('Blog deleted');
    })
    .catch((err) => {
        console.log(err);
        res.status(400).send("Error deleting blog");
    })
}

module.exports = {
    getBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog
}

