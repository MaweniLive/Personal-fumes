const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const authController = require("../contoller/auth");

// Getting All Users

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Getting A Single User

router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users WHERE user_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Adding A User

router.post("/", (req, res) => {
  const {
    email,
    password,
    fullname,
    userpassword,
    userRole,
    phonenumber,
    joinDtae,
    cartText,
  } = req.body;
  try {
    con.query(
      `INSERT INTO users (email,password,fullname,userpassword,userRole,phonenumber,joinDtae,cartText) 
      VALUES
    ('${email}','${password}','${fullname}','${userpassword}','${userRole}','${phonenumber}','${joinDtae}','${cartText}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Editing A User

router.put("/:id", (req, res) => {
  const {
    email,
    password,
    fullname,
    userpassword,
    userRole,
    phonenumber,
    joinDtae,
    cartText,
  } = req.body;

  try {
    con.query(
      `UPDATE users SET email='${email}', password='${password}', fullname='${fullname}',
       userpassword='${userpassword}', userRole='${userRole}',
        phonenumber='${phonenumber}', joinDtae='${joinDtae}', cartText='${cartText}' WHERE user_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Deleting A User

router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM users WHERE user_id = ${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;

// Password Encryption

const bcrypt = require("bcryptjs");
const { request } = require("express");

// Register Route

router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

// Login Route

const jwb = require("jsonwebtoken");

router.post("/login", (req, res) => {
  return authController.Login(req, res);
});

// Verify Route

router.get("/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ msg: "Unauthorised Access!" });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

const middleware = require("../middleware/auth");

router.get("/", middleware, (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
