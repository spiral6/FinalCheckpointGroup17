CREATE TABLE IF NOT EXISTS UserTable(
user_id INT AUTO_INCREMENT,
user_email VARCHAR(200) UNIQUE,
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
staff_phone INT(13) NOT NULL,
loc_id INT NOT NULL, -- Foreign Key with loc_id in LocationTable 
staff_workdays SET("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"),
staff_salary FLOAT,
staff_occupation VARCHAR(100) NOT NULL,
doc_specialty VARCHAR(100), -- Their specialty field
doc_perms VARCHAR(100), -- Chief surgeon or similar
PRIMARY KEY (staff_id)
);

CREATE TABLE IF NOT EXISTS PatientTable(
pat_id INT AUTO_INCREMENT,
pat_name VARCHAR(200) NOT NULL,
pat_sex SET("MALE", "FEMALE", "OTHER") NOT NULL,
pat_email VARCHAR(100),
pat_phone INT(13) NOT NULL,
pat_DoB DATE NOT NULL,
pat_height FLOAT,
pat_weight FLOAT,
pat_allergy VARCHAR(1000),
pat_insurance VARCHAR(200),
pat_address VARCHAR(200),
pat_pcp INT,
PRIMARY KEY (pat_id)
);

CREATE TABLE IF NOT EXISTS AppointmentTable(
app_id INT AUTO_INCREMENT,
app_source VARCHAR(100) NOT NULL, -- How did they book the appointment? Might be a set type later.
app_cancelled BOOLEAN NOT NULL, -- Cancelled or not cancelled
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
med_name VARCHAR(200) NOT NULL,
rx_start DATETIME NOT NULL, -- timestamp for when this was admitted?
rx_end DATETIME, -- timestamp for when it was left?
rx_desc VARCHAR(1000),
pat_id INT NOT NULL,
PRIMARY KEY (rx_id)
);

ALTER TABLE StaffTable
ADD FOREIGN KEY(loc_id) REFERENCES LocationTable(loc_id);

ALTER TABLE DoctorTable
ADD FOREIGN KEY (staff_id) REFERENCES StaffTable(staff_id);

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
ADD FOREIGN KEY (pat_id) REFERENCES PatientTable(pat_id);

ALTER TABLE PatientTable
ADD FOREIGN KEY (pat_pcp) REFERENCES StaffTable(staff_id);