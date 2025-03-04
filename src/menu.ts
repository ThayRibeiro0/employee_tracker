import inquirer from "inquirer";
import {
  viewAllEmployees,
  viewAllRoles,
  viewAllDepartments,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} from "./db/queries.js";
import { connectToDb, pool } from "./db/connection.js";

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    },
  ]);

  switch (action) {
    case "View All Employees":
      await viewAllEmployees();
      break;
    case "Add Employee":
      await promptAddEmployee();
      break;
    case "Update Employee Role":
      await promptUpdateEmployeeRole();
      break;
    case "View All Roles":
      await viewAllRoles();
      break;
    case "Add Role":
      await promptAddRole();
      break;
    case "View All Departments":
      await viewAllDepartments();
      break;
    case "Add Department":
      await promptAddDepartment();
      break;
    case "Quit":
      console.log("Goodbye!");
      process.exit();
  }
  mainMenu();
}

// Prompt para adicionar um departamento
async function promptAddDepartment() {
  const { departmentName } = await inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    },
  ]);

  await addDepartment(departmentName);
}

// Prompt para adicionar um novo cargo (role)
async function promptAddRole() {
    try {
        // Buscar todos os departamentos do banco de dados
        const departmentsRes = await pool.query("SELECT id, name FROM department ORDER BY id");
        let departments = departmentsRes.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        // Adicionar opção para criar um novo departamento
        departments.push({ name: "Create New Department", value: "new" });

        // Perguntar o nome e salário do cargo
        const { title, salary, departmentId } = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?",
            },
            {
                type: "number",
                name: "salary",
                message: "What is the salary of the role?",
            },
            {
                type: "list",
                name: "departmentId",
                message: "Which department does the role belong to?",
                choices: departments,
            },
        ]);

        let finalDepartmentId = departmentId;

        // Se o usuário escolher criar um novo departamento
        if (departmentId === "new") {
            const { newDepartmentName } = await inquirer.prompt([
                {
                    type: "input",
                    name: "newDepartmentName",
                    message: "Enter the name of the new department:",
                },
            ]);

            // Inserir o novo departamento no banco
            const newDeptRes = await pool.query(
                "INSERT INTO department (name) VALUES ($1) RETURNING id",
                [newDepartmentName]
            );
            finalDepartmentId = newDeptRes.rows[0].id;
            console.log(`New department '${newDepartmentName}' added successfully!`);
        }

        // Inserir o novo cargo com o departamento correto
        await addRole(title, salary, finalDepartmentId);
        console.log(`Added role '${title}' to database`);

    } catch (err) {
        console.error("Error adding role:", err);
    }
}


// Prompt para adicionar um novo funcionário
async function promptAddEmployee() {
  try {
    // Buscar todos os cargos do banco de dados
    const rolesRes = await pool.query(
      "SELECT id, title FROM roles ORDER BY id"
    );
    const roles = rolesRes.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    if (roles.length === 0) {
      console.log("No roles available. Please add a role first.");
      return;
    }

    // Buscar todos os gerentes disponíveis (funcionários que podem ser gerentes)
    const managersRes = await pool.query(
      "SELECT id, first_name, last_name FROM employees ORDER BY id"
    );
    const managers = managersRes.rows.map((manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));

    // Adiciona opção para 'Nenhum Gerente'
    managers.unshift({ name: "None", value: null });

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee’s first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee’s last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee’s role?" ,
        choices: roles,
        pageSize: 5,
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the employee’s manager?",
        choices: managers,
        pageSize: 5,
        default: null,
      },
    ]);

    await addEmployee(firstName, lastName, roleId, managerId);
    console.log(`Added ${firstName} ${lastName} to database`);
  } catch (err) {
    console.error("Error adding employee:", err);
  }
}

//Update employee role
async function promptUpdateEmployeeRole() {
  try {
    // Buscar todos os funcionários do banco de dados
    const employeesRes = await pool.query(
      "SELECT id, first_name, last_name FROM employees ORDER BY id"
    );
    const employees = employeesRes.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    if (employees.length === 0) {
      console.log("No employees available. Please add an employee first.");
      return;
    }

    // Buscar todos os cargos do banco de dados
    const rolesRes = await pool.query(
      "SELECT id, title FROM roles ORDER BY id"
    );
    const roles = rolesRes.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    if (roles.length === 0) {
      console.log("No roles available. Please add a role first.");
      return;
    }

    // Perguntar ao usuário qual funcionário e qual novo cargo
    const { employeeId, newRoleId } = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee’s role do you want to update?",
        choices: employees,
      },
      {
        type: "list",
        name: "newRoleId",
        message: "Which role do you want to assign to the selected employee?",
        choices: roles,
      },
    ]);

    // Atualiza o cargo do funcionário **apenas uma vez**
    await updateEmployeeRole(employeeId, newRoleId);
  } catch (err) {
    console.error("Error updating employee role:", err);
  }
}

// Conectar ao banco de dados e iniciar o menu
connectToDb().then(() => mainMenu());
