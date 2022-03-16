let mysql = require('mysql2')
let inquirer = require('inquirer')
let table = require('console.table')
let express = require('express');
const res = require('express/lib/response');
const PORT = process.env.PORT || 3008;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$0487adF!',
    database: 'employees_db'
});

const startPage = () => {
    inquirer.prompt([{
        name: "start",
        type: "list",
        message: "Welcome please choose from the following option to use app.",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Delete Employee"
        ]

    }]).then(answer => {
        switch (answer.start) {
            case "View all departments":
                viewDepartments()
                break;
            case "View all roles":
                viewRoles()
                break;
            case "View all employees":
                viewEmployees()
                break;
            case "Add a department":
                addDepartments()
                break;
            case "Add a role":
                addRole()
                break;
            case "Add an employee":
                addEmployee()
                break;
            case "Update an employee role":
                updateEmployeeRole()
                break;
            case "Delete Employee":
                deleteEmployee()
                break
        }
    })
}
function viewDepartments() {
    db.query(' SELECT department.id,department.name FROM department', function (err, results) {
        console.log(`\n`)
        console.table(results);
        return err;
    });
    startPage();
}
function viewEmployees() {
    db.query('SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, department.name FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON role.department_id = department.id;;', function (err, results) {
        console.log(`\n`)
        console.table(results);
        return err;
    });
    startPage();
}
function viewRoles() {
    db.query('SELECT role.department_id, role.title, role.salary FROM role;', function (err, results) {
        console.log(`\n`)
        console.table(results);
        return err;
    });
    startPage();
}

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the role?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary of this role?",
            name: "salary"
        },
        {
            type: "input",
            message: "What is the department id number?",
            name: "department"
        }
    ]).then((response) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department], (err, res) => {
            if (err) throw err;
            console.log("Role added!");
            startPage();
        })
    })
}
const addDepartments = () => {
    inquirer.prompt({
        type: "input",
        message: "What is the name of your new department? ",
        name: "department"
    }).then((response) => {
        db.query("INSERT INTO department (name) VALUES (?)", response.department, (err, res) => {
            if (err) throw err;
            console.log("Department Added")
            startPage();
        })
    })
}
const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's First Name? ",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's Last Name? ",
            name: "lastName"
        },
        {
            type: "number",
            message: "What is the employee's Role ID? ",
            name: "roleId"
        },
        {
            type: "number",
            message: "What is the employee's Manager's ID? ",
            name: "managerId"
        }
    ]).then((response) => {
        //const {firstName, lastName, roleId, managerId} = response;
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.firstName, response.lastName, response.roleId, response.managerId], (err, response) => {
            console.log('Employee added!')
            return err;

        })
        startPage();
    })
    
}
function updateEmployeeRole() { 
    employeeArray();
  
  }
  
  function employeeArray() {
    console.log("Updating an employee");
  
    var query =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id
    JOIN employee m ON m.id = e.manager_id`
  
    db.query(query, function (err, res) {
      if (err) throw err;
  
      const employeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`      
      }));
  
      console.table(res);
      console.log("employeeArray To Update!\n")
  
      roleArray(employeeChoices);
    });
  }
  
  function roleArray(employeeChoices) {
    console.log("Updating an role");
  
    var query =
      `SELECT r.id, r.title, r.salary 
    FROM role r`
    let roleChoices;
  
    db.query(query, function (err, res) {
      if (err) throw err;
  
      roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`      
      }));
  
      console.table(res);
      console.log("roleArray to Update!\n")
  
      updateEmployeePrompt(employeeChoices, roleChoices);
    });
  }
  
const updateEmployeePrompt = (employeeChoices, roleChoices) => {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
            name: "update"
        },

        {
            type: "list",
            message: "Pick updated role.",
            choices: roleChoices,
            name: "updateRole"
        }
    ])
        .then((response) => {

            db.query('UPDATE employee SET role_id=? WHERE id= ?', [response.updateRole, response.update], function (err, res) {
                if (err) throw err;
                console.log('Employee Role Updated!');
                startPage();
            });
        });
}
const deleteEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employees id?",
            name: "deleteEmp"
        }
    ]).then((response) => {
        db.query('DELETE FROM employee WHERE role_id = ?', [response.deleteEmp], (err, res) =>{
            console.log('Employee Deleted')
            return err;
        })
        startPage()
    })
}
startPage()

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



