import {CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
// import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

// const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJN2qNPTtDTok/MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi16NGF0NWV4Mms3YW56NGJhLnVzLmF1dGgwLmNvbTAeFw0yMjEwMjEx
NjI3NTZaFw0zNjA2MjkxNjI3NTZaMCwxKjAoBgNVBAMTIWRldi16NGF0NWV4Mms3
YW56NGJhLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAOlQ4V/5fM44sL2Tkc8UBEWd5vbQYibpCKwaHt/nN28WQYtxVSWbFAb+m7Bx
pVaWKPlQmerZb9F63StAej2o8R6n+nX5QAmA2f+4YUvcA7ui5c/Z5+8J7D0Do7ju
K62dUybD0zgOhuK1pb+ESo4zFo7Iag29yS/kNXw3skwy3rpmGnOvJ2WoSs5a26L/
WyzuEfcNlGepTcjd6Vhaxr37QtiZpK7dmHqwJaz/rvq6g90hgO4vwb9QlJG2RVLt
ar6+jEU4cxduJ38fVFKoiKHRzePUm1cZpcSqjPeD0hlioxXLUwjaudK1Nbr/RqNR
Ot44yV8E8mUwSU2QSaviBNsXdSECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU9aqNZTBEBvqBE3z9z/K7dPsTt5MwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBgr8WRQimTHBVlv5Wm1OshoHPE/hqLzL+vapfnapB9
pyU6SFStm4niCYjAjq3SLe3TiWpB/9OePsXVgifglbH4xP/Zm8iZflx8rJ9IFpjB
MPkQwQmjXMIsoglK0goT79JMhsUubRMNsRD+Vo4LEdNensFzTQfrwesilGQDALzS
B8lSiaBXfZiFvYzgiZzH4UOCKuQ2Zcdf0arvtuJxpWCBdr+htp7x7cJi/5WmYXtG
CZX+42gDvKpGsHZ56tj2F/PGxPEmrSEZiusbmMHLEFnx55xZShBy7HGGgYWsNI7K
D6GihbbYwcG1JmYDK4QRv2a2LKvoV1kD419Y3s8WHbWf
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

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
    console.log('User authorized', e.message)

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

function verifyToken(authHeader: string) {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}