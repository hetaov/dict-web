import Word from './model/Word';

export class Todo extends Object {}
export class User extends Object {}

// Mock authenticated ID.
const VIEWER_ID = 'me';

// Mock user data.
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

const todosById = {};
const todoIdsByUser = {
  [VIEWER_ID]: [],
};
// let nextTodoId = 0;

export async function addTodo(name, complete) {
  // const todo = new Todo();
  // Object.assign(todo, {
  //   id: `${nextTodoId++}`,
  //   complete: Boolean(complete),
  //   name,
  // });

  // todosById[todo.id] = todo;
  // todoIdsByUser[VIEWER_ID].push(todo.id);
  const word = new Word({
    name,
    complete: Boolean(complete),
    created_at: new Date(),
    updated_at: new Date(),
  });
  await word.save();
  return word.id;
}

// Mock todo data.
// addTodo('Taste JavaScript', true);
// addTodo('Buy a unicorn', false);

export async function getTodo(id) {
  const word = await Word.findById(id);
  return word;
}

export async function changeTodoStatus(id, complete) {
  await Word.updateOne({_id: id}, {complete});
}

export async function getTodos(status = 'any') {
  if (status === 'any') {
    const tds = await Word.find({});
    return tds;
  }
  const completed = status === 'completed';
  const tds = await Word.find({complete: completed});
  return tds;
}

export function getUser() {
  return usersById[VIEWER_ID];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}

export async function markAllTodos(complete) {
  // const changedTodos = [];
  // getTodos().forEach(todo => {
  //   if (todo.complete !== complete) {
  //     /* eslint-disable no-param-reassign */
  //     todo.complete = complete;
  //     /* eslint-enable no-param-reassign */
  //     changedTodos.push(todo);
  //   }
  // });
  await Word.updateMany({}, {complete});
  const todos = await getTodos();
  return todos.map(todo => todo.id);
}

export async function getTodoBy(ids) {
  return await Word.find({_id: {$in: ids}});
}

export async function removeTodo(id) {
  // const todoIndex = todoIdsByUser[VIEWER_ID].indexOf(id);
  // if (todoIndex !== -1) {
  //   todoIdsByUser[VIEWER_ID].splice(todoIndex, 1);
  // }
  // delete todosById[id];
  await Word.deleteOne({_id: id})
}

export async function removeCompletedTodos() {
  // const todosToRemove = getTodos().filter(todo => todo.complete);
  // todosToRemove.forEach(todo => removeTodo(todo.id));
  // return todosToRemove.map(todo => todo.id);
  const todos = await Word.find({complete: true});
  await Word.deleteMany({complete: true});
  return todos;
}

export async function renameTodo(id, name) {
  // const todo = getTodo(id);
  // todo.name = name;
  await Word.updateMany({_id: id}, {name})
}
