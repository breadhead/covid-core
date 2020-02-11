CREATE TABLE base_doctor_base_clinic
(
    base_doctor_id VARCHAR(255),
    base_clinic_id VARCHAR(255),
    FOREIGN KEY (base_doctor_id) REFERENCES base_doctor (id),
    FOREIGN KEY (base_clinic_id) REFERENCES base_clinic (id),
    PRIMARY KEY (base_doctor_id, base_clinic_id)
);

#DOWN
DROP TABLE IF EXISTS base_doctor_base_clinic;
