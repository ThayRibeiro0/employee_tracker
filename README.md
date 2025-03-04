# Employee_Tracker

This is a simple employee tracker application built using Node.js, Express, and PostgreSQL. It allows users to add, view, and update employee information, as well as manage departments and roles.

## Video Demo
[Watch the demo here](https://www.loom.com/share/ce09f4cf457e4614afc130339c3eefb8)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/thaysmoiaribeiro/employee-tracker.git
```

2. Navigate to the project directory:

```bash
cd employee-tracker
```

3. Install the required dependencies:

```bash
npm install
```

4. Run PostgreSQL shell and add the password for the user:

```bash
psql -U postgres 
```

5. Run the schema SQL script to create the database and tables:

```sql
\i sql/schema.sql
```

6. Run the seeds.sql to create the tables and relationships:

```sql
\i sql/seeds.sql
```

8. Exit the PostgreSQL shell:

```sql
\q
```

### Usage

To run the application, follow these steps:

1. Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=name_of_your_database
```

2. Replace the placeholders with your actual PostgreSQL database credentials.

3. Run the application - Compile the TypeScript files:

```bash
npm run build
```

4. Run the application:

```bash
npm run start
```

5. You will be greeted with the ASCII art is a form of digital art that uses text characters to create images and designs. It is based on the ASCII (American Standard Code for Information Interchange) character set, which includes letters, numbers, and symbols.

6. You will be greeted with the main menu:

- Add employees
- View all employees
- Update employee roles
- View all roles
- Add roles
- View all departments
- Add departments
- Quit the application

7. Use the arrow keys to navigate through the menu options.

8. To add a new employee, enter the employee's first name, last name, role, and manager (if applicable).

9. To update an employee's role, enter the employee's ID and the new role.

10. To view all employees, use the `View All Employees` option, the same for roles and departments, use the corresponding options.

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.