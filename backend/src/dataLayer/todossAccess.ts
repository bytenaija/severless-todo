import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for user:', userId)

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    console.log('getAllTodos result:', items)
    return items as TodoItem[]
  }

  async CreateTodo(todo): Promise<TodoItem> {
    console.log('creating todo:', todo)

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    console.log('Deleting todo:', todoId)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    console.log('Todo deleted. todoId:', todoId)
    return ''
  }

  async updateTodo(
    userId: string,
    todoId: string,
    updatedTodo
  ): Promise<string> {
    console.log('updating todo:', todoId, updatedTodo)

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :duedate, done = :done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':duedate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        }
      })
      .promise()

    console.log('Todo updated:', updatedTodo)

    return updatedTodo
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    console.log('generating todo', todoId)

    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })

    console.log('generated upload url:', url)
    return url
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
