import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { pluralize } from '../utils';
import { route } from '../constants';

import * as SharedPropTypes from './sharedPropTypes';

const TodoFooter = ({ completedCount, onClearCompleted, location, count }) => {
  let clearButton = null;

  if (completedCount > 0) {
    clearButton = (
      <button className="clear-completed" onClick={onClearCompleted}>
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
              selected: location.pathname === route.ROOT,
            })}
          >
            All
          </Link>
        </li>{' '}
        <li>
          <Link
            to="/active"
            className={classNames({
              selected: location.pathname === route.ACTIVE,
            })}
          >
            Active
          </Link>
        </li>{' '}
        <li>
          <Link
            to="/completed"
            className={classNames({
              selected: location.pathname === route.COMPLETED,
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
  onClearCompleted: PropTypes.func.isRequired,
  location: SharedPropTypes.location.isRequired, // eslint-disable-line react/no-typos
  count: PropTypes.number.isRequired,
};

export default TodoFooter;
