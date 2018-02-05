import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import addTodo from './addTodo';
import updateTodo from './updateTodo';
import deleteTodo from './deleteTodo';
import clearCompleted from './clearCompleted';
import toggleAll from './toggleAll';

export default combineReducers({
  todos: reduceReducers(
    addTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    toggleAll
  ),
});
