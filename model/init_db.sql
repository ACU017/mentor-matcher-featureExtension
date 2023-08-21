--
-- Drop Tables
--

SET foreign_key_checks = 0;
DROP TABLE if exists mentees;
DROP TABLE if exists mentors;
DROP TABLE if exists mentor_mentee;
SET foreign_key_checks = 1;


--
-- Create Tables
--

CREATE TABLE mentees(
    id INT NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(225) not null, 
    last_name VARCHAR(225) not null,
    email VARCHAR(40) not null, 
    linkedin_url VARCHAR(225),
    q1 VARCHAR(500) not null,
    q2 VARCHAR(500) not null,
    q3 VARCHAR(500) not null,
    q4 VARCHAR(500) not null,
    q5 VARCHAR(500) not null,
    q6 VARCHAR(500) not null,
    q7 VARCHAR(500) not null,
    PRIMARY KEY (id)
    );


CREATE TABLE mentors ( 
    id INT NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(225) not null, 
    last_name VARCHAR(225) not null,
    email VARCHAR(40) not null,
    linkedin_url VARCHAR(225),
    q1 VARCHAR(500) not null,
    q2 VARCHAR(500) not null,
    q3 VARCHAR(500) not null,
    q4 VARCHAR(500) not null,
    q5 VARCHAR(500) not null,
    q6 VARCHAR(500) not null,
    q7 VARCHAR(500) not null,
    PRIMARY KEY (id)
    );

CREATE TABLE mentor_mentee (
    id INT NOT NULL AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    mentee_id INT NOT NULL,
    compatibility_score INT,
    compatibility_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    FOREIGN KEY (mentee_id) REFERENCES mentees(id)
    );


CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);