CREATE TABLE base_doctor_base_clinic
(
    base_doctor_id VARCHAR(255),
    base_clinic_id VARCHAR(255),
    CONSTRAINT base_doctor_base_clinic_base_doctor_id_fk FOREIGN KEY (base_doctor_id) REFERENCES base_doctor (id),
    CONSTRAINT base_doctor_base_clinic_base_clinic_id_fk FOREIGN KEY (base_clinic_id) REFERENCES base_clinic (id),
    PRIMARY KEY (base_doctor_id, base_clinic_id)
);

#DOWN
DROP TABLE IF EXISTS base_doctor_base_clinic;
