import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import accountsReducer from '../features/accounts/accountsSlice';
import bondsReducer from '../features/bonds/bondsSlice';
import calendarReducer from '../features/calendar/calendarSlice';
import currencyReducer from '../features/currency/currencySlice';
import favoritesBondsReducer from '../features/favoritesBonds/favoritesBondsSlice';
import infoReducer from '../features/info/infoSlice';
import tokenReducer from '../features/token/tokenSlice';
import userReducer, { logout } from '../features/user/userSlice';

// persist config только для accounts
const accountsPersistConfig = {
  key: "accounts",
  storage,
};

// persist-нутый accountsReducer
const persistedAccountsReducer = persistReducer(accountsPersistConfig, accountsReducer);

const appReducer = combineReducers({
  user: userReducer,
  token: tokenReducer,
  currency: currencyReducer,
  accounts: persistedAccountsReducer, // persist только здесь
  calendar: calendarReducer,
  info: infoReducer,
  bonds: bondsReducer, // ❌ не persistим
  favoritesBonds: favoritesBondsReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === logout.type) {
    storage.removeItem("persist:root");
    Object.keys(localStorage)
      .filter((key) => key.startsWith("persist:"))
      .forEach((key) => localStorage.removeItem(key));
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
