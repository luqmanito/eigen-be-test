1. SELECT * FROM employees;

2. SELECT COUNT(*) AS total_managers
FROM employees
WHERE job_title = 'Manager';

3. SELECT name, salary
FROM employees
WHERE department IN ('Sales', 'Marketing');

4.SELECT AVG(salary) AS average_salary
FROM employees
WHERE joined_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR);

5. SELECT e.name, SUM(s.sales) AS total_sales
FROM employees e
JOIN sales_data s ON e.employee_id = s.employee_id
GROUP BY e.employee_id, e.name
ORDER BY total_sales DESC
LIMIT 5;

6. WITH average_salary AS (
    SELECT AVG(salary) AS avg_salary
    FROM employees
)
SELECT name, salary, (SELECT avg_salary FROM average_salary) AS average_salary
FROM employees
WHERE salary > (SELECT avg_salary FROM average_salary);

7. SELECT e.name, 
       SUM(s.sales) AS total_sales,
       RANK() OVER (ORDER BY SUM(s.sales) DESC) AS rank
FROM employees e
JOIN sales_data s ON e.employee_id = s.employee_id
GROUP BY e.employee_id, e.name
ORDER BY rank;

8. DELIMITER $$

CREATE PROCEDURE GetEmployeesByDepartment(dept_name VARCHAR(50))
BEGIN
    SELECT name, salary
    FROM employees
    WHERE department = dept_name;
    
    SELECT SUM(salary) AS total_salary
    FROM employees
    WHERE department = dept_name;
END$$

DELIMITER ;
