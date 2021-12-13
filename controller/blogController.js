const Blog = require('../models/blogModel');

const getBlogs = (req,res) => {
    Blog.find()
    .then(result => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
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
    })
}

const addBlog = (req,res) => {
    Blog.create(req.body)
        .then((result) => {
            res.send("blog created");
        })
        .catch((err) => {
            console.log(err);
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
    })
}

module.exports = {
    getBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog
}

