const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { findOneAndUpdate } = require('../../models/Blogpost');
const Blogpost = require('../../models/Blogpost');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

/**
 * @method POST
 * @access public
 * @endpoint /api/blogposts
 **/
 router.post('/', async (req, res) => {
    const newBlogpost = new Blogpost({
      title: req.body.title,
      content: req.body.content
    });
  
    try {
      const blogpost = await newBlogpost.save();
      if (!blogpost) throw Error('Something went wrong saving the blogpost');
  
      res.status(200).json(blogpost);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });

/**
 * @method GET
 * @access public
 * @endpoint /api/blogposts
 * @param id Optional ID param in case of getting a distinct blogpost
 **/
 router.get('/:id?', async (req, res) => {
    let id = req.params.id;
    let blogposts;
    try {
        if(!id) {
            blogposts = await Blogpost.find();
        } else {
            blogposts = await Blogpost.findById(id);
      }
      if (!blogposts) throw Error('No blogposts');
  
      res.status(200).json(blogposts);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });

/**
 * @method PUT
 * @access public
 * @endpoint /api/v1/:id
 * @param id
 **/
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedBlogpost = new Blogpost({
        _id: id,
        title: req.body.title,
        content: req.body.content,
        date: Date.now()
    });
    
    try {

    await Blogpost.findByIdAndUpdate(id, updatedBlogpost);
    const newBlogpost = await Blogpost.findById(id);

    if (!newBlogpost) throw Error('Something went wrong saving the blogpost');

    res.status(200).json(newBlogpost);
    } catch (e) {
    res.status(400).json({ msg: e.message });
    }
});

/**
 * @method DELETE
 * @access public
 * @endpoint /api/v1/:id
 * @param id
 **/
 router.delete('/:id', async (req, res) => {
    try {
      const blogpost = await Blogpost.findById(req.params.id);
      if (!blogpost) throw Error('No blogpost found');
  
      const removed = await blogpost.remove();
      if (!removed)
        throw Error('Something went wrong while trying to delete the blogpost');
  
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ msg: e.message, success: false });
    }
  });

module.exports = router;
