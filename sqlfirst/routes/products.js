const dbSingleton = require("../dbSingleton");

const express = require("express");
const router = express.Router();

// Execute a query to the database
const db = dbSingleton.getConnection();

router.get("/", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    console.log(results);
    res.json(results);
    res.json(["results"]);
  });
});

router.post("/", (req, res) => {
  const {
    Supplier_Name,
    Category,
    Product_Name,
    Price,
    Quantity,
    Expiration_Date,
  } = req.body;

  const query =
    "INSERT INTO products (Supplier_Name, Category, Product_Name, Price, Quantity, Expiration_Date) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [Supplier_Name, Category, Product_Name, Price, Quantity, Expiration_Date],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "Product added!", id: results.insertId });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "User deleted! " });
  });
});

module.exports = router;
