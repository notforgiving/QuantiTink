import { TTheme, User } from 'api/features/user/userTypes';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { collection, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from 'index';

// Имя коллекции (если у тебя не константа)
const USERS_COLLECTION = "users";

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

// 🔍 Найти документ пользователя по userid (uid из Firebase Auth)
const findUserDocByUserId = async (userId: string) => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where("userid", "==", userId), limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      data: docSnap.data() as Partial<User>,
    };
  }

  return null;
};

// 📥 Получить данные пользователя
export const getUserData = async (userId: string): Promise<Partial<User>> => {
  const found = await findUserDocByUserId(userId);
  return found?.data || {};
};

// 💾 Сохранить/обновить данные пользователя (использовать при регистрации)
export const saveUserData = async (userId: string, data: Partial<User>): Promise<void> => {
  const found = await findUserDocByUserId(userId);
  const userData = { ...data, userid: userId };

  if (found) {
    const docRef = doc(db, USERS_COLLECTION, found.id);
    await setDoc(docRef, userData, { merge: true });
  } else {
    const newDocRef = doc(collection(db, USERS_COLLECTION)); // auto-id
    await setDoc(newDocRef, userData);
  }
};

// 🎨 Обновить тему пользователя (используется при смене темы)
export const updateUserTheme = async (userId: string, theme: TTheme): Promise<void> => {
  const found = await findUserDocByUserId(userId);

  if (!found) throw new Error("Пользователь не найден в Firestore");

  const docRef = doc(db, USERS_COLLECTION, found.id);
  await setDoc(docRef, { theme }, { merge: true });
};