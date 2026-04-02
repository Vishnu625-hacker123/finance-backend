const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma");
const { authorize } = require("../middleware/auth");

// ✅ Summary API
router.get("/", authorize(["ADMIN", "ANALYST"]), async (req, res) => {
  try {
    const records = await prisma.record.findMany();

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};

    records.forEach((r) => {
      if (r.type === "INCOME") {
        totalIncome += r.amount;
      } else {
        totalExpense += r.amount;
      }

      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }

      categoryTotals[r.category] += r.amount;
    });

    const netBalance = totalIncome - totalExpense;

    // ✅ Recent transactions
    const recentTransactions = await prisma.record.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryTotals,
      totalTransactions: records.length,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;