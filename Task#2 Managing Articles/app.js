const express = require("express");
const app = express();

const articleRoutes = require("./routes/article");

const cors = require("cors");
const port = 8802;

app.use(express.json());

app.use(cors());
app.use("/articles", articleRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
