import { onAuthStateChanged } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from 'index';

import { store } from '../../store';

import { authStateCheckFailure, authStateCheckRequest, authStateCheckSuccess } from './userSlice';
import { User } from './userTypes';

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    id: user.uid ?? '',
    email: user.email ?? '',
  };
}

export const setupAuthListener = () => {
  store.dispatch(authStateCheckRequest());

  onAuthStateChanged(
    auth,
    async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const mappedUser: User = mapFirebaseUser(firebaseUser);
          store.dispatch(authStateCheckSuccess(mappedUser));
        } else {
          store.dispatch(authStateCheckSuccess(null));
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Неизвестная ошибка при проверке авторизации';
        store.dispatch(authStateCheckFailure(errorMessage));
      }
    },
    (error) => {
      // Обработка ошибок подписки на Firebase Auth
      store.dispatch(authStateCheckFailure(error.message || 'Ошибка подписки на AuthState'));
    }
  );
};