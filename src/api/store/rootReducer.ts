import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // <--- ВАЖНО

import accountsReducer from '../features/accounts/accountsSlice';
import currencyReducer from '../features/currency/currencySlice';
import infoReducer from '../features/info/infoSlice';
import tokenReducer from '../features/token/tokenSlice';
import userReducer, { logout } from '../features/user/userSlice';

const appReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  currency: currencyReducer,
  accounts: accountsReducer,
  info: infoReducer,
  // Добавь остальные редьюсеры
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === logout.type) {
    storage.removeItem('persist:root'); // <-- Очищает localStorage
    // Очищаем ВСЕ persist:* ключи из localStorage
    // Object.keys(localStorage)
    //   .filter((key) => key.startsWith('persist:'))
    //   .forEach((key) => localStorage.removeItem(key));
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
