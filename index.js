let mysql = require('mysql2')
let inquirer = require('inquirer')
let table = require('console.table')
 let express = require('express');
const PORT = process.env.PORT || 3008;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '$insertYourPassword$',
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
            "Update an employee role"
        ]

    }]).then( answer => {
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
                updateEmployee()
             break;  
        }
    })
}
function viewDepartments(){
    db.query(' SELECT department.id,department.name FROM department', function (err, results) {
        console.log(results);
         return err;
      });
        startPage(); 
}
function viewEmployees(){
    db.query('SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee;', function (err, results) {
        console.table(results);
         return err;
      });
        startPage(); 
}
function viewRoles(){
    db.query('SELECT role.department_id, role.title, role.salary FROM role;', function (err, results) {
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
            name: "dept"
          }
    ]).then((response) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.dept], (err, res) => {
            if (err) throw err;
            console.log("role added!");
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
            console.table(res)
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
        const {firstName, lastName, roleId, managerId} = response;
    
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId], (err, data) => {
            if (err) throw err;
            console.table(data)
            startPage();
        })
    })
}
function updateEmployee() {
    inquirer.prompt([
        {
          type: "input",
          message: "Which employee would you like to update?",
          name: "update"
        },
  
        {
          type: "input",
          message: "Inset updated role.",
          name: "updateRole"
        }
      ])
      .then(function(response) {
  
        db.query('UPDATE employee SET role_id=? WHERE first_name= ?',[response.updateRole, response.update],function(err, res) {
          if (err) throw err;
          console.table(res);
          startPage();
        });
      });
  }

startPage()

  app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });



