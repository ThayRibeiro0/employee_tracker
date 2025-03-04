

-- drop the database if it exists
DROP DATABASE IF EXISTS employee_tracker;

-- create the database
CREATE DATABASE employee_tracker;

-- -- display the current database
-- SELECT proname
-- FROM pg_catalog.pg_proc
-- WHERE proname = 'employee_tracker';

-- connect to the database
\c employee_tracker

-- create the tables and their relationships - department, roles, employees
CREATE TABLE department
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- reserved word for the role then put it in the roles table
-- using foreign key
CREATE TABLE roles
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employees
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    manager_id INTEGER,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- -- display the tables
-- \d department
-- \d roles
-- \d employees    

-- display the details of the tables
\dt 
