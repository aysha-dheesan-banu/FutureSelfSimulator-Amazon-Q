import { 
  ListTablesCommand,
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

// Function to list all tables
export async function listTables(): Promise<string[]> {
  try {
    console.log("Listing all DynamoDB tables...");
    
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    const tableNames = response.TableNames || [];
    
    console.log("Tables found:", tableNames.length);
    tableNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    return tableNames;
  } catch (error) {
    console.error("Error listing tables:", error);
    throw error;
  }
}

// Execute this script directly
(async () => {
  try {
    await listTables();
    process.exit(0);
  } catch (error) {
    console.error("Failed to list tables:", error);
    process.exit(1);
  }
})();