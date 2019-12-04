const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", auth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        question: req.body.question,
        imagePath: url + '/images/' + req.file.filename,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        correctAns: req.body.correctAns
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added!',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
});

router.get("", auth, (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then((documents) => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.json({
            message: 'Posts fetched successfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    });
});

router.get("/:id", auth, (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(200).json({ message: 'Post not found!' });
        }
    });
});

router.put("/:id", auth, multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        question: req.body.question,
        imagePath: imagePath,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        correctAns: req.body.correctAns
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Update successful!"
        });
    })
})

router.delete("/:id", auth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(req.params.id);
        res.status(200).json({
            message: "post deleted!"
        });
    });
});

module.exports = router;