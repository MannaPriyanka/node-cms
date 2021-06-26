module.exports = {
    mongodbUrl : 'mongodb+srv://Demo:demo@cluster0.2fn8e.mongodb.net/node_cms?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    globalvariables:(req,res,next)=>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message =req.flash('error-message');
        res.locals.user = req.user || null;
        next();
    }
};
