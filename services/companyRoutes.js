'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('../data/DataLayer for Students/companydata');

router.delete('/company', (req, res) => {
    try {
        const company = req.query.company;
        
        if (!company) {
            return res.json({ error: 'Company name is required.' });
        }

        const dl = new DataLayer(company);
        const rowsDeleted = dl.deleteCompany(company);
        dl.close();

        res.json({ success: `${company}'s information deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete company information.' });
    }
});

module.exports = router;
