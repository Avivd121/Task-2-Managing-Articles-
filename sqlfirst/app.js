const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");
const articleRoutes = require("./routes/article");

const cors = require("cors");
const port = 8802;

app.use(express.json());

app.use(cors());
app.use("/users", userRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/articles", articleRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
