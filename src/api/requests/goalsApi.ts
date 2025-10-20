import {
    collection,
    doc,
    getDocs,
    limit,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "index";

// Имя коллекции
const GOALS_COLLECTION = "goals";

/**
 * 🔍 Найти документ с целями по userId
 */
const findGoalsDocByUserId = async (userId: string) => {
    const goalsRef = collection(db, GOALS_COLLECTION);
    const q = query(goalsRef, where("userid", "==", userId), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return {
            id: docSnap.id,
            data: docSnap.data() as { userid: string; goals: Record<string, number> },
        };
    }

    return null;
};

/**
 * 📥 Получить цели пользователя
 */
export const getUserGoals = async (
    userId: string
): Promise<Record<string, number>> => {
    const found = await findGoalsDocByUserId(userId);
    return found?.data?.goals || {};
};

/**
 * 💾 Сохранить или обновить цели пользователя
 */
export const saveUserGoals = async (
    userId: string,
    goals: Record<string, number>
): Promise<void> => {
    const found = await findGoalsDocByUserId(userId);
    const payload = { userid: userId, goals };

    if (found) {
        const docRef = doc(db, GOALS_COLLECTION, found.id);
        await setDoc(docRef, payload, { merge: true });
    } else {
        const newDocRef = doc(collection(db, GOALS_COLLECTION)); // создаем новый документ
        await setDoc(newDocRef, payload);
    }
};
