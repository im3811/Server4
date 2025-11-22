'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('companydata');
const Department = DataLayer.prototype.Department;
const { validateDepartment, validateDepartmentUpdate } = require('../businessLayer/departmentValidation');
const { COMPANY_NAME } = require('../config');

router.get('/department', (req, res) => {
    try {
        const dept_id = parseInt(req.query.dept_id);

        if (!dept_id) {
            return res.json({ error: 'Department ID is required.' });
        }

        const dl = new DataLayer(COMPANY_NAME);
        const department = dl.getDepartment(COMPANY_NAME, dept_id);
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
        const dl = new DataLayer(COMPANY_NAME);
        const departments = dl.getAllDepartment(COMPANY_NAME);
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
        const { dept_name, dept_no, location } = req.body;

        const validationError = validateDepartment(COMPANY_NAME, dept_name, dept_no, location);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const newDept = new Department(COMPANY_NAME, dept_name, dept_no, location);
        const dl = new DataLayer(COMPANY_NAME);
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
        const dept_id = req.body.dept_id;
        const dept_name = req.body.dept_name;
        const dept_no = req.body.dept_no;
        const location = req.body.location;

        const validationError = validateDepartmentUpdate(COMPANY_NAME, dept_id, dept_name, dept_no, location);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const updateDept = new Department(COMPANY_NAME, dept_name, dept_no, location, parseInt(dept_id));
        const dl = new DataLayer(COMPANY_NAME);
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
        const dept_id = parseInt(req.query.dept_id);

        if (!dept_id) {
            return res.json({ error: 'Department ID is required.' });
        }

        const dl = new DataLayer(COMPANY_NAME);
        const rowsDeleted = dl.deleteDepartment(COMPANY_NAME, dept_id);
        dl.close();

        if (rowsDeleted === 0) {
            return res.json({ error: 'Department not found or could not be deleted.' });
        }

        res.json({ success: `Department ${dept_id} from ${COMPANY_NAME} deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete department.' });
    }
});

module.exports = router;
