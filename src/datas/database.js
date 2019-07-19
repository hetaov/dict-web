// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// import getRepository from './orm/conn';
import {Word} from './entity/Word';
// import {Connection} from 'typeorm';
import wordRepo from './repository/word';

export class Todo {
  +id: string;
  +text: string;
  +complete: boolean;

  constructor(id: string, text: string, complete: boolean) {
    this.id = id;
    this.text = text;
    this.complete = complete;
  }
}

export class User {
  +id: string;

  constructor(id: string) {
    this.id = id;
  }
}

// Mock authenticated ID
export const USER_ID = 'me';

// Mock user database table
const usersById: Map<string, User> = new Map([[USER_ID, new User(USER_ID)]]);

// Mock todo database table
// const todosById: Map<string, Todo> = new Map();
const todoIdsByUser: Map<string, $ReadOnlyArray<string>> = new Map([
  [USER_ID, []],
]);

// Seed initial data
// let nextTodoId: number = 0;
// addTodo('昱', true);
// addTodo('湇', false);

function getTodoIdsForUser(id: string): $ReadOnlyArray<string> {
  return todoIdsByUser.get(id) || [];
}

export async function addTodo(
  text: string,
  complete: boolean,
): Promise<string> {
  const word = new Word();
  word.name = text;
  word.complete = complete;
  const respository = await wordRepo();
  const wordS = await respository.save(word);
  return wordS.id;
}

export async function changeTodoStatus(id: string, complete: boolean) {
  const todo = await getTodoOrThrow(id);
  // const wRepo = await wordRepo.then();
  todo.complete = complete;
  const respository = await wordRepo();
  const result = await respository.save(todo);
  console.log(' changed result ', result);
  // Replace with the modified complete value
  // todosById.set(id, new Todo(id, todo.text, complete));
}

// Private, for strongest typing, only export `getTodoOrThrow`
async function getTodo(id: string): Promise<?Todo> {
  const respository = await wordRepo();
  const todo: Word = await respository.findOne(id);
  return {...todo, text: todo.name};
}

export async function getTodoOrThrow(id: string): Promise<Todo> {
  const todo = await getTodo(id);
  console.log(id, ' todo id aooll ', todo);
  if (!todo) {
    throw new Error(`Invariant exception, Todo ${id} not found`);
  }

  return todo;
}

export async function getTodos(status: string = 'any'): $ReadOnlyArray<Word> {
  let words;
  const respository = await wordRepo();

  if (status !== 'completed') {
    words = await respository.find();
  } else {
    words = await respository.find({complete: true});
  }
  return words.map((obj: Word) => ({...obj, text: obj.name}));
}

// Private, for strongest typing, only export `getUserOrThrow`
function getUser(id: string): ?User {
  return usersById.get(id);
}

export function getUserOrThrow(id: string): User {
  const user = getUser(id);

  if (!user) {
    throw new Error(`Invariant exception, User ${id} not found`);
  }

  return user;
}

export async function markAllTodos(
  complete: boolean,
): Promise<$ReadOnlyArray<string>> {
  const all = await getTodos();

  const todosToChange = all.filter(
    (todo: Todo): boolean => todo.complete !== complete,
  );

  await Promise.all(
    todosToChange.map((todo: Todo) => changeTodoStatus(todo.id, complete)),
  );

  return todosToChange.map((todo: Todo): string => todo.id);
}

export async function removeTodo(id: string) {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);
  todoIdsByUser.set(
    USER_ID,
    todoIdsForUser.filter((todoId: string): boolean => todoId !== id),
  );
  const respository = await wordRepo();
  await respository.delete(id);
}

export async function removeCompletedTodos(): Promise<$ReadOnlyArray<string>> {
  const completed = await wordRepo().find({complete: true});
  const todoIdsToRemove = completed.map((todo: Todo): string => todo.id);
  const respository = await wordRepo();
  await respository.delete(todoIdsToRemove);

  return todoIdsToRemove;
}

export async function renameTodo(id: string, text: string) {
  const respository = await wordRepo();
  await respository.update(id, {name: text});
}
