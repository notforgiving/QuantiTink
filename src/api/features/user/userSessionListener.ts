import { onAuthStateChanged } from 'firebase/auth';
import { store } from '../../store';
import { setUser } from './userSlice';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from './userTypes';
import { auth } from 'index';

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    email: user.email ?? '',
    accesstoken: '',
  };
}

export const setupAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.dispatch(setUser(mapFirebaseUser(user)));
    }
  });
};
