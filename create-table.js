// Simple script to create a new DynamoDB table
import { createNewTable } from './server/db/create-table.js';

// Get table name from command line argument
const tableName = process.argv[2];

if (!tableName) {
  console.error('Please provide a table name as an argument');
  process.exit(1);
}

console.log(`Creating new table: ${tableName}`);

createNewTable(tableName)
  .then(() => {
    console.log(`Table ${tableName} created successfully!`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error creating table:', error);
    process.exit(1);
  });