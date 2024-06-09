const express = require("express");

// Converse lại biến trong form để truyền vào body
const bodyParser = require("body-parser");

// Thêm các phương thức khác
const methodOverride = require("method-override");

// Thông báo
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// TinyMCE
const path = require('path');

// ENV
require("dotenv").config();

// Kết nối database
const database = require("./config/database");
database.connect();

// Import file System
const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

// Cấu hình PUG
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Flash
app.use(cookieParser("huyen"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Dùng được file tĩnh
app.use(express.static(`${__dirname}/public`));

// Dùng đè phương thức
app.use(methodOverride("_method"));

// Converse lại biến trong form để truyền vào body
app.use(bodyParser.urlencoded({ extended: false }));

// Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
