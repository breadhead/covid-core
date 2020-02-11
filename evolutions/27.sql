CREATE TABLE base_doctor_base_clinic
(
    base_doctor_id uuid NOT NULL,
    base_clinic_id uuid NOT NULL
);


CREATE TABLE product_tag
(
  product_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT base_doctor_base_clinic_base_doctor_id_fk FOREIGN KEY (base_doctor_id) REFERENCES base_doctor (id),
  CONSTRAINT base_doctor_base_clinic_base_clinic_id_fk FOREIGN KEY (base_clinic_id) REFERENCES base_clinic (id),
  CONSTRAINT base_doctor_base_clinic_pkey PRIMARY KEY (base_doctor_id,base_clinic_id)
);


#DOWN
DROP TABLE base_doctor_base_clinic;
