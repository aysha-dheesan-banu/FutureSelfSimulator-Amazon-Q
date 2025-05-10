import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

/**
 * Create a DynamoDB client specifically configured for local development
 */

// Create DynamoDB client for local development
const client = new DynamoDBClient({
  region: "local",
  endpoint: config.aws.dynamodbEndpoint,
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
  tls: false
});

// Create a DocumentClient wrapper for easier data interaction
export const localDdbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Table names with prefix
export const TABLES = {
  USERS: "future_self_users",
  FUTURE_PROFILES: "future_self_profiles",
  GOALS: "future_self_goals",
  HABITS: "future_self_habits",
  JOURNALS: "future_self_journals",
  CONVERSATIONS: "future_self_conversations",
};