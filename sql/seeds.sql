-- testing transaction to insert data into the tables
-- DO $$
-- DECLARE

-- BEGIN

-- insert data into the tables - department, roles, employees
INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('HR');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Software Engineer', 80000, 1),
    ('Sales Representative', 50000, 2),
    ('HR Manager', 70000, 3);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Mike', 'Brown', 3, NULL);

--     RAISE NOTICE 'Transaction completed';

-- EXCEPTION
--     WHEN OTHERS THEN
--         RAISE NOTICE 'Transaction rolled back';
--         ROLLBACK;
-- END $$;


-- display the data in the tables
SELECT *
FROM department;
SELECT *
FROM roles;
SELECT *
FROM employees;

-- display the data in the tables with the relationships using JOIN
-- SELECT *
-- FROM employees
--     JOIN roles ON employees.role_id = roles.id





