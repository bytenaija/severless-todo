// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it

const apiId = 'jqkyhinlgb'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'bytenaija.auth0.com', // Auth0 domain
  clientId: 'YGU6wCOp5VfZrRI9ppWBa8XmiqiYgDs7', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
