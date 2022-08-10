//login
//register
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const con = require("../lib/dbConnection");
require("dotenv").config();

async function Login(req, res) {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        // Decryption
        const isMatch = await bcrypt.compare(
          req.body.userpassword,
          result[0].userpassword
        );
        // If password !== (does not match)
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          // res.send(result);

          // The information should be stored inside the token
          const payload = {
            user: {
              user_id: result[0].user_id,
              fullname: result[0].fullname,
              email: result[0].email,
              userRole: result[0].userRole,
              phonenumber: result[0].phonenumber,
              joinDtae: result[0].joinDtae,
              cartText: result[0].cartText,
            },
          };

          // Creating a token and setting an expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function Register(req, res) {
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

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    con.query(
      `INSERT INTO users (fullname,email,userpassword,userRole,
        phonenumber,joinDtae,cartText)
       VALUES 
       ('${fullname}','${email}','${hash}','${userRole}','${phonenumber}',
       '${joinDtae}','${cartText}','${userpassword}')`,
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`User ${(fullname, email)} created successfully`);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = {
  Login,
  Register,
};
