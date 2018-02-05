import { UPDATE_TODO } from '../actions';

export default (state = [], { type, payload }) =>
  type === UPDATE_TODO
    ? state.map(
        todo =>
          todo.id === payload.todo.id ? { ...todo, ...payload.todo } : todo
      )
    : state;
