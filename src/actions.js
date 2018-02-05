export const ADD_TODO = 'add_todo';
export const addTodo = title => ({
  type: ADD_TODO,
  payload: { title },
});

export const UPDATE_TODO = 'update_todo';
export const updateTodo = (todo, title) => ({
  type: UPDATE_TODO,
  payload: { todo: { ...todo, title } },
});

export const toggleTodo = (todo, completed) => ({
  type: UPDATE_TODO,
  payload: { todo: { ...todo, completed } },
});

export const DELETE_TODO = 'delete_todo';
export const deleteTodo = todo => ({
  type: DELETE_TODO,
  payload: { todo },
});

export const TOGGLE_ALL = 'toggle_all';
export const toggleAll = completed => ({
  type: TOGGLE_ALL,
  payload: { completed },
});

export const CLEAR_COMPLETED = 'clear_completed';
export const clearCompleted = () => ({
  type: CLEAR_COMPLETED,
});
