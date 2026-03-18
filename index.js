import express from "express";
import dotenv from "dotenv";
import ejs from 'ejs';
import path from 'path';
import {fileURLToPath} from 'url';

import { connectMongoDB } from "./connection.js";
import employeeRouter from "./routes/employee.js";
import { userRouter } from "./routes/user.js";
dotenv.config();
const app = express();
const PORT = 7000;
const uri = process.env.MONGO_URI;

connectMongoDB(uri);

app.use(express.json());
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resfile = path.join(__dirname, './public/html/output.html');

app.get("/test", (req,res)=>{
    res.sendFile(resfile);
})

app.use("/employees", employeeRouter);
app.use("/users",userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});