const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

//Get all product
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//Get a single product
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users WHERE product_id = ${req.params.id}`,
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

//Insert a new product
router.post("/", (req, res) => {
  const {
    sku,
    name,
    price,
    weight,
    descriptions,
    thumbnail,
    image,
    category,
    create_date,
    stock,
  } = req.body;
  try {
    con.query(
      `INSERT INTO products (sku, name, price, weight, descriptions, thumbnail, image, category, create_date, stock) 
      values 
      ('${sku}', '${name}', '${price}', '${weight}','${descriptions}', '${thumbnail}', '${image}', '${category}', '${create_date}', '${stock}' ) `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
