'use strict';

const express = require('express');
const router = express.Router();
const DataLayer = require('companydata');
const Timecard = DataLayer.prototype.Timecard;
const { validateTimecard, validateTimecardUpdate } = require('../businessLayer/timecardValidation');
const { COMPANY_NAME } = require('../config');

router.get('/timecard', (req, res) => {
    try {
        const timecard_id = parseInt(req.query.timecard_id);

        if (!timecard_id) {
            return res.json({ error: 'Timecard ID is required.' });
        }

        const dl = new DataLayer(COMPANY_NAME);
        const timecard = dl.getTimecard(timecard_id);
        dl.close();

        if (!timecard) {
            return res.json({ error: 'Timecard not found.' });
        }

        res.json({
            timecard: {
                timecard_id: timecard.getId(),
                start_time: timecard.getStartTime(),
                end_time: timecard.getEndTime(),
                emp_id: timecard.getEmpId()
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve timecard.' });
    }
});

router.get('/timecards', (req, res) => {
    try {
        const emp_id = parseInt(req.query.emp_id);

        if (!emp_id) {
            return res.json({ error: 'Employee ID is required.' });
        }

        const dl = new DataLayer(COMPANY_NAME);
        const timecards = dl.getAllTimecard(emp_id);
        dl.close();

        const result = timecards.map(tc => ({
            timecard: {
                timecard_id: tc.getId(),
                start_time: tc.getStartTime(),
                end_time: tc.getEndTime(),
                emp_id: tc.getEmpId()
            }
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to retrieve timecards.' });
    }
});

router.put('/timecard', (req, res) => {
    try {
        const { emp_id, start_time, end_time } = req.body;

        const validationError = validateTimecard(COMPANY_NAME, emp_id, start_time, end_time);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const newTimecard = new Timecard(start_time, end_time, parseInt(emp_id));

        const dl = new DataLayer(COMPANY_NAME);
        const insertedTimecard = dl.insertTimecard(newTimecard);
        dl.close();

        if (!insertedTimecard) {
            return res.json({ error: 'Failed to insert timecard. Invalid data.' });
        }

        res.json({
            success: {
                timecard: {
                    timecard_id: insertedTimecard.getId(),
                    start_time: insertedTimecard.getStartTime(),
                    end_time: insertedTimecard.getEndTime(),
                    emp_id: insertedTimecard.getEmpId()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to insert timecard.' });
    }
});

router.post('/timecard', (req, res) => {
    try {
        const timecard_id = req.body.timecard_id;
        const emp_id = req.body.emp_id;
        const start_time = req.body.start_time;
        const end_time = req.body.end_time;

        const validationError = validateTimecardUpdate(COMPANY_NAME, timecard_id, emp_id, start_time, end_time);
        if (validationError) {
            return res.json({ error: validationError });
        }

        const updateTimecard = new Timecard(start_time, end_time, parseInt(emp_id), parseInt(timecard_id));

        const dl = new DataLayer(COMPANY_NAME);
        const updatedTimecard = dl.updateTimecard(updateTimecard);
        dl.close();

        if (!updatedTimecard) {
            return res.json({ error: 'Failed to update timecard. Timecard may not exist or invalid data.' });
        }

        res.json({
            success: {
                timecard: {
                    timecard_id: updatedTimecard.getId(),
                    start_time: updatedTimecard.getStartTime(),
                    end_time: updatedTimecard.getEndTime(),
                    emp_id: updatedTimecard.getEmpId()
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to update timecard.' });
    }
});

router.delete('/timecard', (req, res) => {
    try {
        const timecard_id = parseInt(req.query.timecard_id);

        if (!timecard_id) {
            return res.json({ error: 'Timecard ID is required.' });
        }

        const dl = new DataLayer(COMPANY_NAME);
        const rowsDeleted = dl.deleteTimecard(timecard_id);
        dl.close();

        if (rowsDeleted === 0) {
            return res.json({ error: 'Timecard not found or could not be deleted.' });
        }

        res.json({ success: `Timecard ${timecard_id} deleted.` });
    } catch (error) {
        console.error(error);
        res.json({ error: 'Failed to delete timecard.' });
    }
});

module.exports = router;
