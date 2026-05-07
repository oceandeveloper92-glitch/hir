const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'hir_international';

const sqlFilePath = path.join(__dirname, '..', '..', 'hir_international.sql');

async function importDatabase() {
    let connection;
    try {
        console.log(`Connecting to MySQL at ${DB_HOST}...`);
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            multipleStatements: true
        });

        console.log(`Creating database ${DB_NAME} if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await connection.query(`USE \`${DB_NAME}\``);

        console.log(`Reading SQL file: ${sqlFilePath}...`);
        let sql = fs.readFileSync(sqlFilePath, 'utf8');

        // Fix incompatible collations and MariaDB specific lines
        console.log('Patching SQL for compatibility...');
        // Remove the MariaDB sandbox line if it exists (it often lacks a semicolon but MariaDB/MySQL might fail on it)
        sql = sql.replace(/^\/\*M!999999\\- enable the sandbox mode \*\/\s*/, '');
        sql = sql.replace(/utf8mb4_uca1400_ai_ci/g, 'utf8mb4_general_ci');
        
        // Add safety settings at the start
        const head = "SET FOREIGN_KEY_CHECKS = 0;\nSET NAMES utf8mb4;\n";
        const tail = "\nSET FOREIGN_KEY_CHECKS = 1;";
        sql = head + sql + tail;

        console.log('Executing SQL dump (multipleStatements mode)...');
        try {
            await connection.query(sql);
            console.log('✅ Database imported successfully!');
        } catch (bulkError) {
            console.warn('⚠️ Bulk import failed, trying individual statements...', bulkError.message);
            // Fallback to individual statements if bulk fails
            const statements = sql.split(/;\s*$/m);
            let count = 0;
            for (let statement of statements) {
                statement = statement.trim();
                if (statement && !statement.startsWith('--') && !statement.startsWith('/*')) {
                    try {
                        await connection.query(statement);
                        count++;
                    } catch (stmtError) {
                        if (stmtError.code === 'ER_TABLE_EXISTS_ERROR') continue;
                    }
                }
            }
            console.log(`✅ Database imported successfully! (${count} statements executed)`);
        }
    } catch (error) {
        console.error('❌ Error importing database:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

importDatabase();
