import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { pluralize } from '../utils';
import { filter as filterConstants } from '../constants';

const { ACTIVE, COMPLETED } = filterConstants;

const TodoFooter = ({ completedCount, clearCompleted, filter, count }) => {
  let clearButton = null;

  if (completedCount > 0) {
    clearButton = (
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    );
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {pluralize(count, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to="/"
            className={classNames({
              selected: !filter,
            })}
          >
            All
          </Link>
        </li>{' '}
        <li>
          <Link
            to={`/${ACTIVE}`}
            className={classNames({
              selected: filter === ACTIVE,
            })}
          >
            Active
          </Link>
        </li>{' '}
        <li>
          <Link
            to={`/${COMPLETED}`}
            className={classNames({
              selected: filter === COMPLETED,
            })}
          >
            Completed
          </Link>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

TodoFooter.propTypes = {
  completedCount: PropTypes.number.isRequired,
  clearCompleted: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  filter: PropTypes.string, // eslint-disable-line react/require-default-props
};

export default TodoFooter;
