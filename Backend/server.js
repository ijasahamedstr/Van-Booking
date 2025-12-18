// Import required modules
import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import AccountAdminloginrouter from './routes/AccountLogin.route.js';
import AccountAdminrouter from "./routes/AccountRegisterAdmin.route.js";
import Inquirysection from "./routes/Inquiry.route.js";
import Slidersection from "./routes/Slidersection.route.js";
import Categorysection from "./routes/Categories.route.js";
import Requestrouter from "./routes/Request.route.js";

// Create an instance of Express
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    origin: [
      "https://van-booking-booking.vercel.app",
      "https://van-booking-rho.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//ADMIN -> MIDDLEWARE -> SERVER
app.use('/Adminlogin', AccountAdminloginrouter);
app.use('/Adminregister',AccountAdminrouter);
app.use('/Slidersection',Slidersection);
app.use("/Categorysection", Categorysection);
app.use('/inquiry',Inquirysection);
app.use('/Request',Requestrouter);




// Start server
const port = 8001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
