CREATE TABLE form
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    type varchar(50) NOT NULL,
    fields json,
    status varchar(30) NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp
);
CREATE INDEX form_status_idx ON form (status);
CREATE INDEX form_type_idx ON form (type);
CREATE INDEX form_created_at_idx ON form (created_at);
CREATE INDEX form_updated_at_idx ON form (updated_at);

#DOWN
DROP TABLE IF EXISTS form;
