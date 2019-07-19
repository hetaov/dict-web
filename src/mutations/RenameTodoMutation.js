import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation RenameTodoMutation($input: RenameTodoInput!) {
    renameTodo(input: $input) {
      todo {
        id
        name
      }
    }
  }
`;

function commit(environment, todo, name) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { id: todo.id, name },
    },

    optimisticResponse: {
      renameTodo: {
        todo: {
          id: todo.id,
          name,
        },
      },
    },
  });
}

export default { commit };
