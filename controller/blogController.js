const Blog = require('../models/blogModel');
const subscriber = require('../models/subscribersModel');
const { sendBlogEmail } = require('../config/mailer');

const getBlogs = async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;   // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default limit = 10
        const skip = (page - 1) * limit;
        const total = await Blog.countDocuments(); // get total number of blogs
        Blog.find()
            .sort({createdAt: -1}) // sort by createdAt in descending order
            .skip(skip)
            .limit(limit)
        .then(result => {
            res.json({
                data: result,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            });
        })
        .catch((err) => {
            res.status(404).send("Blogs not found");
        })
    }catch (error) {
        res.status(500).send("Internal Server Error");
    }
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

const addBlog = async (req,res) => {

    try{
        const blog = req.body;
        if (typeof blog.spread !== 'string') {
            return res.status(400).send("Field 'spread' must be a string.");
        }
        
        // 1. Add blog to MongoDB
        Blog.create(blog);

        
        if(blog.spread === "true"){

            // 2. Get active subscribers from MongoDB if spread is true
            const subscribers = await subscriber.find({ status: "subscribed" });

            if (!subscribers.length) {
                return res.status(400).json("No active subscribers.");
            }


            // 3. Send blog email to each subscriber
            await sendBlogEmail(subscribers, blog, `http://localhost:3001/unsubscribed/`);

            res.status(201).send("Blog added and sent to subscribers!");
        }else{
            res.status(201).send("Blog added!");
        }

        
    }
    catch (error) {
        console.error("Error adding blog:", error.response?.body || error);
        res.status(400).send("Error adding blog");
    }
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

