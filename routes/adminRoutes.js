const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isUserAuthenticated } = require('../config/customFunctions');

router.all('/*', isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'admin';
    next();
})

router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts)

router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostUpdateRoute);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

router.route('/category')
    .get(adminController.getCategories);

router.route('/category/create')
    .post(adminController.createCategories);

router.route('/category/edit/:id')
    .get(adminController.editCategoriesRoute)

router.route('/comment')
    .get(adminController.getComments)

router.route('/approvecomment/:id')
    .post(adminController.approveComment)
    
module.exports = router;