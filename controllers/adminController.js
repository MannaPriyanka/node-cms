const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const { isEmpty } = require('../config/customFunctions');
module.exports = {
    index: (req, res) => {
        res.render('admin/index');
    },
    getPosts: (req, res) => {
        Post.find()
            .lean()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', { posts: posts })
            });
    },
    submitPosts: (req, res) => {
        const allowcomments = req.body.allowComments ? true : false;

        // Check for any input file
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            // console.log(`/uploads/${filename}`);

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }
        let filepath = `/uploads/${filename}`;

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: allowcomments,
            category: req.body.category,
            file: filepath,

        });
        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message', 'Post Created Successfully.');
            res.redirect('/admin/posts');
        });

    },
    createPosts: (req, res) => {
        Category.find()
            .lean()
            .then(cats => {
                res.render('admin/posts/create', { categories: cats });
            })
    },
    editPost: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .lean()
            .then(posts => {
                Category.find().lean().then(cats => {
                    res.render('admin/posts/edit', { posts: posts, categories: cats });

                })
            });
    },
    editPostUpdateRoute: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            // console.log(`/uploads/${filename}`);

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }
        let filepath = `/uploads/${filename}`;

        const id = req.params.id;

        Post.findById(id)
            .then(post => {

                post.title = req.body.title;
                post.status = req.body.status;
                post.file = filepath;
                post.allowComments = commentsAllowed;
                post.description = req.body.description;
                post.category = req.body.category;


                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');

                });
            });

    },
    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(deletePost => {
                req.flash('success-message', `The post ${deletePost.title} has been deleted.`);
                res.redirect('/admin/posts');
            })
    },

    /* Categories*/
    getCategories: (req, res) => {

        Category.find().lean().then(cats => {
            res.render('admin/category/index', { categories: cats });
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        if (categoryName) {
            const newCategory = new Category({
                title: categoryName,
            });
            newCategory.save().then(category => {
                res.status(200).json(category);
            });

        }
    },
    editCategoriesRoute: async (req, res) => {
        const catId = req.params.id;
        const cats = await Category.find().lean();
        Category.findById(catId).lean().then(cat => {
            res.render('admin/category/edit', { category: cat, categories: cats })
        })
    },
    getComments: (req, res) => {
        Comment.find()
            .lean()
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', { comments: comments })
            })
    },
    approveComment:(req,res)=>{
        const commentApprove = req.body.approveComments ? true : false;
        const id = req.params.id;
        Comment.findById(id)
        .then(comment => {
            comment.commentIsApproved = commentApprove;
            comment.save().then(commentApprove => {
                req.flash('success-message', 'Comment Approved!');
                res.redirect('../../admin/comment');

            });
        })

    }
};

/*alternate mthod of lean() for error:Handlebars: Access has been denied to resolve the property "title" because it is not an "own property" of its parent.*/
                // const post = {
                //     posts: posts.map(posts => {
                //         return {
                //             _id: posts._id,
                //             title: posts.title,
                //             status: posts.status,
                //             description: posts.description,
                //             allowComments: posts.allowComments,
                //             category: posts.categories,
                //         }
                //     })

                // }