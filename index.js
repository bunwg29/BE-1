// Express
const express = require("express");
const path = require('path');

// Use for get data of body
const methodOverride = require("method-override");
const bodyParser = require("body-parser");


const cookieParser = require("cookie-parser");
const session = require("express-session");

// Use for display toast
const flash = require("express-flash");

// Env
require('dotenv').config()

// Config routes
const route = require("./routes/clients/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");

database.connect();

const app = express();

const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-unlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


// Flash

app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());   

// End Flash

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App Locals Variables

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static(`${__dirname}/public`));

// End App Locals Variables

//Routes

route(app);
routeAdmin(app);

// End Routes

app.listen(port, () => {
    
    console.log(`App listening on port ${port}`);
    
});