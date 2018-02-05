import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { route } from '../constants';

import TodoItem from './TodoItem';
import * as SharedPropTypes from './sharedPropTypes';

export default class TodoList extends Component {
  static propTypes = {
    todos: PropTypes.arrayOf(SharedPropTypes.todo).isRequired,
    location: SharedPropTypes.location.isRequired,
    toggle: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
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
    const { todos, location: { pathname }, toggle, destroy } = this.props;

    const shownTodos =
      pathname === route.ROOT
        ? todos
        : todos.filter(todo => {
            switch (pathname) {
              case route.ACTIVE:
                return todo.completed === false;
              case route.COMPLETED:
                return todo.completed === true;
              default:
                return false;
            }
          });

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
