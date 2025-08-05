import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { auth } from 'index';

export const firebaseRegister = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const firebaseLogin = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const firebaseLogout = async (): Promise<void> => {
  return await signOut(auth);
};