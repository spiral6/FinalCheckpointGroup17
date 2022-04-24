CREATE TABLE IF NOT EXISTS UserTable(
user_id INT AUTO_INCREMENT,
user_email VARCHAR(200) NOT NULL UNIQUE,
user_password VARCHAR(300) NOT NULL,
staff_id INT,
pat_id INT,
PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS StaffTable(
staff_id INT AUTO_INCREMENT, 
staff_name VARCHAR(200) NOT NULL, 
staff_sex SET("MALE", "FEMALE", "OTHER") NOT NULL,
staff_email VARCHAR(100) NOT NULL,
staff_phone VARCHAR(15) NOT NULL, -- Not recommended to use phone number as int.
staff_DoB DATE NOT NULL,
staff_address VARCHAR(200),
staff_salary FLOAT,
staff_occupation VARCHAR(100) NOT NULL,
doc_specialty VARCHAR(100), -- Their specialty field
doc_perms VARCHAR(100), -- Chief surgeon or similar
PRIMARY KEY (staff_id)
);

CREATE TABLE IF NOT EXISTS ScheduleTable(
staff_id INT,
schedule_workday SET("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"),
loc_id INT,
PRIMARY KEY(staff_id, schedule_workday, loc_id)
);

CREATE TABLE IF NOT EXISTS PatientTable(
pat_id INT AUTO_INCREMENT,
pat_name VARCHAR(200) NOT NULL,
pat_sex SET("MALE", "FEMALE", "OTHER") NOT NULL,
pat_email VARCHAR(100),
pat_phone VARCHAR(15) NOT NULL, -- Not recommended to use phone number as int.
pat_DoB DATE NOT NULL,
pat_height FLOAT,
pat_weight FLOAT,
pat_allergy VARCHAR(1000),
pat_insurance VARCHAR(200),
pat_address VARCHAR(200),
pat_pcp INT, -- Primary Care Physician (aka staff_id for docs)
PRIMARY KEY (pat_id)
);

CREATE TABLE IF NOT EXISTS AppointmentTable(
app_id INT AUTO_INCREMENT,
app_source VARCHAR(100) NOT NULL, -- How did they book the appointment? Might be a set type later. "web", or "phone"
app_status TINYINT(1) NOT NULL DEFAULT 0, -- 0 for accepted, 1 for cancelled, 2 for pending approval status, 3 for preapproved (not used unless debugging trigger)
app_time DATETIME NOT NULL, -- Timestamp for appointment
loc_id INT NOT NULL, -- Foreign Key with loc_id in LocationTable
doc_id INT NOT NULL, -- Foreign Key with doc_id in DoctorTable
pat_id INT NOT NULL, -- Foreign Key with pat_id in PatientTable
PRIMARY KEY (app_id)
);

CREATE TABLE IF NOT EXISTS RecordTable(
rec_id INT AUTO_INCREMENT,
rec_treatment VARCHAR(10000) NOT NULL, -- description of treatment
rec_admit DATETIME NOT NULL, -- timestamp for when this was admitted?
rec_leave DATETIME NOT NULL, -- timestamp for when it was left?
pat_id INT NOT NULL,
doc_id INT NOT NULL,
PRIMARY KEY (rec_id)
);

CREATE TABLE IF NOT EXISTS LocationTable(
loc_id INT AUTO_INCREMENT,
loc_city VARCHAR(100), -- City where clinic resides
loc_name VARCHAR(200), -- Name of clinic?
loc_dep VARCHAR(200), -- location of department?
PRIMARY KEY (loc_id)
);

CREATE TABLE IF NOT EXISTS MedicineTable(
med_id INT AUTO_INCREMENT,
med_name VARCHAR(200) NOT NULL,
med_allergy VARCHAR(200),
PRIMARY KEY (med_id)
);

CREATE TABLE IF NOT EXISTS PrescriptionTable(
rx_id INT AUTO_INCREMENT,
med_name VARCHAR(30) NOT NULL,
rx_strength VARCHAR(10) NOT NULL, --units
rx_amount INT NOT NULL,
rx_start DATE NOT NULL, -- startdate of meds
rx_end DATE, -- timestamp for when it was left?
rx_desc VARCHAR(1000),
pat_id INT NOT NULL,
doc_id INT NOT NULL,
PRIMARY KEY (rx_id)
);

-- ALTER TABLE StaffTable
-- ADD FOREIGN KEY(loc_id) REFERENCES LocationTable(loc_id);

ALTER TABLE AppointmentTable
ADD FOREIGN KEY (loc_id) REFERENCES LocationTable(loc_id),
ADD FOREIGN KEY (doc_id) REFERENCES StaffTable(staff_id),
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id);

ALTER TABLE RecordTable
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id);

ALTER TABLE UserTable
ADD FOREIGN KEY (staff_id) REFERENCES StaffTable(staff_id),
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id);

ALTER TABLE PrescriptionTable
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id),
ADD FOREIGN KEY (doc_id) REFERENCES StaffTable(staff_id);

ALTER TABLE PatientTable
ADD FOREIGN KEY (pat_pcp) REFERENCES StaffTable(staff_id);

ALTER TABLE UserTable
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id),
ADD FOREIGN KEY (staff_id) REFERENCES StaffTable(staff_id);

ALTER TABLE ScheduleTable
ADD FOREIGN KEY (staff_id) REFERENCES StaffTable(staff_id),
ADD FOREIGN KEY (loc_id) REFERENCES LocationTable(loc_id);