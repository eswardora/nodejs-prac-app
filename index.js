import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./connection.js";
import employeeRouter from "./routes/employee.js";
import { userRouter } from "./routes/user.js";
dotenv.config();
const app = express();
const PORT = 7000;
const uri = process.env.MONGO_URI;

connectMongoDB(uri);

app.use(express.json());

app.use("/employees", employeeRouter);
app.use("/users",userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});