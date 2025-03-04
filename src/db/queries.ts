import inquirer from "inquirer";
import { pool } from "./connection.js";

// View all employees
export async function viewAllEmployees() {
  try {
    const res = await pool.query(`
          SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title, 
            d.name AS department, 
            r.salary, 
            m.first_name || ' ' || m.last_name AS manager
          FROM employees e
          LEFT JOIN roles r ON e.role_id = r.id
          LEFT JOIN department d ON r.department_id = d.id
          LEFT JOIN employees m ON e.manager_id = m.id
          ORDER BY e.id;
        `);

    console.log(
      "\nid  first_name  last_name   title                   department      salary   manager"
    );
    console.log(
      "--  ----------  --------    ---------------------   ----------      ------   ----------"
    );

    res.rows.forEach((emp) => {
      console.log(
        `${emp.id.toString().padEnd(2)}  ${emp.first_name.padEnd(10)}  ${emp.last_name.padEnd(10)}  ${emp.title.padEnd(22)}  ${emp.department.padEnd(14)}  ${emp.salary.toString().padEnd(7)}  ${emp.manager || "null"}`
      );
    });
    console.log("\n");
  } catch (err) {
    console.error("Error getting employees:", err);
  }
}

// Add a new employee
export async function addEmployee(
  firstName: string,
  lastName: string,
  roleId: number,
  managerId: number | null
) {
  try {
    await pool.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, roleId, managerId]
    );
  } catch (err) {
    console.error("Error adding employee:", err);
  }
}

// Update employee role
export async function updateEmployeeRole(employeeId: number, roleId: number) {
  try {
    const res = await pool.query(
      "UPDATE employees SET role_id = $1 WHERE id = $2",
      [roleId, employeeId]
    );

    // Garante que a atualização foi bem-sucedida antes de exibir a mensagem
    if (res.rowCount !== null && res.rowCount > 0) {
      console.log("Updated employee's role successfully");
    } else {
      console.log("No changes made. Employee ID may not exist.");
    }
  } catch (err) {
    console.error("Error updating employee role:", err);
  }
}

// View all roles
export async function viewAllRoles() {
  try {
    const res = await pool.query(`
        SELECT r.id, r.title, d.name AS department, r.salary 
        FROM roles r
        JOIN department d ON r.department_id = d.id
        ORDER BY r.id
      `);

    console.log("\nid  title                   department      salary");
    console.log("--  ---------------------   ----------      ------");

    res.rows.forEach((role) => {
      console.log(
        `${role.id.toString().padEnd(2)}  ${role.title.padEnd(22)}  ${role.department.padEnd(14)}  ${role.salary.toString().padEnd(7)}`
      );
    });

    console.log("\n");
  } catch (err) {
    console.error("Error getting roles:", err);
  }
}

// Add a new role
export async function addRole(
  title: string,
  salary: number,
  departmentId: number
) {
  try {
    await pool.query(
      "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, departmentId]
    );
  } catch (err) {
    console.error("Error adding role:", err);
  }
}

// Show all departments
export async function viewAllDepartments() {
  try {
    const res = await pool.query("SELECT id, name FROM department ORDER BY id");

    console.log("\nid  department");
    console.log("--  ----------");

    res.rows.forEach((dept) => {
      console.log(`${dept.id.toString().padEnd(2)}  ${dept.name.padEnd(10)}`);
    });

    console.log("\n");
  } catch (err) {
    console.error("Error getting departments:", err);
  }
}

// Add a new department
export async function addDepartment(departmentName: string) {
  try {
    // Verifica se o departamento já existe
    const checkRes = await pool.query(
      "SELECT * FROM department WHERE name = $1",
      [departmentName]
    );

    if (checkRes.rowCount !== null && checkRes.rowCount > 0) {
      console.log(`Department "${departmentName}" already exists.`);
      return;
    }

    // Insere o novo departamento apenas se ele não existir
    const res = await pool.query(
      "INSERT INTO department (name) VALUES ($1) RETURNING *",
      [departmentName]
    );

    if (res.rowCount !== null && res.rowCount > 0) {
      console.log(`Added ${departmentName} to the database.`);
    }
  } catch (err) {
    console.error("Error adding department:", err);
  }
}
