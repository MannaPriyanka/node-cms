const Post = require('../models/PostModel').Post;
const User = require('../models/UserModel').User;
const Comment = require('../models/CommentModel').Comment;
const Category = require('../models/CategoryModel').Category;
const bcrypt = require('bcryptjs');

module.exports = {
    index: (req, res) => {
        Post.find()
            .lean()
            .then(posts => {
                Category.find().lean().then(cats => {
                    res.render('default/index', { posts: posts, categories: cats });

                })
            });

    },
    loginGet: (req, res) => {
        res.render('default/login');
    },
    loginPost: (req, res) => {
        res.send('Congratulations , you have successfully submitted data!')
    },
    resgisterGet: (req, res) => {
        res.render('default/register');
    },
    resgisterPost: (req, res) => {
        let error = [];
        if (!req.body.firstName) {
            error.push({ message: 'First Name is mandatory' })
        }
        if (!req.body.lastName) {
            error.push({ message: 'last Name is mandatory' })
        }
        if (!req.body.email) {
            error.push({ message: 'Email is mandatory' })
        }
        if (!req.body.password) {
            error.push({ message: 'Password is mandatory' })
        }
        if (!req.body.passwordConfirm) {
            error.push({ message: 'Confirm password is mandatory' })
        }
        if (req.body.passwordConfirm !== req.body.password) {
            error.push({ message: 'Password does not match' })
        }
        if (error.length > 0) {
            res.render('default/register', {
                error: error,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },
    singlePost: (req, res) => {
        const id = req.params.id;
        Post.findById(id).lean()
        .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
        .then(post => {
            if (!post) {
                res.status(404).json({ message: 'No Post Found' })
            }
            else {
                //res.status(200).json(post);
                res.render('default/singlePost', { post: post,comments: post.comments })

            }

        })
    },

    submitComment: (req, res) => {
        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                })
                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success-message', 'Commented Successfully!')
                        res.redirect(`/post/${post._id}`)
                    })
                })
            })
        }
        else {
            req.flash('error-message', 'Login First to Comment')
            res.redirect('/login')
        }
    },
   

};