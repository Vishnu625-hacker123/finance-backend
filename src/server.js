const express = require("express");
const app = express();

const userRoutes = require("./routes/user.routes");
const recordRoutes = require("./routes/record.routes");
const summaryRoutes = require("./routes/summary.routes");

app.use(express.json());

// Fake logged-in user
app.use((req, res, next) => {
  req.user = {
    id: 1,
    role: "ADMIN",
  };
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/summary", summaryRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});