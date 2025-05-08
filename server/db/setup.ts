import { 
  CreateTableCommand, 
  DescribeTableCommand, 
  ResourceNotFoundException,
  KeySchemaElement,
  AttributeDefinition
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

// Function to create a table if it doesn't exist
export async function createTableIfNotExists(
  tableName: string,
  keySchema: KeySchemaElement[],
  attributeDefinitions: AttributeDefinition[]
): Promise<boolean> {
  try {
    if (await tableExists(tableName)) {
      console.log(`Table ${tableName} already exists.`);
      return false;
    }

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

    console.log(`Created table ${tableName}.`);
    return true;
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
}

// Function to set up all tables
export async function setupTables(): Promise<void> {
  try {
    // Users table
    await createTableIfNotExists(
      TABLES.USERS,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" }
      ]
    );

    // Create index on username
    await createTableIfNotExists(
      TABLES.USERS,
      [
        { AttributeName: "username", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "username", AttributeType: "S" }
      ]
    );

    // Future profiles table
    await createTableIfNotExists(
      TABLES.FUTURE_PROFILES,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" },
      ]
    );

    // Goals table
    await createTableIfNotExists(
      TABLES.GOALS,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" },
      ]
    );

    // Habits table
    await createTableIfNotExists(
      TABLES.HABITS,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" },
      ]
    );

    // Journals table
    await createTableIfNotExists(
      TABLES.JOURNALS,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" },
      ]
    );

    // Conversations table
    await createTableIfNotExists(
      TABLES.CONVERSATIONS,
      [
        { AttributeName: "id", KeyType: "HASH" } // Partition key
      ],
      [
        { AttributeName: "id", AttributeType: "N" },
      ]
    );

    console.log("All tables set up successfully.");
  } catch (error) {
    console.error("Error setting up tables:", error);
    throw error;
  }
}