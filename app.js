const { globalvariables } = require('./config/configuration');
const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path');
const hbs = require('express-handlebars');
const { mongodbUrl, PORT } = require('./config/configuration');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const { selectOption } = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const helper = require('handlebars-helpers');

/* config mongoose*/
mongoose.connect(mongodbUrl,
    { useNewUrlParser: true }).then(response => {
        console.log("MongoDB Connected Successfully");
    }).catch(err => {
        console.log("Database connection failed");
    });

/* config express*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/*Flash and session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

app.use(globalvariables);
/*file upload */
app.use(fileUpload());

/* setup view engine*/
app.engine('handlebars', hbs({ defaultLayout: 'default', helpers: { select: selectOption } }));

app.set('view engine', 'handlebars');

/*Method override middleware*/
app.use(methodOverride('newMethod'));

const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});
