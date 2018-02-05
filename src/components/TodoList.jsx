import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { filter as filterConstants } from '../constants';
import TodoItem from './TodoItem';
import * as SharedPropTypes from './sharedPropTypes';

const { ACTIVE, COMPLETED } = filterConstants;

export default class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.arrayOf(SharedPropTypes.todo).isRequired,
    toggle: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    filter: PropTypes.string, // eslint-disable-line react/require-default-props
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: null,
    };
  }

  edit = todo => {
    this.setState({ editing: todo.id });
  };

  save = (todoToSave, text) => {
    this.props.save(todoToSave, text);
    this.setState({ editing: null });
  };

  cancel() {
    this.setState({ editing: null });
  }

  handleToggleAll = event => {
    const completed = event.target.checked;
    this.props.toggleAll(completed);
  };

  render() {
    const { todos, filter, toggle, destroy } = this.props;

    const shownTodos = filter
      ? todos.filter(todo => {
          switch (filter) {
            case ACTIVE:
              return todo.completed === false;
            case COMPLETED:
              return todo.completed === true;
            default:
              return false;
          }
        })
      : todos;

    const todoItems = shownTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={toggle}
        onDestroy={destroy}
        onEdit={this.edit}
        editing={this.state.editing === todo.id}
        onSave={this.save}
        onCancel={this.cancel}
      />
    ));

    const isAllCompleted = todos.findIndex(todo => !todo.completed) === -1;

    return todos.length ? (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={this.handleToggleAll}
          checked={isAllCompleted}
        />
        <ul className="todo-list">{todoItems}</ul>
      </section>
    ) : null;
  }
}
