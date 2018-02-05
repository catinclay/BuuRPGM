import { TOGGLE_ALL } from '../actions';

export default (state = [], { type, payload }) =>
  type === TOGGLE_ALL
    ? state.map(todo => ({ ...todo, completed: payload.completed }))
    : state;
