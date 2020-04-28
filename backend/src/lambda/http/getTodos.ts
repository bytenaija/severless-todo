import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { parseUserId } from '../../auth/utils'
import { getAllTodos } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('[getTodos.ts] Processing event:', event)

  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(' ')[1]
  const userId = parseUserId(jwtToken)
  const todos = await getAllTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todos
    })
  }
}
