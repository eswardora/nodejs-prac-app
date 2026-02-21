import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./connection.js";
import employeeRouter from "./routes/employee.js";

dotenv.config();
const app = express();
const PORT = 3000;
const uri = process.env.MONGO_URI;

connectMongoDB(uri);

app.use(express.json());

app.use("/employees", employeeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});