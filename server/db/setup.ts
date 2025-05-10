import {
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
  KeySchemaElement,
  AttributeDefinition,
  ListTablesCommand,
  KeyType,
} from "@aws-sdk/client-dynamodb";
import { ddbDocClient, TABLES } from "./dynamodb";

// Utility sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    await ddbDocClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) return false;
    throw error;
  }
}

// Wait until a table becomes ACTIVE
export async function waitForTableActive(tableName: string, maxRetries = 20): Promise<boolean> {
  console.log(`Waiting for table ${tableName} to become active...`);
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { Table } = await ddbDocClient.send(new DescribeTableCommand({ TableName: tableName }));
      if (Table?.TableStatus === "ACTIVE") {
        console.log(`Table ${tableName} is now active.`);
        return true;
      }
      console.log(`Status: ${Table?.TableStatus}, retrying...`);
      await sleep(5000);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        console.log(`Table ${tableName} not found.`);
        return false;
      }
      throw error;
    }
  }
  console.log(`Timed out waiting for table ${tableName}.`);
  return false;
}

// Create a DynamoDB table if it doesn't exist
export async function createTableIfNotExists(
  tableName: string,
  keySchema: KeySchemaElement[],
  attributeDefinitions: AttributeDefinition[]
): Promise<boolean> {
  if (await tableExists(tableName)) {
    console.log(`Table ${tableName} already exists.`);
    return await waitForTableActive(tableName);
  }

  try {
    await ddbDocClient.send(
      new CreateTableCommand({
        TableName: tableName,
        KeySchema: keySchema,
        AttributeDefinitions: attributeDefinitions,
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );
    console.log(`Created table ${tableName}. Waiting for it to become active...`);
    return await waitForTableActive(tableName);
  } catch (error: any) {
    if (error.name === "ResourceInUseException") {
      console.log(`Table ${tableName} is already being created. Waiting...`);
      return await waitForTableActive(tableName);
    }
    console.error(`Failed to create table ${tableName}:`, error);
    throw error;
  }
}

// List all existing DynamoDB tables
export async function listTables(): Promise<string[]> {
  try {
    const response = await ddbDocClient.send(new ListTablesCommand({}));
    console.log("Existing tables:", response.TableNames);
    return response.TableNames || [];
  } catch (error) {
    console.error("Error listing tables:", error);
    return [];
  }
}

// Main function to set up all required tables
export async function setupTables(): Promise<void> {
  try {
    const tablesToCreate = [
      { name: TABLES.USERS },
      { name: TABLES.FUTURE_PROFILES },
      { name: TABLES.GOALS },
      { name: TABLES.HABITS },
      { name: TABLES.JOURNALS },
      { name: TABLES.CONVERSATIONS },
    ];

    for (const { name } of tablesToCreate) {
      const keySchema = [{ AttributeName: "id", KeyType: "HASH" as KeyType }];
      const attributeDefinitions = [{ AttributeName: "id", AttributeType: "N" }]; // or "S" if using string UUIDs
      try {
        await createTableIfNotExists(name, keySchema, attributeDefinitions);
      } catch (err) {
        console.error(`Error setting up table ${name}:`, err);
      }
    }

    console.log("✅ All tables set up.");
  } catch (err) {
    console.error("❌ Failed to set up tables:", err);
    throw err;
  }
}