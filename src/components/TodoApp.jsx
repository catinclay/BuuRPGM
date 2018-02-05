import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'todomvc-app-css/index.css';

import { key } from '../constants';

import TodoFooter from './TodoFooter';
import TodoList from './TodoList';
import * as SharedPropTypes from './sharedPropTypes';

export default class TodoApp extends Component {
  static propTypes = {
    todos: PropTypes.arrayOf(SharedPropTypes.todo).isRequired,
    toggleTodo: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    addTodo: PropTypes.func.isRequired,
    clearCompleted: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        filter: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      newTodo: '',
    };
  }

  handleChange = event => {
    this.setState({ newTodo: event.target.value });
  };

  handleNewTodoKeyDown = event => {
    if (event.keyCode !== key.ENTER) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.props.addTodo(val);
      this.setState({ newTodo: '' });
    }
  };

  render() {
    const {
      todos,
      toggleTodo,
      updateTodo,
      deleteTodo,
      clearCompleted,
      toggleAll,
      match: { params: { filter } },
    } = this.props;

    const activeTodoCount = todos.reduce(
      (accum, todo) => (todo.completed ? accum : accum + 1),
      0
    );
    const completedCount = todos.length - activeTodoCount;

    return (
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </header>
        <TodoList
          todos={todos}
          toggle={toggleTodo}
          destroy={deleteTodo}
          save={updateTodo}
          toggleAll={toggleAll}
          filter={filter}
        />
        {activeTodoCount || completedCount ? (
          <TodoFooter
            count={activeTodoCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
            filter={filter}
          />
        ) : null}
      </div>
    );
  }
}
