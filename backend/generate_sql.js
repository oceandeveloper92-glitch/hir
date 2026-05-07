const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function dumpDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hir_international'
  });

  const [tables] = await connection.query('SHOW TABLES');
  let sqlDump = '-- Database export for MySQL\n\n';

  for (let record of tables) {
    const tableName = Object.values(record)[0];
    const [createTableResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
    const createTableStmt = Object.values(createTableResult[0])[1];
    sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    sqlDump += `${createTableStmt};\n\n`;
  }

  // Generate Admin UUID and Employee UUID
  const { v4: uuidv4 } = require('uuid');
  const adminId = uuidv4();
  const empId = uuidv4();
  const deptId = uuidv4();

  sqlDump += `-- Insert Department for Employee\n`;
  sqlDump += `INSERT IGNORE INTO \`departments\` (\`id\`, \`name\`, \`description\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES ('${deptId}', 'Sales', 'General Sales Department', 'active', NOW(), NOW());\n\n`;

  sqlDump += `-- Insert Default Admin Master User\n`;
  // Master users have isMaster true
  sqlDump += `INSERT IGNORE INTO \`employees\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password\`, \`isMaster\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES ('${adminId}', 'Master Admin', 'admin@hir.com', '1234567890', 'admin123', 1, 'active', NOW(), NOW());\n\n`;

  sqlDump += `-- Insert Regular Employee\n`;
  sqlDump += `INSERT IGNORE INTO \`employees\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password\`, \`departmentId\`, \`isMaster\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES ('${empId}', 'Test Employee', 'employee@hir.com', '0987654321', 'emp123', '${deptId}', 0, 'active', NOW(), NOW());\n\n`;

  const outputPath = path.join(__dirname, 'full_db_schema.sql');
  fs.writeFileSync(outputPath, sqlDump, 'utf8');
  console.log(`Schema successfully written to ${outputPath}`);
  
  await connection.end();
}

dumpDatabase().catch(console.error);
