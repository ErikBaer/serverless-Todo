import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/TodosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../auth/utils'

const TodosAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return TodosAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await TodosAccess.createTodo({
    id: itemId,
    userId: userId,
    name: createTodoRequest.name,
    description: createTodoRequest.dueDate,
    timestamp: new Date().toISOString()
  })
}
