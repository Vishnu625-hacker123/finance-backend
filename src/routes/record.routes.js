const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authorize } = require("../middleware/auth");

// ✅ Create record (ONLY ADMIN allowed + VALIDATION)
router.post("/", authorize(["ADMIN"]), async (req, res) => {
  try {
    const { amount, type, category, date, notes, userId } = req.body;

    // 🔒 Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    if (!type || !["INCOME", "EXPENSE"].includes(type)) {
      return res.status(400).json({ error: "Type must be INCOME or EXPENSE" });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        date: parsedDate,
        notes,
        userId,
      },
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Get records with FILTERING (ADMIN + ANALYST)
router.get("/", authorize(["ADMIN", "ANALYST"]), async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const records = await prisma.record.findMany({
      where: {
        type: type || undefined,
        category: category || undefined,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: { user: true },
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;