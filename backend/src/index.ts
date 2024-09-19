import express from "express";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import storeRoute from "./routes/storeRoute";
import dotenv from 'dotenv';
import cors from "cors";
import { verify } from "./middlewares/verify";
import branchRoute from "./routes/branchRoute";

const app = express();
dotenv.config();

// ตั้งค่า CORS ให้รองรับการส่งคุกกี้จาก Frontend
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"], 
    credentials: true, 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const prefix = '/backend/api';

app.use(prefix + "/users",verify, userRoute);
app.use(prefix + "/auth", authRoute);
app.use(prefix + "/stores", verify, storeRoute);
app.use(prefix + "/branches", verify, branchRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
