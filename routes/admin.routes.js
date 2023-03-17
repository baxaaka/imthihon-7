//ADMIN ROUTE
const express = require("express");

const adminRoutes = express();

// PROJEKTKA YANGI QUSHILGAN NARSANI KOMENT OLDIDA -- # -- QUSHIP KETTIM

//# Joinni quship quyamiz , validationga kerak buladi
const Joi = require("joi");

// #Cookie parser

const cookie = require("cookie-parser");

// bcrypt

const bcrypt = require("bcrypt");

// jwt

const jwt = require("jsonwebtoken");

//# File upload - file ni qoshish , chaqiramiz
const fileUpload = require("express-fileupload");

//# File upload -medilware- , parse body

adminRoutes.use(fileUpload());
adminRoutes.use(express.json());
adminRoutes.use(express.text());
adminRoutes.use(express.urlencoded({ extended: true }));

// # UUID
const { v4: uuid } = require("uuid");

// MODELS  CHAQIRB OLAMIZ
const Io = require("../utils/Io");
const Valid = require("../models/validation");
const User = require("../models/user.js");
const Book = require("../models/book.js");
const { json, text, urlencoded } = require("express");

// JSONLARNI CHAQIRIB YANGI NEW  OCHAMIZ
const Users = new Io("./db/users.json");
const Valids = new Io("./db/validation.json");
const Books = new Io("./db/books.json");
const imageUpload = new Io("./db/imageUpload.json");

//ADMIN GET METHOD

// adminRoutes.get("/", async (req, res) => {
//   try {
//     const users = await Users.read();

//     const admins = users.filter((user) => {
//       if (user.isAdmin) {
//         return user;
//       }
//     });

//     res.status(200).json({ admins });
//   } catch (error) {
//     console.log(error);
//   }
// });

// ADMIN POST METHOD

// adminRoutes.post("/admin/add", async (req, res) => {
//   const { name, money, age, email } = req.body;

//   const users = await Users.read();

//   const id = (users[users.lenght - 1]?.id || 0) + 1;

//   const newUser = new User(id, name, true, money, age, email);

//   const allUsers = users.lenght ? [...users, newUser] : [newUser];

//   Users.write(allUsers);

//   console.log(allUsers);

//   res.status(200).json({ message: "ok" });
// });

// Validation
// adminRoutes.post("/validation", async (req, res) => {
//   //# VALIDATION

//   const { name, age, email } = req.body;

//   const scheme = Joi.object({
//     name: Joi.string().min(3).max(15).required(),
//     // age : Joi.number().min(7).max(99).required(),
//     email: Joi.string().email().required(),
//   });

//   const { error } = scheme.validate({ name, email });

//   if (error) return res.status(400).json({ message: error.message });

//   res.status(200).json({ name, email });

//   const val = await Valids.read();

//   const idV = (val[val.lenght - 1]?.id || 0) + 1;

//   const newValid = new Valid(idV, name, age, email);

//   const allValids = val.lenght ? [...val, newValid] : [newValid];

//   Valids.write(allValids);
// });

adminRoutes.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await Users.read();
    const scheme = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error } = scheme.validate(req.body);
    const id = (users[users.length - 1]?.id || 0) + 1;
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new User(id, username, hashedPass);
    const allUser = users.length ? [...users, newUser] : [newUser];

    const token = jwt.sign(newUser.username, process.env.Secret_Key);

    res.cookie("token", token);

    if (error) {
      throw error;
    }

    Users.write(allUser);

    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
});

adminRoutes.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await Users.read();
    const user = users.find(
      (el) => el.username.toLowerCase() == username.toLowerCase()
    );

    if (!user) {
      return res.redirect("/register");
    }

    const verified = await bcrypt.compare(password, user.password);
    if (!verified) {
      return res.redirect("/register");
      // console.log("bad login");
    } else {
      return res.redirect("/home");
      // console.log("nice login");
    }
  } catch (error) {
    console.log(error.message);
  }
});

// ----blogggg------------------------

adminRoutes.get("/home", async (req, res) => {
  try {
    const book = await Books.read();

    // const admins = book.filter((bk) => {
    //   if (bk.isAdmin) {
    //     return bk;
    //   }
    // });

    res.status(200).json({ book });
  } catch (error) {
    console.log(error);
  }
});

//blog  post
adminRoutes.post("/home", async (req, res) => {

  
  
  const {name, text  } = req.body;



  const book = await Books.read();

  const id = (book[book.length - 1]?.id || 0) + 1;


  console.log(allUsers);

  res.status(200).json({ message: "ok" });

  // # FILE-UPLOAD

  const file = req.files.file;

  //# UUID

  const format = file.mimetype.split("/")[1];

  const imageName = `${uuid()}.${format}`;
  const path = `${process.cwd()}/upload/${imageName}`;

  // # mv - bu file ni upload qilip beradi
  file.mv(path);

  // const imageUp = await imageUpload.read()

  // Books.write({ imageName });

  //  imageName.push(allUsers)

  console.log(path);

  const newUser = new Book(id, name, text  , path );

  const allUsers = book.length ? [...book, newUser ] : [newUser];

  Books.write(allUsers);

  res.status(200).json({ message: "ok keldi" });
});

module.exports = adminRoutes;
