import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWSXRay from 'aws-xray-sdk'
import {getUploadUrl} from '../../businessLogic/todos'


const XAWS = AWSXRay.captureAWS(AWS)




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
const Url = getUploadUrl(event.pathParameters.todoId)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: Url
      })
    }
  }


