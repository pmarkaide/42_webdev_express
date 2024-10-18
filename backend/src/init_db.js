// const fs = require('fs');
// const path = require('path');
// const pool = require('./db');

// const runSQLScript = async () => {
//   try {
//     const sqlPath = path.join(__dirname, 'rich_init_db.sql');
//     const sql = fs.readFileSync(sqlPath).toString();

//     await pool.query(sql);
//     console.log('SQL script executed successfully.');
//   } catch (err) {
//     console.error('Error executing SQL script:', err);
//   } finally {
//     await pool.end();
//   }
// };

// // Run the script
// runSQLScript();
