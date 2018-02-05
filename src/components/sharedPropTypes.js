/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const todo = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  completed: PropTypes.bool,
});
