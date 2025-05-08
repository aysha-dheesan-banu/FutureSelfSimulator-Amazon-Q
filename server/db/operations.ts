import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./dynamodb";

// Helper function to put an item in a table
export async function putItem(tableName: string, item: Record<string, any>): Promise<Record<string, any>> {
  const params = {
    TableName: tableName,
    Item: item,
  };

  await ddbDocClient.send(new PutCommand(params));
  return item;
}

// Helper function to get an item from a table by id
export async function getItem(tableName: string, id: number): Promise<Record<string, any> | undefined> {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  const response = await ddbDocClient.send(new GetCommand(params));
  return response.Item;
}

// Helper function to query items by a non-key attribute
export async function queryItems(
  tableName: string,
  attributeName: string,
  attributeValue: any
): Promise<Record<string, any>[]> {
  const params = {
    TableName: tableName,
    FilterExpression: `#attr = :value`,
    ExpressionAttributeNames: {
      "#attr": attributeName,
    },
    ExpressionAttributeValues: {
      ":value": attributeValue,
    },
  };

  const response = await ddbDocClient.send(new ScanCommand(params));
  return response.Items || [];
}

// Helper function to get all items in a table
export async function scanItems(tableName: string): Promise<Record<string, any>[]> {
  const params = {
    TableName: tableName,
  };

  const response = await ddbDocClient.send(new ScanCommand(params));
  return response.Items || [];
}

// Helper function to update an item
export async function updateItem(
  tableName: string,
  id: number,
  updates: Record<string, any>
): Promise<Record<string, any> | undefined> {
  // Create expression attribute names, values, and update expression
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};
  
  let updateExpression = "SET ";
  
  Object.entries(updates).forEach(([key, value], index) => {
    const nameKey = `#attr${index}`;
    const valueKey = `:value${index}`;
    
    expressionAttributeNames[nameKey] = key;
    expressionAttributeValues[valueKey] = value;
    
    updateExpression += `${nameKey} = ${valueKey}${index < Object.keys(updates).length - 1 ? ", " : ""}`;
  });

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const response = await ddbDocClient.send(new UpdateCommand(params));
  return response.Attributes;
}

// Helper function to delete an item
export async function deleteItem(tableName: string, id: number): Promise<boolean> {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  await ddbDocClient.send(new DeleteCommand(params));
  return true;
}

// Helper function to generate a unique ID
export function generateId(): number {
  return Date.now();
}