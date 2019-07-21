import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';

const propTypes = {
  viewer: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  relay: PropTypes.object.isRequired,
};

class TodoApp extends React.Component {
  onNewTodoSave = text => {
    const { relay, viewer } = this.props;

    AddTodoMutation.commit(relay.environment, viewer, text);
  };

  render() {
    const { viewer, children } = this.props;

    return (
      <div data-framework="relay">
        <section className="todoapp">
          <header className="header">
            <h1>生词本</h1>
            <TodoTextInput
              className="new-todo"
              placeholder="What needs to be done?"
              autoFocus
              onSave={this.onNewTodoSave}
            />
          </header>

          {children}

          <TodoListFooter viewer={viewer} />
        </section>

        <footer className="info">
          <p>双击编辑</p>
          <p>
            Created by <a href="http://fashionablenonsense.com/">tao</a>{' '}
            from work by the{' '}
            <a href="https://facebook.github.io/relay/">Dict team</a>
          </p>
        </footer>
      </div>
    );
  }
}

TodoApp.propTypes = propTypes;

export default createFragmentContainer(TodoApp, {
  viewer: graphql`
    fragment TodoApp_viewer on User {
      id
      ...TodoListFooter_viewer
    }
  `,
});
