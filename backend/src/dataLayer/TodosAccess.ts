import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'


import {TodoItem} from '../models/TodoItem'

const logger = createLogger('getTodos')

export class TodosAccess {

constructor (
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE){

    }

async getAllTodos(): Promise<TodoItem[]> {
    logger.info('Getting all Todos')

    const result = await 
}

}