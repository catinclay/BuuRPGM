import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { key } from '../constants';
import * as SharedPropTypes from './sharedPropTypes';

export default class TodoItem extends Component {
  static propTypes = {
    todo: SharedPropTypes.todo.isRequired,
    editing: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onDestroy: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      const node = this.inputNode;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  handleSubmit = () => {
    const val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy();
    }
  };

  handleEdit = () => {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  };

  handleKeyDown = event => {
    if (event.which === key.ESCAPE) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.which === key.ENTER) {
      this.handleSubmit(event);
    }
  };

  handleChange = event => {
    if (this.props.editing) {
      this.setState({ editText: event.target.value });
    }
  };

  handleToggle = event => {
    const { onToggle, todo } = this.props;
    onToggle(todo, event.target.checked);
  };

  render() {
    const { todo, editing, onDestroy } = this.props;
    return (
      <li
        className={classNames({
          completed: todo.completed,
          editing,
        })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggle}
          />
          <label // eslint-disable-line jsx-a11y/label-has-for
            onDoubleClick={this.handleEdit}
          >
            {todo.title}
          </label>
          <button className="destroy" onClick={onDestroy} />
        </div>
        <input
          ref={node => {
            this.inputNode = node;
          }}
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}
