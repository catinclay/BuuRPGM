import PropTypes from 'prop-types';

export const todo = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  completed: PropTypes.bool,
});

export const location = PropTypes.shape({
  pathname: PropTypes.string.isRequired,
});
