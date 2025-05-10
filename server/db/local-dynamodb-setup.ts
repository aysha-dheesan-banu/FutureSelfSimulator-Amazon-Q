import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";
import { setupTables, listTables } from "./setup";

/**
 * This script sets up a local DynamoDB instance for development
 */
async function setupLocalDynamoDB() {
  console.log("Setting up local DynamoDB...");
  
  // Check if we're using a local endpoint
  if (!config.aws.dynamodbEndpoint?.includes("localhost") && 
      !config.aws.dynamodbEndpoint?.includes("127.0.0.1")) {
    console.error("This script is intended for local DynamoDB only.");
    console.error(`Current endpoint: ${config.aws.dynamodbEndpoint}`);
    process.exit(1);
  }
  
  // Create a client specifically for local DynamoDB
  const client = new DynamoDBClient({
    region: "local-env",
    endpoint: config.aws.dynamodbEndpoint,
    credentials: {
      accessKeyId: "fakeMyKeyId",
      secretAccessKey: "fakeSecretAccessKey",
    },
    tls: false
  });
  
  const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  });
  
  try {
    // List existing tables
    console.log("Checking existing tables...");
    const tables = await listTables();
    console.log(`Found ${tables.length} tables: ${tables.join(", ") || "none"}`);
    
    // Set up tables
    console.log("Creating tables if they don't exist...");
    await setupTables();
    
    // Add some sample data
    console.log("Adding sample data...");
    
    // Sample user
    await docClient.send(new PutCommand({
      TableName: "future_self_users",
      Item: {
        id: 1,
        username: "demo",
        password: "password123", // In a real app, this would be hashed
        email: "demo@example.com",
        name: "Demo User",
        avatarUrl: "/avatars/female-1.png",
        level: 1,
        points: 0,
        traits: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 },
        preferences: { gender: "female", theme: "light" }
      }
    }));
    
    console.log("✅ Local DynamoDB setup complete!");
  } catch (error) {
    console.error("❌ Error setting up local DynamoDB:", error);
    process.exit(1);
  }
}

// Run the setup
setupLocalDynamoDB().catch(console.error);