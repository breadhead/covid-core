CREATE TABLE base_clinic
(
    id VARCHAR(255),
    name VARCHAR(255),
    city VARCHAR(255),
    PRIMARY KEY (id)
    );


#DOWN
DROP TABLE base_clinic;
