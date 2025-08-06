import { WriteTokenParams } from "api/features/token/tokenTypes";
import { collection, doc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "index";

import { decryptData, encryptData } from "../../utils/cryptoJS";

export async function fetchReadTokenAPI(userId: string): Promise<string | null> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userid", "==", userId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`Пользователь с ID "${userId}" не найден`);
      return null;
    }

    const docData = snapshot.docs[0].data();

    if (!docData.token) {
      console.warn("У пользователя отсутствует поле token");
      return null;
    }

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    if (!secretKey) {
      console.error("Не задан SECRET_KEY в .env");
      return null;
    }

    const decrypted = decryptData(docData.token, secretKey);
    return decrypted || '';
  } catch (error) {
    console.error("Ошибка получения токена из Firestore:", error);
    throw error;
  }
}


export async function fetchWriteTokenAPI({ token, userId }: WriteTokenParams): Promise<string | null> {
  try {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Не задан SECRET_KEY в .env");
    }

    const encryptedToken = encryptData(token, secretKey);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userid", "==", userId), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 🔁 Если пользователь уже есть — обновим его
      const existingDoc = snapshot.docs[0];
      const docRef = doc(db, "users", existingDoc.id);

      await setDoc(docRef, {
        userid: userId,
        token: encryptedToken,
      }, { merge: true });

      console.log("Токен обновлён для пользователя:", userId);

    } else {
      // 🆕 Новый пользователь — создадим документ
      await setDoc(doc(collection(db, "users")), {
        userid: userId,
        token: encryptedToken,
      });

      console.log("Создан новый документ для пользователя:", userId);
    }

    return token;
  } catch (error) {
    console.error("Ошибка при записи токена в Firestore:", error);
    return null;
  }
}

/**
 * Удаляет токен пользователя из базы данных по userId
 *
 * @param userId - Идентификатор пользователя
 * @returns true, если токен удалён, иначе false
 */
export async function fetchDeleteTokenAPI(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.warn("fetchDeleteTokenAPI: userId не задан");
      return false;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userid", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`Пользователь с ID "${userId}" не найден`);
      return false;
    }

    const userDoc = snapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);

    await updateDoc(userDocRef, {
      token: null,
    });

    console.log(`Токен пользователя "${userId}" успешно удалён`);
    return true;
  } catch (error) {
    console.error("Ошибка при удалении токена из Firestore:", error);
    return false;
  }
}