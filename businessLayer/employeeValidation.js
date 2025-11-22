'use strict';

const DataLayer = require('../data/DataLayer for Students/companydata');
const { parse, isValid, getDay, isFuture } = require('date-fns');

function validateEmployee(company, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id) {
    if (!company || !emp_name || !emp_no || !hire_date || !job || salary === undefined || !dept_id) {
        return 'All fields (company, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id) are required.';
    }

    if (typeof emp_name !== 'string' || emp_name.trim().length === 0) {
        return 'Employee name must be a valid string.';
    }

    if (/\d/.test(emp_name)) {
        return 'Employee name cannot contain numbers.';
    }

    if (typeof emp_no !== 'string' || emp_no.trim().length === 0) {
        return 'Employee number must be a valid string.';
    }

    if (isNaN(salary) || parseFloat(salary) < 0) {
        return 'Salary must be a valid positive number.';
    }

    if (isNaN(dept_id) || parseInt(dept_id) <= 0) {
        return 'Department ID must be a valid positive number.';
    }

    if (mng_id !== 0 && (isNaN(mng_id) || parseInt(mng_id) <= 0)) {
        return 'Manager ID must be 0 or a valid positive number.';
    }

    const dateObj = parse(hire_date, 'yyyy-MM-dd', new Date());
    if (!isValid(dateObj)) {
        return 'Hire date must be in format yyyy-MM-dd.';
    }

    if (isFuture(dateObj)) {
        return 'Hire date must be current date or earlier.';
    }

    const dayOfWeek = getDay(dateObj);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'Hire date must be Monday through Friday (not weekend).';
    }

    const dl = new DataLayer(company);

    const dept = dl.getDepartment(company, parseInt(dept_id));
    if (!dept) {
        dl.close();
        return 'Department ID does not exist in your company.';
    }

    if (parseInt(mng_id) !== 0) {
        const manager = dl.getEmployee(parseInt(mng_id));
        if (!manager) {
            dl.close();
            return 'Manager ID does not exist.';
        }
    }

    dl.close();

    return null;
}

function validateEmployeeUpdate(company, emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id) {
    if (!company || !emp_id || !emp_name || !emp_no || !hire_date || !job || salary === undefined || !dept_id) {
        return 'All fields (company, emp_id, emp_name, emp_no, hire_date, job, salary, dept_id, mng_id) are required.';
    }

    if (isNaN(emp_id) || parseInt(emp_id) <= 0) {
        return 'Employee ID must be a valid positive number.';
    }

    if (typeof emp_name !== 'string' || emp_name.trim().length === 0) {
        return 'Employee name must be a valid string.';
    }

    if (/\d/.test(emp_name)) {
        return 'Employee name cannot contain numbers.';
    }

    if (typeof emp_no !== 'string' || emp_no.trim().length === 0) {
        return 'Employee number must be a valid string.';
    }

    if (isNaN(salary) || parseFloat(salary) < 0) {
        return 'Salary must be a valid positive number.';
    }

    if (isNaN(dept_id) || parseInt(dept_id) <= 0) {
        return 'Department ID must be a valid positive number.';
    }

    if (mng_id !== 0 && (isNaN(mng_id) || parseInt(mng_id) <= 0)) {
        return 'Manager ID must be 0 or a valid positive number.';
    }

    const dateObj = parse(hire_date, 'yyyy-MM-dd', new Date());
    if (!isValid(dateObj)) {
        return 'Hire date must be in format yyyy-MM-dd.';
    }

    if (isFuture(dateObj)) {
        return 'Hire date must be current date or earlier.';
    }

    const dayOfWeek = getDay(dateObj);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'Hire date must be Monday through Friday (not weekend).';
    }

    const dl = new DataLayer(company);

    const existingEmp = dl.getEmployee(parseInt(emp_id));
    if (!existingEmp) {
        dl.close();
        return 'Employee ID does not exist.';
    }

    const dept = dl.getDepartment(company, parseInt(dept_id));
    if (!dept) {
        dl.close();
        return 'Department ID does not exist in your company.';
    }

    if (parseInt(mng_id) !== 0) {
        const manager = dl.getEmployee(parseInt(mng_id));
        if (!manager) {
            dl.close();
            return 'Manager ID does not exist.';
        }
    }

    dl.close();

    return null;
}

module.exports = {
    validateEmployee,
    validateEmployeeUpdate
};
