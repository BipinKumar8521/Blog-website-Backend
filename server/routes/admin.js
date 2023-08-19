const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

//check login
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.redirect("/login");
  }
};

router.get("/login", (req, res) => {
  const locals = {
    title: "Login",
    description: "This is the home page",
  };
  res.render("admin/login", { locals });
});

router.get("/register",authMiddleware, (req, res) => {
  const locals = {
    title: "Register",
    description: "This is the home page",
  };
  res.render("admin/register", { locals });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      res.redirect("/login");
    } catch (error) {
      if (error.code === 11000) {
        res.send("That username is already in use");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.send("User not found");
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie("jwt", token, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.redirect("/dashboard");
    } else {
      res.send("Password incorrect");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  const locals = {
    title: "Dashboard",
    description: "This is the home page",
  };

  try {
    const data = await Post.find();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.get("/create", authMiddleware, (req, res) => {
  const locals = {
    title: "Create",
    description: "This is the home page",
  };
  res.render("admin/create", { locals, layout: adminLayout });
});

router.get("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "This is the home page",
    };
    let id = req.params.id;
    const data = await Post.findById({ _id: id });
    res.render("admin/edit", { locals, data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title,
        body,
        updatedAt: Date.now(),
      }
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  await Post.findByIdAndDelete({ _id: req.params.id });
  res.redirect("/dashboard");
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    console.log(req.body);
    Post.insertMany([
      {
        title,
        body,
      },
    ]);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

module.exports = router;
