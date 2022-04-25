-- StaffTable
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (1212,'Dummy Doctor','male','dummydoctor@email.com','713-111-2222',1,30000,'DOCTOR','Oncology','Chief');
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (2323,'Chung Kim','female','ckim@email.com','713-222-3333',2,40000,'DOCTOR','Cardiology',NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (3434,'Dick Davidson','male','ddavidson@email.com','713-333-4444',2,25000,'JANITOR',NULL,NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (4545,'Rohan Panchal','male','rpanchal@email.com','713-444-5555',3,43000,'HOSPITAL ADMINISTRATOR',NULL,NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (5656,'Barbara Benson','female','bbenson@email.com','713-555-6666',1,38000,'SECRETARY',NULL,NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (6767,'Jim Johnson','male','jjohnson@email.com','713-666-7777',3,25000,'DOCTOR','ENT',NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (7878,'Meg Miller','female','mmiller@email.com','713-777-8888',1,25000,'NURSE',NULL,NULL);
INSERT INTO StaffTable(staff_id,staff_name,staff_sex,staff_email,staff_phone,loc_id,staff_salary,staff_occupation,doc_specialty,doc_perms) VALUES (8989,'James Taylor','male','jtaylor@email.com','713-888-9999',2,55000,'DATABASE ADMINISTRATOR',NULL,NULL);

-- LocationTable
INSERT INTO LocationTable(loc_id,loc_name,loc_dep) VALUES (1,'Houston','Clinic A',NULL);
INSERT INTO LocationTable(loc_id,loc_name,loc_dep) VALUES (2,'Cypress','Clinic B',NULL);
INSERT INTO LocationTable(loc_id,loc_name,loc_dep) VALUES (3,'Spring','Clinic C','Surgery');

-- PatientTable
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (1111,'Dummy Patient','male','dummypatient@email.com','713-111-1111','1965-01-09',175.3,220,'United Healthcare Insurance Company','731 Fondren, Houston, TX','ibuprofen',1212);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (2222,'Franklin Wong','other','fwong@email.com','713-222-2222','1955-12-08',180.6,185,'Humana Insurance Company','638 Voss, Houston, TX',NULL,1212);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (3333,'Alicia Zelaya','female','azelaya@email.com','713-333-3333','1968-01-19',156.7,135,'United Healthcare Insurance Company','3321 Castle, Spring, TX','aspirin',2323);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (4444,'Jennifer Wallace','female','jwallace@email.com','713-444-4444','1941-06-20',145.8,140,'United Healthcare Insurance Company','291 Berry, Bellaire, TX',NULL,6767);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (5555,'Ramesh Narayan','male','rnarayan@email.com','713-555-5555','1962-09-15',161.8,160,'Superior Healthplan Network','975 Fire Oak, Humble, TX',NULL,6767);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (6666,'Joyce English','female','jenglish@email.com','713-666-6666','1972-07-31',167.2,145,'Humana Insurance Company','5631 Rice, Houston, TX',NULL,2323);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (7777,'Ahmad Jabbar','male','ajabbar@email.com','713-777-7777','1969-03-29',198.5,165,'Aetna Life Insurance Company','980 Dallas, Houston, TX',NULL,1212);
INSERT INTO PatientTable(pat_id,pat_name,pat_sex,pat_email,pat_phone,pat_DoB,pat_height,pat_weight,pat_insurance,pat_address,pat_allergy,pat_pcp) VALUES (8888,'James Borg','male','jborg@email.com','713-888-8888','1937-11-10',172,180,'United Healthcare Insurance Company','450 Stone, Houston, TX',NULL,2323);

-- UserTable
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (1,'dummydoctor@email.com','',1212,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (2,'ddavidson@email.com','',3434,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (3,'rpanchal@email.com','',4545,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (4,'bbenson@email.com','',5656,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (5,'mmiller@email.com','',7878,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (6,'jtaylor@email.com','',8989,NULL);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (7,'dummypatient@email.com','',NULL,1111);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (8,'fwong@email.com','',NULL,2222);
INSERT INTO UserTable(user_id,user_email,user_password,staff_id,pat_id) VALUES (9,'azelaya@email.com','',NULL,3333);

-- MedicineTable
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (11,'Arm fixer',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (22,'Leg fixer',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (33,'Cough drops',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (44,'Bloody nose stopper',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (123,'Ibuprofen','aspirin');
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (352,'Methadone',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (4356,'Ritalin',NULL);
INSERT INTO MedicineTable(med_id,med_name,med_allergy) VALUES (76457,'Aspirin','ibuprofen');

-- ScheduleTable
INSERT INTO ScheduleTable(staff_id,schedule_workday,loc_id) VALUES (1212,'MON','1');
INSERT INTO ScheduleTable(staff_id,schedule_workday,loc_id) VALUES (1212,'TUE','2');
INSERT INTO ScheduleTable(staff_id,schedule_workday,loc_id) VALUES (1212,'WED','1');

-- RecordTable
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (1111,'Broken leg','2022-01-09 5:48:40','2022-01-11 11:19:59',3333);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (2222,'Bloody nose','2022-01-11 11:19:59','2022-01-22 21:32:13',4444);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (3333,'Broken arm','2022-01-13 22:04:50','2022-02-10 14:31:54',5555);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (4444,'Seizure','2022-01-22 21:32:13','2022-02-14 13:58:49',1111);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (5555,'Frost bite','2022-02-04 9:44:55','2022-03-23 8:30:59',6666);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (6666,'Broken arm','2022-02-10 14:31:54','2022-03-27 11:21:08',7777);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (7777,'Coughs','2022-02-10 23:47:26','2022-04-05 2:35:44',8888);
INSERT INTO RecordTable(rec_id,rec_treatment,rec_admit,rec_leave,pat_id) VALUES (8888,'Diarrhea','2022-02-14 13:58:49','2022-04-16 1:48:29',1111);

-- PrescriptionTable
INSERT INTO PrescriptionTable(rx_id,doc_id,med_name,rx_start,rx_end,rx_desc,pat_id) VALUES (1,1212,'Ritalin','2022-01-09 5:48:40',NULL,'Patient is taking 2 times a week.',1111);
INSERT INTO PrescriptionTable(rx_id,doc_id,med_name,rx_start,rx_end,rx_desc,pat_id) VALUES (2,1212,'Ibuprofen','2022-01-11 11:19:59',NULL,'OTC for patient.',2222);
INSERT INTO PrescriptionTable(rx_id,doc_id,med_name,rx_start,rx_end,rx_desc,pat_id) VALUES (3,2323,'Cough drops','2022-01-13 22:04:50',NULL,'Patient is taking for mild cold.',3333);










