const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  const locals = {
    title: "Home",
    description: "This is the home page",
  };

  try {
    const data = await Post.find();
    res.render("index", { locals, data });
  } catch (err) {
    console.log(err);
  }
});

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building a blog1",
//       body: "This is a body of a blog1.",
//     },
//     {
//       title: "Building a blog2",
//       body: "This is a body of a blog2.",
//     },
//     {
//       title: "Building a blog3",
//       body: "This is a body of a blog3.",
//     },
//     {
//       title: "Building a blog4",
//       body: "This is a body of a blog4.",
//     },
//   ]);
// }

// insertPostData();

router.get("/post/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const data = await Post.findById({ _id: id });
    const locals = {
      title: data.title,
      description: "This is the home page",
    };

    res.render("post", { locals, data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", (req, res) => {
  const locals = {
    title: "About",
    description: "This is the home page",
  };
  res.render("about", { locals });
});

router.get("/blogs", async (req, res) => {
  const locals = {
    title: "Blogs",
    description: "This is the home page",
  };
  try {
    const data = await Post.find();
    res.render("blog", { locals, data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/contact", (req, res) => {
  const locals = {
    title: "Contact",
    email: "bk3284488@gmail.com",
    phone: "7903356447",
    whatsapp: "7903356447",
    telegram: "brpc2",
    description: "This is the home page",
  };
  res.render("contact", { locals });
});



router.get("/*", (req, res) => {
  const locals = {
    title: "404",
    description: "This is the home page",
  };
  res.render("404", { locals });
});

module.exports = router;
