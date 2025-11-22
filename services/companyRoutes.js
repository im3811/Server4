'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('companydata');
const { COMPANY_NAME } = require('../config');

router.delete('/company', (req, res) => {
    try {
        const dl = new DataLayer(COMPANY_NAME);
        const rowsDeleted = dl.deleteCompany(COMPANY_NAME);
        dl.close();

        res.json({ success: `${COMPANY_NAME}'s information deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete company information.' });
    }
});

module.exports = router;
