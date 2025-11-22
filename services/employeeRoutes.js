'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('../data/DataLayer for Students/companydata');
const Employee = DataLayer.prototype.Employee;
const { validateEmployee, validateEmployeeUpdate } = require('../businessLayer/employeeValidation');

router.get('/employee', (req, res) => {
    try {
        const emp_id = parseInt(req.query.emp_id);

        if (!emp_id) {
            return res.json({ error: 'Employee ID is required.' });
        }

        const dl = new DataLayer('temp');
        const employee = dl.getEmployee(emp_id);
        dl.close();

        if (!employee) {
            return res.json({ error: 'Employee not found.' });
        }

        res.json({
            employee: {
                emp_id: employee.getId(),
                emp_name: employee.getEmpName(),
                emp_no: employee.getEmpNo(),
                hire_date: employee.getHireDate(),
                job: employee.getJob(),
                salary: employee.getSalary(),
                dept_id: employee.getDeptId(),
                mng_id: employee.getMngId()
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve employee.' });
    }
});

router.get('/employees', (req, res) => {
    try {
        const company = req.query.company;

        if (!company) {
            return res.json({ error: 'Company name is required.' });
        }

        const dl = new DataLayer(company);
        const employees = dl.getAllEmployee(company);
        dl.close();

        const result = employees.map(emp => ({
            employee: {
                emp_id: emp.getId(),
                emp_name: emp.getEmpName(),
                emp_no: emp.getEmpNo(),
                hire_date: emp.getHireDate(),
                job: emp.getJob(),
                salary: emp.getSalary(),
                dept_id: emp.getDeptId(),
                mng_id: emp.getMngId()
            }
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve employees.' });
    }
});

router.put('/employee', (req, res) => {
    try {
        const { emp_name, emp_no, hire_date, job, salary, dept_id, mng_id } = req.body;
        const company = req.body.company;

        const validationError = validateEmployee(company, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const newEmp = new Employee(
            emp_name,
            emp_no,
            hire_date,
            job,
            parseFloat(salary),
            parseInt(dept_id),
            parseInt(mng_id)
        );

        const dl = new DataLayer(company);
        const insertedEmp = dl.insertEmployee(newEmp);
        dl.close();

        if (!insertedEmp) {
            return res.json({ error: 'Failed to insert employee. Employee number may already exist or invalid data.' });
        }

        res.json({
            success: {
                employee: {
                    emp_id: insertedEmp.getId(),
                    emp_name: insertedEmp.getEmpName(),
                    emp_no: insertedEmp.getEmpNo(),
                    hire_date: insertedEmp.getHireDate(),
                    job: insertedEmp.getJob(),
                    salary: insertedEmp.getSalary(),
                    dept_id: insertedEmp.getDeptId(),
                    mng_id: insertedEmp.getMngId()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to insert employee.' });
    }
});

router.post('/employee', (req, res) => {
    try {
        const { emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id } = req.body;
        const company = req.body.company;

        const validationError = validateEmployeeUpdate(company, emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const updateEmp = new Employee(
            emp_name,
            emp_no,
            hire_date,
            job,
            parseFloat(salary),
            parseInt(dept_id),
            parseInt(mng_id),
            parseInt(emp_id)
        );

        const dl = new DataLayer(company);
        const updatedEmp = dl.updateEmployee(updateEmp);
        dl.close();

        if (!updatedEmp) {
            return res.json({ error: 'Failed to update employee. Employee may not exist or invalid data.' });
        }

        res.json({
            success: {
                employee: {
                    emp_id: updatedEmp.getId(),
                    emp_name: updatedEmp.getEmpName(),
                    emp_no: updatedEmp.getEmpNo(),
                    hire_date: updatedEmp.getHireDate(),
                    job: updatedEmp.getJob(),
                    salary: updatedEmp.getSalary(),
                    dept_id: updatedEmp.getDeptId(),
                    mng_id: updatedEmp.getMngId()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to update employee.' });
    }
});

router.delete('/employee', (req, res) => {
    try {
        const emp_id = parseInt(req.query.emp_id);

        if (!emp_id) {
            return res.json({ error: 'Employee ID is required.' });
        }

        const dl = new DataLayer('temp');
        const rowsDeleted = dl.deleteEmployee(emp_id);
        dl.close();

        if (rowsDeleted === 0) {
            return res.json({ error: 'Employee not found or could not be deleted.' });
        }

        res.json({ success: `Employee ${emp_id} deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete employee.' });
    }
});

module.exports = router;
