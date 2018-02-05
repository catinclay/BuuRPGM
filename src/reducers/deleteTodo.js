import { DELETE_TODO } from '../actions';

export default (state = [], { type, payload }) =>
  type === DELETE_TODO
    ? state.filter(todo => todo.id !== payload.todo.id)
    : state;
