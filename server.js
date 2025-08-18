require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
const collegeRoutes = require('./routes/colleges');

app.use(cors({
  origin: [
    'http://localhost:5173', // local dev
    'https://vercel-frontend-ltqb.vercel.app' // deployed frontend https://vercel-frontend-ltqb.vercel.app/
  ],
  credentials: true
}));

app.use(express.json());

connectDB();

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use('/api/colleges', collegeRoutes);

app.use("/api/users", require("./routes/users"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/posts', require('./routes/posts'));

// app.use('/api/resumes', require('./routes/resumeRoutes')); // ✅ For RESUME


// Seed colleges if none exist (optionally run only once)
const College = require("./models/College");
app.get("/api/seed", async (req, res) => {
  const count = await College.countDocuments();
  if (count === 0) {
    await College.insertMany([
      { name: "IIT Delhi", domain: "iitd.ac.in" },
      { name: "IIT Bombay", domain: "iitb.ac.in" },
      { name: "IIT Madras", domain: "iitm.ac.in" },
      { name: "VIT Vellore", domain: "vitv.ac.in" },
      { name: "VIT Bhopal", domain: "vitb.ac.in" },
      { name: "VIT Chennai", domain: "vitc.ac.in" },
      { name: "NIT Trichy", domain: "nitt.ac.in" },
      { name: "NIT Bhopal", domain: "nitb.ac.in" }
    ]);
    res.send("Seeded colleges!");
  } else res.send("Already seeded");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
