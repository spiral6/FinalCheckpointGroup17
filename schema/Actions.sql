-- User actions
-- Login
SELECT * FROM UserTable WHERE user_email=?; 

-- Logout

-------------------------------------------------------------------------------------------------------------

-- Doctor custom actions
-- Find Patient
SELECT pat_id,pat_name,pat_phone,pat_email FROM PatientTable WHERE pat_name LIKE ? ORDER BY pat_name ASC;

-- View Patient Info (get pat_id from selection)
SELECT pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_allergy,pat_insurance,pat_address FROM PatientTable WHERE pat_id=?;

-- Add patient record (get pat_id from selection)
INSERT INTO RecordsTable(rec_treatment,rec_admit,rec_leave,pat_id)
VALUES(?,?,?,?);

-- View patient records (get pat_id from selection)
SELECT rec_treatment,rec_admit,rec_leave FROM RecordsTable WHERE pat_id=?;

-- Create Prescription (get pat_id from selection)
INSERT INTO PrescriptionTable(med_name,rx_start,rx_end,rx_desc,pat_id,doc_id)
VALUES(?,?,?,?,?,?);

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
SET app_cancelled=1 WHERE doc_id=? AND app_id=?;

-------------------------------------------------------------------------------------------------------------

-- Patient custom actions

-- Find Doctor (doctor name query has %NAME%)
SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation="DOCTOR" AND staff_name LIKE ? ORDER BY staff_name ASC;

-- List clinics
SELECT loc_address, loc_name, loc_dep FROM LocationTable; 

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

-------------------------------------------------------------------------------------------------------------

-- Staff custom view:
-- Edit doctor info (only visible if staff_occupation = secretary)
UPDATE StaffTable
SET staff_email=?, staff_phone=?, loc_id=(SELECT loc_id FROM LocationTable WHERE loc_name=?);

-- Create appointment (where app_source is either Web or Phone, pat_id from selection, doc_id from selection)
INSERT INTO AppointmentTable(app_source,app_time,loc_id,staff_id,pat_id)
VALUES(?,?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),?,?); 

-------------------------------------------------------------------------------------------------------------

-- Administrator custom view:
