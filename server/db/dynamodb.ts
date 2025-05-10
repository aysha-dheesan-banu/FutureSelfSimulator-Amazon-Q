import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

// Warn if AWS credentials are missing
if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.region) {
  console.error("AWS credentials missing. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env file.");
}

// Create DynamoDB client
const client = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId || "",
    secretAccessKey: config.aws.secretAccessKey || "",
  },
  endpoint: config.aws.dynamodbEndpoint, // Use local DynamoDB endpoint if specified
  // For local DynamoDB, we need to disable signature verification
  ...(config.aws.dynamodbEndpoint ? {
    tls: false
  } : {})
});

// Create a DocumentClient wrapper for easier data interaction
export const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Table names with prefix (configured in ../config)
export const TABLES = {
  USERS: "future_self_users",
  FUTURE_PROFILES: "future_self_profiles",
  GOALS: "future_self_goals",
  HABITS: "future_self_habits",
  JOURNALS: "future_self_journals",
  CONVERSATIONS: "future_self_conversations",
};
