'use strict';

const DataLayer = require('../data/DataLayer for Students/companydata');
const { parse, isValid, getDay, differenceInHours, differenceInDays, subDays, isFuture, isSameDay, startOfDay } = require('date-fns');

function validateTimecard(company, emp_id, start_time, end_time) {
    if (!company || !emp_id || !start_time || !end_time) {
        return 'All fields (company, emp_id, start_time, end_time) are required.';
    }

    if (isNaN(emp_id) || parseInt(emp_id) <= 0) {
        return 'Employee ID must be a valid positive number.';
    }

    const startDateTime = parse(start_time, 'yyyy-MM-dd HH:mm:ss', new Date());
    const endDateTime = parse(end_time, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(startDateTime) || !isValid(endDateTime)) {
        return 'Start time and end time must be in format yyyy-MM-dd HH:mm:ss.';
    }

    const now = new Date();
    const oneWeekAgo = subDays(now, 7);

    if (isFuture(startDateTime)) {
        return 'Start time must be current date or up to 1 week ago.';
    }

    if (startDateTime < oneWeekAgo) {
        return 'Start time must be within the last week.';
    }

    const hoursDiff = differenceInHours(endDateTime, startDateTime);
    if (hoursDiff < 1) {
        return 'End time must be at least 1 hour greater than start time.';
    }

    if (!isSameDay(startDateTime, endDateTime)) {
        return 'End time must be on the same day as start time.';
    }

    const startDay = getDay(startDateTime);
    const endDay = getDay(endDateTime);

    if (startDay === 0 || startDay === 6) {
        return 'Start time must be Monday through Friday (not weekend).';
    }

    if (endDay === 0 || endDay === 6) {
        return 'End time must be Monday through Friday (not weekend).';
    }

    const startHour = startDateTime.getHours();
    const startMinute = startDateTime.getMinutes();
    const startSecond = startDateTime.getSeconds();
    const startTimeInSeconds = startHour * 3600 + startMinute * 60 + startSecond;

    const endHour = endDateTime.getHours();
    const endMinute = endDateTime.getMinutes();
    const endSecond = endDateTime.getSeconds();
    const endTimeInSeconds = endHour * 3600 + endMinute * 60 + endSecond;

    const sixAM = 6 * 3600;
    const sixPM = 18 * 3600;

    if (startTimeInSeconds < sixAM || startTimeInSeconds > sixPM) {
        return 'Start time must be between 06:00:00 and 18:00:00.';
    }

    if (endTimeInSeconds < sixAM || endTimeInSeconds > sixPM) {
        return 'End time must be between 06:00:00 and 18:00:00.';
    }

    const dl = new DataLayer(company);

    const employee = dl.getEmployee(parseInt(emp_id));
    if (!employee) {
        dl.close();
        return 'Employee ID does not exist in your company.';
    }

    const existingTimecards = dl.getAllTimecard(parseInt(emp_id));
    const startDay_startOfDay = startOfDay(startDateTime);

    for (let tc of existingTimecards) {
        const tcStartTime = parse(tc.getStartTime(), 'yyyy-MM-dd HH:mm:ss', new Date());
        const tcStartDay = startOfDay(tcStartTime);
        
        if (isSameDay(startDay_startOfDay, tcStartDay)) {
            dl.close();
            return 'Start time cannot be on the same day as an existing timecard for this employee.';
        }
    }

    dl.close();

    return null;
}

function validateTimecardUpdate(company, timecard_id, emp_id, start_time, end_time) {
    if (!company || !timecard_id || !emp_id || !start_time || !end_time) {
        return 'All fields (company, timecard_id, emp_id, start_time, end_time) are required.';
    }

    if (isNaN(timecard_id) || parseInt(timecard_id) <= 0) {
        return 'Timecard ID must be a valid positive number.';
    }

    if (isNaN(emp_id) || parseInt(emp_id) <= 0) {
        return 'Employee ID must be a valid positive number.';
    }

    const startDateTime = parse(start_time, 'yyyy-MM-dd HH:mm:ss', new Date());
    const endDateTime = parse(end_time, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(startDateTime) || !isValid(endDateTime)) {
        return 'Start time and end time must be in format yyyy-MM-dd HH:mm:ss.';
    }

    const now = new Date();
    const oneWeekAgo = subDays(now, 7);

    if (isFuture(startDateTime)) {
        return 'Start time must be current date or up to 1 week ago.';
    }

    if (startDateTime < oneWeekAgo) {
        return 'Start time must be within the last week.';
    }

    const hoursDiff = differenceInHours(endDateTime, startDateTime);
    if (hoursDiff < 1) {
        return 'End time must be at least 1 hour greater than start time.';
    }

    if (!isSameDay(startDateTime, endDateTime)) {
        return 'End time must be on the same day as start time.';
    }

    const startDay = getDay(startDateTime);
    const endDay = getDay(endDateTime);

    if (startDay === 0 || startDay === 6) {
        return 'Start time must be Monday through Friday (not weekend).';
    }

    if (endDay === 0 || endDay === 6) {
        return 'End time must be Monday through Friday (not weekend).';
    }

    const startHour = startDateTime.getHours();
    const startMinute = startDateTime.getMinutes();
    const startSecond = startDateTime.getSeconds();
    const startTimeInSeconds = startHour * 3600 + startMinute * 60 + startSecond;

    const endHour = endDateTime.getHours();
    const endMinute = endDateTime.getMinutes();
    const endSecond = endDateTime.getSeconds();
    const endTimeInSeconds = endHour * 3600 + endMinute * 60 + endSecond;

    const sixAM = 6 * 3600;
    const sixPM = 18 * 3600;

    if (startTimeInSeconds < sixAM || startTimeInSeconds > sixPM) {
        return 'Start time must be between 06:00:00 and 18:00:00.';
    }

    if (endTimeInSeconds < sixAM || endTimeInSeconds > sixPM) {
        return 'End time must be between 06:00:00 and 18:00:00.';
    }

    const dl = new DataLayer(company);

    const existingTimecard = dl.getTimecard(parseInt(timecard_id));
    if (!existingTimecard) {
        dl.close();
        return 'Timecard ID does not exist.';
    }

    const employee = dl.getEmployee(parseInt(emp_id));
    if (!employee) {
        dl.close();
        return 'Employee ID does not exist in your company.';
    }

    const existingTimecards = dl.getAllTimecard(parseInt(emp_id));
    const startDay_startOfDay = startOfDay(startDateTime);

    for (let tc of existingTimecards) {
        if (tc.getId() === parseInt(timecard_id)) {
            continue;
        }
        
        const tcStartTime = parse(tc.getStartTime(), 'yyyy-MM-dd HH:mm:ss', new Date());
        const tcStartDay = startOfDay(tcStartTime);
        
        if (isSameDay(startDay_startOfDay, tcStartDay)) {
            dl.close();
            return 'Start time cannot be on the same day as an existing timecard for this employee.';
        }
    }

    dl.close();

    return null;
}

module.exports = {
    validateTimecard,
    validateTimecardUpdate
};
