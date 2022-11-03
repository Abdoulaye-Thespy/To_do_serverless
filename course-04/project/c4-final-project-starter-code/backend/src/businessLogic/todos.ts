import { ScanCommand } from "@aws-sdk/client-dynamodb";
import * as AWS from 'aws-sdk';

 
import { unmarshall } from "@aws-sdk/util-dynamodb";

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function getTodosForUser(userId: string) {
 const result = await docClient.query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false
    }).promise()
    return result.Items
} 