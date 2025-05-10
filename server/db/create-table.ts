import { 
  CreateTableCommand, 
  KeyType, 
  AttributeType,
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import { config } from "../config";

// Create a DynamoDB client
const client = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId || "",
    secretAccessKey: config.aws.secretAccessKey || "",
  },
  maxAttempts: 5
});

// Function to create a new table
export async function createNewTable(tableName: string): Promise<void> {
  try {
    console.log(`Creating new table: ${tableName}`);
    
    const params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: "id", KeyType: KeyType.HASH }
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: AttributeType.N }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    
    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    
    console.log(`Table created successfully: ${tableName}`);
    console.log(`Table status: ${response.TableDescription?.TableStatus}`);
    
    // Wait for the table to become active
    console.log(`Waiting for table ${tableName} to become active...`);
    await waitForTableActive(tableName);
    
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
}

// Function to wait for a table to become active
async function waitForTableActive(tableName: string, maxRetries = 20): Promise<void> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const { DescribeTableCommand } = await import("@aws-sdk/client-dynamodb");
      const response = await client.send(new DescribeTableCommand({ TableName: tableName }));
      
      if (response.Table?.TableStatus === 'ACTIVE') {
        console.log(`Table ${tableName} is now active.`);
        return;
      }
      
      console.log(`Table ${tableName} status: ${response.Table?.TableStatus}, waiting...`);
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries++;
    } catch (error: any) {
      console.error(`Error checking table status: ${error.message}`);
      throw error;
    }
  }
  
  console.log(`Timed out waiting for table ${tableName} to become active.`);
}

// Execute this script directly if needed
if (require.main === module) {
  const newTableName = process.argv[2];
  
  if (!newTableName) {
    console.error("Please provide a table name as an argument");
    process.exit(1);
  }
  
  createNewTable(newTableName)
    .then(() => {
      console.log("Table creation completed");
      process.exit(0);
    })
    .catch(error => {
      console.error("Failed to create table:", error);
      process.exit(1);
    });
}