import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { deleteTodo } from '../../businessLogic/todos'
import { parseUserId } from '../../auth/utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  console.log('[delete todo]: Processing event: ', event)

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  await deleteTodo(todoId, userId);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ deletedTodo: todoId })
  }
}
