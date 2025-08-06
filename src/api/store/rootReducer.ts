import { combineReducers } from 'redux';

import tokenReducer from '../features/token/tokenSlice';
import userReducer, { logout } from '../features/user/userSlice';

const appReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  // Добавь остальные редьюсеры
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === logout.type) {
    state = undefined; // очищает всё хранилище
  }

  return appReducer(state, action);
};

export default rootReducer;