import { CLEAR_COMPLETED } from '../actions';

export default (state = [], { type }) =>
  type === CLEAR_COMPLETED ? state.filter(todo => !todo.completed) : state;
