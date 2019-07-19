import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      viewer {
        id
        numTodos
      }
      todoEdge {
        cursor
        node {
          id
          complete
          name
        }
      }
    }
  }
`;

function sharedUpdater(store, user, todoEdge) {
  const userProxy = store.get(user.id);

  ['any', 'active'].forEach(status => {
    const connection = ConnectionHandler.getConnection(
      userProxy,
      'TodoList_todos',
      { status },
    );
    if (connection) {
      ConnectionHandler.insertEdgeAfter(connection, todoEdge);
    }
  });
}

let nextClientMutationId = 0;

function commit(environment, user, name) {
  const clientMutationId = (nextClientMutationId++).toString();

  return commitMutation(environment, {
    mutation,
    variables: {
      input: { name, clientMutationId },
    },

    updater(store) {
      const payload = store.getRootField('addTodo');
      sharedUpdater(store, user, payload.getLinkedRecord('todoEdge'));
    },

    optimisticUpdater(store) {
      const id = `client:addTodo:Todo:${clientMutationId}`;
      const todo = store.create(id, 'Todo');
      todo.setValue(name, 'name');
      todo.setValue(id, 'id');

      const todoEdge = store.create(
        `client:addTodo:TodoEdge:${clientMutationId}`,
        'TodoEdge',
      );
      todoEdge.setLinkedRecord(todo, 'node');

      sharedUpdater(store, user, todoEdge);

      const userProxy = store.get(user.id);
      const numTodos = userProxy.getValue('numTodos');
      if (numTodos != null) {
        userProxy.setValue(numTodos + 1, 'numTodos');
      }
    },
  });
}

export default { commit };
