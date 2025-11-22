'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const companyRoutes = require('./services/companyRoutes');
const departmentRoutes = require('./services/departmentRoutes');
const employeeRoutes = require('./services/employeeRoutes');
const timecardRoutes = require('./services/timecardRoutes');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.use('/', companyRoutes);
router.use('/', departmentRoutes);
router.use('/', employeeRoutes);
router.use('/', timecardRoutes);

app.use('/CompanyServices', router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'An internal server error occurred.' 
    });
});

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found.' 
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Base URL: http://localhost:${PORT}/CompanyServices`);
});

module.exports = app;
