require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

//database connection
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24, //24 hours
    // },
  })
);

//static files
app.use(express.static("public"));

//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/admin"));
app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
