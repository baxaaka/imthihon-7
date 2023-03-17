const express = require("express");

const app = express();
const adminRoutes = require("./routes/admin.routes.js");
// const bookRoutes = require("./routes/book.routes.js");

// PORT
require("dotenv").config();
const PORT = process.env.PORT;

// ROUTES LARNI ISHLATAMIZ
app.use(express.json());
app.use("/", adminRoutes);


app.listen(PORT, () => {
  console.log(`SERVER ${PORT} CHI PORTDA ISHLAMOQDA `);
});

