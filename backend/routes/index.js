const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');

const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');

// testing a route

router.get('/test', (req, res) => res.json({
    msg: 'Working!'
}));

// userRouter

// signup
router.post('/register', authController.register);
// login
router.post('/login', authController.login);
// logout
router.post('/logout', auth, authController.logout);
// refresh JWT
router.get('/refreshJWT', authController.refresh);

// blogRouter

// CRUD
// 'auth' middleware for protective route

// create blog
router.post('/blog', auth, blogController.create);

// get all blogs
router.get('/blog/all', auth, blogController.getAll);

// get blog by id
router.get('/blog/:id', auth, blogController.findOne);

// update blog
router.put('/blog', auth, blogController.update);

//delete blog
router.delete('/blog/:id', auth, blogController.delete);

// commentRouter

// create comment
router.post('/comment', auth, commentController.create);

// get all comments

// get comment by Blog id (blog id to fetch all the comments on that blog)
router.get('/comment/:id', auth, commentController.findOne);

// // update comments
// router.put('/comment', auth, commentController.update);

// // delete comments
// router.delete('/comment', auth, commentCOntroller.delete);

module.exports = router;