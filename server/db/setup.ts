import { 
  CreateTableCommand, 
  DescribeTableCommand, 
  ResourceNotFoundException,
  KeySchemaElement,
  AttributeDefinition,
  ListTablesCommand,
  KeyType
} from "@aws-sdk/client-dynamodb";
import { ddbDocClient, TABLES } from "./dynamodb";

// Function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    await ddbDocClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return false;
    }
    throw error;
  }
}

// Wait for a table to be active (polling)
export async function waitForTableActive(tableName: string, maxRetries = 20): Promise<boolean> {
  console.log(`Waiting for table ${tableName} to become active...`);
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await ddbDocClient.send(new DescribeTableCommand({ TableName: tableName }));
      
      if (response.Table?.TableStatus === 'ACTIVE') {
        console.log(`Table ${tableName} is now active.`);
        return true;
      }
      
      console.log(`Table ${tableName} status: ${response.Table?.TableStatus}, waiting...`);
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      retries++;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        console.log(`Table ${tableName} does not exist.`);
        return false;
      }
      throw error;
    }
  }
  
  console.log(`Timed out waiting for table ${tableName} to become active.`);
  return false;
}

// Function to create a table if it doesn't exist
export async function createTableIfNotExists(
  tableName: string,
  keySchema: KeySchemaElement[],
  attributeDefinitions: AttributeDefinition[]
): Promise<boolean> {
  try {
    if (await tableExists(tableName)) {
      console.log(`Table ${tableName} already exists.`);
      // Make sure the table is in ACTIVE state before using it
      await waitForTableActive(tableName);
      return false;
    }

    try {
      // Try to create table
      await ddbDocClient.send(
        new CreateTableCommand({
          TableName: tableName,
          KeySchema: keySchema.map(k => ({ 
            AttributeName: k.AttributeName,
            KeyType: k.KeyType as KeyType
          })),
          AttributeDefinitions: attributeDefinitions,
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        })
      );
      
      console.log(`Created table ${tableName}. Waiting for it to become active...`);
      // Wait for the table to become active
      await waitForTableActive(tableName);
      return true;
    } catch (createError: any) {
      // If the table already exists or is being created, wait for it to become active
      if (createError?.__type === 'com.amazonaws.dynamodb.v20120810#ResourceInUseException') {
        console.log(`Table ${tableName} is already being created. Waiting for it to become active...`);
        await waitForTableActive(tableName);
        return true;
      }
      throw createError;
    }
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
}

// Function to list all tables
export async function listTables(): Promise<string[]> {
  try {
    const response = await ddbDocClient.send(new ListTablesCommand({}));
    console.log("Available tables:", response.TableNames);
    return response.TableNames || [];
  } catch (error) {
    console.error("Error listing tables:", error);
    return [];
  }
}

// Function to set up all tables
export async function setupTables(): Promise<void> {
  try {
    // First, list tables to make sure our connection works
    const existingTables = await listTables();
    console.log("Starting table setup...");
    
    // Setup table definitions
    const tablesToCreate = [
      {
        name: TABLES.USERS,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      },
      {
        name: TABLES.FUTURE_PROFILES,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      },
      {
        name: TABLES.GOALS,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      },
      {
        name: TABLES.HABITS,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      },
      {
        name: TABLES.JOURNALS,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      },
      {
        name: TABLES.CONVERSATIONS,
        keySchema: [{ AttributeName: "id", KeyType: KeyType.HASH }] as KeySchemaElement[],
        attributes: [{ AttributeName: "id", AttributeType: "N" }] as AttributeDefinition[]
      }
    ];
    
    // Create or validate each table
    for (const table of tablesToCreate) {
      try {
        // Check if table already exists or is being created
        if (existingTables.includes(table.name)) {
          console.log(`Table ${table.name} already exists, ensuring it's active...`);
          await waitForTableActive(table.name);
          continue;
        }
        
        // Create the table and wait for it to be active
        await createTableIfNotExists(
          table.name,
          table.keySchema,
          table.attributes
        );
      } catch (tableError) {
        console.error(`Error setting up table ${table.name}:`, tableError);
        // Continue with next table instead of failing entire setup
      }
    }

    console.log("All tables set up successfully.");
  } catch (error) {
    console.error("Error setting up tables:", error);
    throw error;
  }
}