USE employees_db;
INSERT INTO department
    (name)
VALUES
    ("Sales"),
    ("Legal"),
    ("Marketing");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Sales Lead", 80000, 1),
    ("Sales Associate", 40000, 1),
    ("Senior Lawyer", 250000, 2),
    ("Junior Lawyer", 120000, 2),
    ("Marketing Manager", 80000, 3),
    ("Marketing assistant", 60000, 3);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, null),
    ("Jane", "Doe", 2, 1),
    ("Mark", "Walter", 3, null),
    ("Cesar", "Gonzales", 4, 2),
    ("Sam", "Smith", 5, null),
    ("Adam", "White", 6, 3);
    