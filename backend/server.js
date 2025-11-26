require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// If the app runs behind a proxy (Railway, Heroku, Vercel, etc.),
// enable trust proxy so `req.protocol` reflects the original request
// protocol (useful when building absolute URLs like image links).
app.set('trust proxy', true);

// Middleware
app.use(cors({
    // correct option name is `origin` (not `origins`).
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

// server uploads folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global error handler (catches multer and other errors) - returns JSON for client
app.use((err, req, res, next) => {
    console.error('Error handler:', err && err.message ? err.message : err);
    const statusCode = err && err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        message: err && err.message ? err.message : 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});