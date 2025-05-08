import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Check if we have AWS credentials
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  console.error("AWS credentials missing. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.");
}

// Create a DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Create a document client (makes it easier to work with DynamoDB items)
export const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    // Explicitly convert empty strings, blobs, and sets to null
    convertEmptyValues: true,
    // Remove undefined values
    removeUndefinedValues: true,
    // Convert typeof object to map attribute
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    // Return numbers as JavaScript numbers instead of strings
    wrapNumbers: false,
  },
});

// Table names
export const TABLES = {
  USERS: "future_self_users",
  FUTURE_PROFILES: "future_self_profiles",
  GOALS: "future_self_goals",
  HABITS: "future_self_habits",
  JOURNALS: "future_self_journals",
  CONVERSATIONS: "future_self_conversations",
};