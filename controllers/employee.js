import { Employee } from '../models/employee.js';

async function getEmployees(req, res) {
  try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getEmployeeById(req, res) {
  try {
        const eid = req.params.EID;
        const employee = await Employee.findOne({ EID: parseInt(eid) });
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getOtherEmployees() {
  try {
        const employees = await Employee.find({ gender : { $nin : ['Male', 'Female'] } });
        if (employees) {
            res.json(employees);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createEmployee(req, res) {
  try {
        const user = req.body;
        const result = await Employee.create(user);
        res.status(201).json({ message: 'Employee created', user: result});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function deleteEmployeeById(req, res) {
    try {
        const eid = req.params.EID;
        const result = await Employee.deleteOne({EID: parseInt(eid) });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'Employee not found' });
        } else {
            res.json({ message: 'Employee deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateEmployee(req, res){
    try{
    const nEid = parseInt(req.params.EID);
    const sField = req.body.field;
    const sVal = req.body.value;
    let oEmp = await Employee.findOne({EID: `${nEid}`});
    oEmp[`${sField}`]= sVal;
    oEmp.save();
    res.status(200).json({ message : `Employee's ${sField} updated to ${sVal}`, result : oEmp});
    }
    catch(err){
        res.status(500).json({ error: err.message});
    }
}

export { getEmployees, getEmployeeById, createEmployee, updateEmployee,  deleteEmployeeById };