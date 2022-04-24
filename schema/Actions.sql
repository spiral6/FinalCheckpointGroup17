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
UPDATE AppointmentTable WHERE pat_id=? AND app_id=?;

-------------------------------------------------------------------------------------------------------------

-- Patient custom actions

-- Find Doctor (doctor name query has %NAME%)
SELECT staff_name, staff_email, staff_phone FROM StaffTable WHERE staff_occupation="DOCTOR" AND staff_name LIKE ? ORDER BY staff_name ASC;

-- List clinics
SELECT loc_city, loc_name, loc_dep FROM LocationTable; 

-- Edit profile info (get pat_id from cookies)
UPDATE PatientTable 
SET pat_name=?, pat_sex=?, pat_phone=?, pat_insurance=?, pat_address=? WHERE pat_id=?;

DELIMITER //
CREATE Trigger UpdateEmail BEFORE UPDATE 
ON PatientTable FOR EACH ROW

BEGIN

  UPDATE UserTable
  SET user_email = NEW.pat_email
  WHERE
  user_email = OLD.pat_email;
  
END //

DELIMITER ;

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

DELIMITER //
CREATE Trigger CheckSpecialistAppointment BEFORE INSERT ON AppointmentTable FOR EACH ROW

BEGIN

  SELECT pat_pcp INTO @pat_pcp_check FROM PatientTable WHERE pat_id=NEW.pat_id LIMIT 1;
  IF(@pat_pcp_check!=NEW.doc_id) THEN
      SET NEW.app_status=2;
  END IF;
  IF(NEW.app_status=3) THEN
  	SET NEW.app_status=0;
  END IF;

END //

DELIMITER ;

-- Cancel appointment (get pat_id from cookies, get app_id from selection), if 1 row changed, send an email.
DELETE FROM AppointmentTable WHERE pat_id=? AND app_id=?;

-------------------------------------------------------------------------------------------------------------

-- Staff custom view:
-- Edit doctor info (only visible if staff_occupation = secretary/hospital administrator)
UPDATE StaffTable
SET staff_email=?, staff_phone=?, loc_id=(SELECT loc_id FROM LocationTable WHERE loc_name=?);

-- Create appointment (only visible if staff_occupation = secretary/hospital administrator) (where app_source is either Web or Phone, pat_id from selection, doc_id from selection)
INSERT INTO AppointmentTable(app_source,app_time,loc_id,staff_id,pat_id)
VALUES(?,?,(SELECT loc_id FROM LocationTable WHERE loc_name=?),?,?); 

-- View specific person schedule (only for hospital admin)
SELECT StaffTable.staff_name, loc_name,
GROUP_CONCAT(schedule_workday ORDER BY FIELD(schedule_workday, "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN") ASC) AS weekdays
FROM ScheduleTable 
INNER JOIN LocationTable ON ScheduleTable.loc_id = LocationTable.loc_id
INNER JOIN StaffTable ON ScheduleTable.staff_id = StaffTable.staff_id
WHERE StaffTable.staff_id=?
GROUP BY ScheduleTable.staff_id, loc_name
;

-- View all doctor schedules (only for nurse/secretary/hospital admin)
SELECT StaffTable.staff_name, loc_name,
GROUP_CONCAT(schedule_workday ORDER BY FIELD(schedule_workday, "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN") ASC) AS weekdays
FROM ScheduleTable 
INNER JOIN LocationTable ON ScheduleTable.loc_id = LocationTable.loc_id
INNER JOIN StaffTable ON ScheduleTable.staff_id = StaffTable.staff_id
WHERE StaffTable.staff_occupation='DOCTOR'
GROUP BY ScheduleTable.staff_id, loc_name
;

-- View all schedules (only for hospital admin)
SELECT StaffTable.staff_name, loc_name,
GROUP_CONCAT(schedule_workday ORDER BY FIELD(schedule_workday, "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN") ASC) AS weekdays
FROM ScheduleTable 
INNER JOIN LocationTable ON ScheduleTable.loc_id = LocationTable.loc_id
INNER JOIN StaffTable ON ScheduleTable.staff_id = StaffTable.staff_id
GROUP BY ScheduleTable.staff_id, loc_name
;

-------------------------------------------------------------------------------------------------------------

-- Administrator custom view:

-- Report 2: View monthly report of a medicine being prescribed X times (WIP) (add date filter)
SELECT med_name as 'Medicine Name', COUNT(*) as 'Number of Prescriptions' FROM PrescriptionTable WHERE rx_start >= '1979-01-01' AND rx_start <= '2023-01-01' GROUP BY med_name;

-- Report 3: View report of appointments per clinic
SELECT loc_name as 'Location Name', COUNT(*) as 'Number of Appointments' 
FROM AppointmentTable 
INNER JOIN LocationTable ON AppointmentTable.loc_id = LocationTable.loc_id
WHERE app_time >= '1979-01-01' AND app_time <= '2023-01-01' 
GROUP BY loc_name;