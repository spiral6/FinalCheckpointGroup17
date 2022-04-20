-- User actions
-- Login
SELECT * FROM UserTable WHERE user_email=?; 

CREATE TRIGGER LoginTimestamp
ON Table PrescriptionTable
BEFORE INSERT

-- Logout

-------------------------------------------------------------------------------------------------------------
-- View past appointment history 
SELECT* FROM AppointmentTable WHERE app_time > "2022-1-17 00:00:00" AND app_time < "2022-2-25 00:00:00";
-- Doctor custom actions
-- Find Patient
SELECT pat_id,pat_name,pat_phone,pat_email FROM PatientTable WHERE pat_name LIKE %?% ORDER BY pat_name ASC;

-- View Patient Info (get pat_id from selection)
SELECT pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_allergy,pat_insurance,pat_address FROM PatientTable WHERE pat_id=?;

-- Add patient record (get pat_id from selection)
INSERT INTO RecordTable(rec_treatment,rec_admit,rec_leave,pat_id)
VALUES(?,?,?,?);

-- View patient records (get pat_id from selection)
SELECT rec_treatment,rec_admit,rec_leave FROM RecordTable WHERE pat_id=?;

-- Create Prescription (get pat_id from selection)
INSERT INTO PrescriptionTable(med_name,rx_start,rx_end,rx_desc,pat_id,doc_id)
VALUES(?,?,?,?,?,?);

CREATE FUNCTION CheckPrescriptionFunction() RETURN

CREATE Trigger CheckPrescriptionAllergy
ON Table PrescriptionTable
BEFORE INSERT
BEGIN
    IF(SELECT med_allergy FROM MedicineTable WHERE EXISTS NEW.med_name) THEN
        IF(SELECT pat_allergy FROM PatientTable WHERE EXISTS CONCAT('%', (SELECT med_allergy FROM MedicineTable WHERE EXISTS NEW.med_name), '%'))
        THEN
            SET err_msg = concat('Cannot add prescription because of allergy.', cast(dtype as char))
            SIGNAL SQLSTATE '45000' set message_text = err_msg
        END IF;
    ELSE
        INSERT INTO PrescriptionTable(med_name,rx_start,rx_end,rx_desc,pat_id,doc_id)
        VALUES(NEW.med_name,NEW.rx_start,NEW.rx_end,NEW.rx_desc,NEW.pat_id,NEW.doc_id)
    END IF
END;

-- List appointments (get doc_id from cookies)
SELECT app_id,app_time,LocationTable.loc_name,PatientTable.pat_name 
FROM (((AppointmentTable
INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id)
INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id)
INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id)
WHERE doc_id=?;

-- Cancel appointment (get doc_id from cookies, get app_id from selection), if 1 row changed, send an email.
UPDATE AppointmentTable 
SET app_cancelled=1 WHERE pat_id=? AND app_id=?;

CREATE Trigger SendEmailPatient
ON Table AppointmentTable
AFTER UPDATE
BEGIN 
    IF(SELECT app_cancelled FROM AppointmentTable WHERE app_id=NEW.app_id AND app_cancelled=1) THEN
        SELECT app_id,app_time,PatientTable.pat_name,PatientTable.pat_email
        FROM ((AppointmentTable
        INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id)
        INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id)
        WHERE staff_id=NEW.staff_id
    ELSE
        SET email_msg = concat('Unable to cancel appointment (Doctor route).', cast(dtype as char))
        SIGNAL SQLSTATE '45000' set message_text = email_msg
    END IF
END;

-------------------------------------------------------------------------------------------------------------

-- Patient custom actions

-- Find Doctor (doctor name query has %NAME%)
SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation="DOCTOR" AND staff_name LIKE ? ORDER BY staff_name ASC;

-- List clinics
SELECT loc_city, loc_name, loc_dep FROM LocationTable; 

-- Edit profile info (get pat_id from cookies)
UPDATE PatientTable 
SET pat_name=?, pat_sex=?, pat_phone=?, pat_insurance=?, pat_address=? WHERE pat_id=?;

-- List appointments (get pat_id from cookies)
SELECT app_id,app_time,LocationTable.loc_name,StaffTable.staff_name 
FROM (((AppointmentTable
INNER JOIN LocationTable ON AppointmentTable.loc_id=LocationTable.loc_id)
INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id)
INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id)
WHERE pat_id=?;

-- Create appointment (get loc_name from selection, doc_id from selection, pat_id from cookies)

INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id)
VALUES("Web",?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),(SELECT staff_id FROM StaffTable WHERE staff_name=? AND staff_occupation="DOCTOR"),?);

CREATE Trigger CheckSpecialistAppointment
ON Table AppointmentTable
BEFORE INSERT
BEGIN
    IF(SELECT pat_pcp FROM PatientTable WHERE pat_pcp=NEW.doc_id) THEN
        INSERT INTO AppointmentTable(app_source,app_time,loc_id,doc_id,pat_id)
        VALUES("Web",?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),?,?)
    ELSE
        SET err_msg = concat('Cannot sign up for appointment because doctor is not Primary Care Physician.', cast(dtype as char))
        SIGNAL SQLSTATE '45000' set message_text = err_msg
    END IF
END;

-- Cancel appointment (get pat_id from cookies, get app_id from selection), if 1 row changed, send an email.
UPDATE AppointmentTable 
SET app_cancelled=1 WHERE pat_id=? AND app_id=?;

CREATE Trigger SendEmailDoctor
ON Table AppointmentTable
AFTER UPDATE
BEGIN 
    IF(SELECT app_cancelled FROM AppointmentTable WHERE app_id=NEW.app_id AND app_cancelled=1) THEN
        SELECT app_id,app_time,StaffTable.staff_name,StaffTable.staff_email 
        FROM ((AppointmentTable
        INNER JOIN StaffTable ON AppointmentTable.doc_id=StaffTable.staff_id)
        INNER JOIN PatientTable ON AppointmentTable.pat_id=PatientTable.pat_id)
        WHERE pat_id=NEW.pat_id
    ELSE
        SET email_msg = concat('Unable to cancel appointment (Patient route).', cast(dtype as char))
        SIGNAL SQLSTATE '45000' set message_text = email_msg
    END IF
END;

-------------------------------------------------------------------------------------------------------------

-- Staff custom view:
-- Edit doctor info (only visible if staff_occupation = secretary/hospital administrator)
UPDATE StaffTable
SET staff_email=?, staff_phone=?, loc_id=(SELECT loc_id FROM LocationTable WHERE loc_name=?);

-- Create appointment (only visible if staff_occupation = secretary/hospital administrator) (where app_source is either Web or Phone, pat_id from selection, doc_id from selection)
INSERT INTO AppointmentTable(app_source,app_time,loc_id,staff_id,pat_id)
VALUES(?,?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),?,?); 

-- View specific person schedule (only for hospital admin)
SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name
FROM ((ScheduleTable
INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id)
INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id)
WHERE ScheduleTable.staff_id=?;

-- View all doctor schedules (only for nurse/secretary/hospital admin)
SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name
FROM ((ScheduleTable
INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id)
INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id)
WHERE ScheduleTable.staff_occupation='DOCTOR';

-- View all schedules (only for hospital admin)
SELECT StaffTable.staff_name,schedule_workday,LocationTable.loc_name
FROM ((ScheduleTable
INNER JOIN LocationTable ON ScheduleTable.loc_id=LocationTable.loc_id)
INNER JOIN StaffTable ON ScheduleTable.staff_id=StaffTable.staff_id);

-------------------------------------------------------------------------------------------------------------

-- Administrator custom view:
