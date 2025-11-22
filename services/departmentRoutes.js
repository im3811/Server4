'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('../data/DataLayer for Students/companydata');
const Department = DataLayer.prototype.Department;
const { validateDepartment, validateDepartmentUpdate } = require('../businessLayer/departmentValidation');

router.get('/department', (req, res) => {
    try {
        const company = req.query.company;
        const dept_id = parseInt(req.query.dept_id);

        if (!company || !dept_id) {
            return res.json({ error: 'Company name and department ID are required.' });
        }

        const dl = new DataLayer(company);
        const department = dl.getDepartment(company, dept_id);
        dl.close();

        if (!department) {
            return res.json({ error: 'Department not found.' });
        }

        res.json({ 
            department: {
                dept_id: department.getId(),
                company: department.getCompany(),
                dept_name: department.getDeptName(),
                dept_no: department.getDeptNo(),
                location: department.getLocation()
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve department.' });
    }
});

router.get('/departments', (req, res) => {
    try {
        const company = req.query.company;

        if (!company) {
            return res.json({ error: 'Company name is required.' });
        }

        const dl = new DataLayer(company);
        const departments = dl.getAllDepartment(company);
        dl.close();

        const result = departments.map(dept => ({
            department: {
                dept_id: dept.getId(),
                company: dept.getCompany(),
                dept_name: dept.getDeptName(),
                dept_no: dept.getDeptNo(),
                location: dept.getLocation()
            }
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve departments.' });
    }
});

router.put('/department', (req, res) => {
    try {
        const { company, dept_name, dept_no, location } = req.body;

        const validationError = validateDepartment(company, dept_name, dept_no, location);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const newDept = new Department(company, dept_name, dept_no, location);
        const dl = new DataLayer(company);
        const insertedDept = dl.insertDepartment(newDept);
        dl.close();

        if (!insertedDept) {
            return res.json({ error: 'Failed to insert department. Department number may already exist.' });
        }

        res.json({
            success: {
                department: {
                    dept_id: insertedDept.getId(),
                    company: insertedDept.getCompany(),
                    dept_name: insertedDept.getDeptName(),
                    dept_no: insertedDept.getDeptNo(),
                    location: insertedDept.getLocation()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to insert department.' });
    }
});

router.post('/department', (req, res) => {
    try {
        const { company, dept_id, dept_name, dept_no, location } = req.body;

        const validationError = validateDepartmentUpdate(company, dept_id, dept_name, dept_no, location);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const updateDept = new Department(company, dept_name, dept_no, location, parseInt(dept_id));
        const dl = new DataLayer(company);
        const updatedDept = dl.updateDepartment(updateDept);
        dl.close();

        if (!updatedDept) {
            return res.json({ error: 'Failed to update department. Department may not exist or dept_no already exists.' });
        }

        res.json({
            success: {
                department: {
                    dept_id: updatedDept.getId(),
                    company: updatedDept.getCompany(),
                    dept_name: updatedDept.getDeptName(),
                    dept_no: updatedDept.getDeptNo(),
                    location: updatedDept.getLocation()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to update department.' });
    }
});

router.delete('/department', (req, res) => {
    try {
        const company = req.query.company;
        const dept_id = parseInt(req.query.dept_id);

        if (!company || !dept_id) {
            return res.json({ error: 'Company name and department ID are required.' });
        }

        const dl = new DataLayer(company);
        const rowsDeleted = dl.deleteDepartment(company, dept_id);
        dl.close();

        if (rowsDeleted === 0) {
            return res.json({ error: 'Department not found or could not be deleted.' });
        }

        res.json({ success: `Department ${dept_id} from ${company} deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete department.' });
    }
});

module.exports = router;
