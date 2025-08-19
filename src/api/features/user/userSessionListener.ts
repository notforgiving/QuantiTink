import { getUserData } from 'api/requests/userApi';
import { onAuthStateChanged } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from 'index';

import { store } from '../../store';

import { authStateCheckFailure, authStateCheckRequest, authStateCheckSuccess } from './userSlice';
import { TTheme, User } from './userTypes';

function mapFirebaseUser(user: FirebaseUser, theme: TTheme = 'light'): User {
  return {
    id: user.uid ?? '',
    email: user.email ?? '',
    theme,
  };
}

export const setupAuthListener = () => {
  store.dispatch(authStateCheckRequest());

  onAuthStateChanged(
    auth,
    async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // читаем данные из своей коллекции
          const userData: Partial<User> = await getUserData(firebaseUser.uid);
          const mappedUser: User = mapFirebaseUser(
            firebaseUser,
            userData.theme ?? 'light' // подставляем тему из БД
          );

          store.dispatch(authStateCheckSuccess(mappedUser));
        } else {
          store.dispatch(authStateCheckSuccess(null));
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Неизвестная ошибка при проверке авторизации';
        store.dispatch(authStateCheckFailure(errorMessage));
      }
    },
    (error) => {
      store.dispatch(authStateCheckFailure(error.message || 'Ошибка подписки на AuthState'));
    }
  );
};