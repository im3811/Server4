'use strict';

const DataLayer = require('../data/DataLayer for Students/companydata');

function validateDepartment(company, dept_name, dept_no, location) {
    if (!company || !dept_name || !dept_no || !location) {
        return 'All fields (company, dept_name, dept_no, location) are required.';
    }

    if (typeof company !== 'string' || company.trim().length === 0) {
        return 'Company name must be a valid string.';
    }

    if (typeof dept_name !== 'string' || dept_name.trim().length === 0) {
        return 'Department name must be a valid string.';
    }

    if (typeof dept_no !== 'string' || dept_no.trim().length === 0) {
        return 'Department number must be a valid string.';
    }

    if (typeof location !== 'string' || location.trim().length === 0) {
        return 'Location must be a valid string.';
    }

    const dl = new DataLayer(company);
    const existingDept = dl.getDepartmentNo(company, dept_no);
    dl.close();

    if (existingDept) {
        return 'Department number must be unique. This dept_no already exists.';
    }

    return null;
}

function validateDepartmentUpdate(company, dept_id, dept_name, dept_no, location) {
    if (!company || !dept_id || !dept_name || !dept_no || !location) {
        return 'All fields (company, dept_id, dept_name, dept_no, location) are required.';
    }

    if (isNaN(dept_id) || parseInt(dept_id) <= 0) {
        return 'Department ID must be a valid positive number.';
    }

    if (typeof dept_name !== 'string' || dept_name.trim().length === 0) {
        return 'Department name must be a valid string.';
    }

    if (typeof dept_no !== 'string' || dept_no.trim().length === 0) {
        return 'Department number must be a valid string.';
    }

    if (typeof location !== 'string' || location.trim().length === 0) {
        return 'Location must be a valid string.';
    }

    const dl = new DataLayer(company);
    
    const existingDept = dl.getDepartment(company, parseInt(dept_id));
    if (!existingDept) {
        dl.close();
        return 'Department ID does not exist.';
    }

    const deptWithSameNo = dl.getDepartmentNo(company, dept_no);
    if (deptWithSameNo && deptWithSameNo.getId() !== parseInt(dept_id)) {
        dl.close();
        return 'Department number must be unique. This dept_no is already used by another department.';
    }

    dl.close();
    return null;
}

module.exports = {
    validateDepartment,
    validateDepartmentUpdate
};
