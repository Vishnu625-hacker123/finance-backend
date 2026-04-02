const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await prisma.user.create({
      data: { name, email, role },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

module.exports = router;