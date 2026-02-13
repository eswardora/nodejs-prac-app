import express from 'express'; 
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
//import fs from 'fs';
const app = express();
app.use(express.json());
const PORT = 3000;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'myDatabaseOne';
const collectionName = 'employees';

/* let employeesData = [];
fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading data.json:', err);
        return;
    }
    employeesData = JSON.parse(data);
    
}); */
        
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
const collection = db.collection(collectionName);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await collection.findOne({ id: parseInt(userId) });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const result = await collection.insertOne(user);
        res.status(201).json({ message: 'User created', user: result});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
   
app.post('/users/bulk', async (req, res) => {
    try {
        const users = req.body; 
        const result = await collection.insertMany(users);
        res.status(201).json({ message: 'Users created', insertedCount: result.insertedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await collection.deleteOne({ id: parseInt(userId) });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});