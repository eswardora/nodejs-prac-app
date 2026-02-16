import express from 'express'; 
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import router from './routes/employeeRoutes.js';
dotenv.config();
//import fs from 'fs';
const app = express();
app.use(express.json());
const PORT = 3000;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'myDatabaseOne';
const collectionName = 'employees';
       
const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    } 
};
connectToMongoDB();

const db = client.db(dbName);
export const employeesCollection = db.collection(collectionName);

app.use('/employees', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});