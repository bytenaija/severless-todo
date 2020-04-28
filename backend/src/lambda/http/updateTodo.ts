import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { parseUserId } from '../../auth/utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log('[update todo]: Processing event: ', event)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(' ')[1]
  const userId = parseUserId(jwtToken)
  const item = await updateTodo(userId, todoId, updatedTodo)
  console.log('updatedResult', item)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(item)
  }
}
