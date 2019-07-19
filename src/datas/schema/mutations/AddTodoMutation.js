// @flow
/* graphql-relay doesn't export types, and isn't in flow-typed.  This gets too messy */
/* eslint flowtype/require-return-type: 'off' */
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

import {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
  offsetToCursor
} from 'graphql-relay';

import {GraphQLID, GraphQLNonNull, GraphQLString} from 'graphql';
import {GraphQLTodoEdge, GraphQLUser} from '../nodes';

import {
  addTodo,
  getTodoOrThrow,
  getTodos,
  getUserOrThrow,
  User,
  Todo
} from '../../database';

type Input = {|
  +text: string,
  +userId: string,
|};

type Payload = {|
  +todoId: string,
  +userId: string,
|};

const AddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    text: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLID)},
  },
  outputFields: {
    todoEdge: {
      type: new GraphQLNonNull(GraphQLTodoEdge),
      resolve: async ({todoId}: Payload) => {
        const todo = await getTodoOrThrow(todoId);
        const todos = await getTodos();
        const index = todos.findIndex((ele: Todo) => ele.id === todoId);
        return {
          // cursor: cursorForObjectInConnection([...todos], todo),
          cursor: offsetToCursor(index),
          node: todo,
        };
      },
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({userId}: Payload): User => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: async ({text, userId}: Input): Promise<Payload> => {
    const todoId = await addTodo(text, false);
    console.log(todoId, ' add todo id');
    return {todoId, userId};
  },
});

export {AddTodoMutation};
