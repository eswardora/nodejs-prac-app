import { Router } from "express";
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployeeById } from "../controllers/employee.js";
const router = Router();

router
  .route("/")
  .get(getEmployees)
  .post(createEmployee);
router
  .route("/:EID")
  .get(getEmployeeById)
  .delete(deleteEmployeeById)
  .patch(updateEmployee);

export default router;