import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-e4vpei6e.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const secret = `-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIJamjFjt77BFxzMA0GCSqGSIb3DQEBCwUAMB4xHDAaBgNV
BAMTE2J5dGVuYWlqYS5hdXRoMC5jb20wHhcNMjAwNDI3MjM0NDE2WhcNMzQwMTA0
MjM0NDE2WjAeMRwwGgYDVQQDExNieXRlbmFpamEuYXV0aDAuY29tMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsn6KI4h5XZ2pbFVnNZX7jnc3xo0CiugP
1vXKsiRNfYBDmVx6r6GdlivZWv8rpQtASN36dSqsg3ysWqqdEO9/YUWue+E5C33Z
I9MpoacnpzwbVJIL9ZCPeJbtBH2tkzP3jU7+ViKKp10D7/NjuexoCjG98krUnQHS
sL13WVa5m1ZZSskl5fHEY8srO+osFQNYmwfP/dMurvZ1WuukpBT8sauS665rUkyT
x3mdVMLh3ZMte9sByfxO7SiSIxSFfzvf+5eFkmrQTqyIobaAIosvLkAIniacvjwY
a4pfQYVCkpOGNFS/Ky0InTm3w+88+eiFZaqH7gU49s5q3+xvl2QFmQIDAQABo0Iw
QDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRKkG9tqeaNf3uXa2VHvwdXjiRp
lTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAFc/9Wx3tD+/0Yh2
lrCxNJJL2i9bzpXPJLXg3Z1usifZ7awlh11VLkakyhTKypvFZJIvzE4UBjGSDNKv
PH9RKut/OUKPo6IwlBPsxFCL3lzYEU5/HU0psCd61WaV+FSgAjNzzde0HhvPkCzI
RSliH+t9zjjIFCO913n3EPedapjw8qnxbejU4bvpcdpXug2iCtaTCFBp7udK/rKM
3gI3jii2WcPavP9YUF0OSIJ+CFDeDU0tjtaNah6aKiiV2oJx+k0Dk5FBfrrom8fE
JOrLd83YAFfEErPBTSCbcdAuWQhTu2wRTxwN4jiiIkNUjczZPwf+aIeHco51CC8x
lJ20ZFI=
-----END CERTIFICATE-----
`

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, secret, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
