import { Router } from "express";
import { getEmployees, getEmployeeById, createEmployee, createEmployeesBulk, deleteEmployeeById } from "../controllers/employeeControllers.js";
const router = Router();

router.route("/").get(getEmployees);
router.route("/").post(createEmployee);
router.route("/:id").get(getEmployeeById);
router.route("/bulk").post(createEmployeesBulk);
router.route("/:id").delete(deleteEmployeeById);

export default router;
