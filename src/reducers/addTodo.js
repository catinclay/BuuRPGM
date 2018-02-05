import shortId from 'shortid';
import { ADD_TODO } from '../actions';

export default (state = [], { type, payload }) =>
  type === ADD_TODO
    ? [
        ...state,
        {
          id: shortId.generate(),
          completed: false,
          title: payload.title,
        },
      ]
    : state;
