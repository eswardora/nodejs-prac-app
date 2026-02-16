import { employeesCollection } from '../index.js';

async function getEmployees(req, res) {
  try {
        const employees = await employeesCollection.find({}).toArray();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getEmployeeById(req, res) {
  try {
        const userId = req.params.id;
        const user = await employeesCollection.findOne({ id: parseInt(userId) });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createEmployee(req, res) {
  try {
        const user = req.body;
        const result = await employeesCollection.insertOne(user);
        res.status(201).json({ message: 'User created', user: result});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createEmployeesBulk(req, res) {
  try {
        const users = req.body; 
        const result = await employeesCollection.insertMany(users);
        res.status(201).json({ message: 'Users created', insertedCount: result.insertedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteEmployeeById(req, res) {
    try {
        const userId = req.params.id;
        const result = await employeesCollection.deleteOne({id: parseInt(userId) });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { getEmployees, getEmployeeById, createEmployee, createEmployeesBulk, deleteEmployeeById };