import * as AWS  from 'aws-sdk'
process.env._X_AMZN_TRACE_ID = '_X_AMZN_TRACE_ID'

import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})


import { TodoItem } from '../models/TodoItem'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.INDEX_NAME) {
  }

  async getAllTodos(userId): Promise<TodoItem[]> {
    console.log('Getting all Todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
      }).promise();

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(update: UpdateTodoRequest, userId: string, todoId: string ): Promise<String> {

    const {name,dueDate,done} = update
    
    const params = {
      TableName: this.todosTable,
      Key:                  
        {todoId,
        userId},
        
      
      UpdateExpression: "set #name=:n, #dueDate=:dD, #done=:d",
      
      ExpressionAttributeValues : {
        ':n': name,
        ':dD': dueDate,
        ':d': done
      }
      
      
      ,
      ExpressionAttributeNames:{
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ReturnValues:"UPDATED_NEW"
  
  };

  console.log("Updating the item...");

  await this.docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
}).promise();

return 
}

  async deleteTodo (todoId: string, userId) {
    
    const params = {
      TableName : this.todosTable,
      Key:                  
      {todoId,
      userId},
    }
    
    
    this.docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
  
  }


  getUploadUrl(todoId: string) {
    const bucketName = process.env.ATTACHMENTS_S3_BUCKET
    const urlExpiration = process.env.urlExpiration
  
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    
    return signedUrl
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

