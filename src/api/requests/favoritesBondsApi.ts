import { IGetBondCouponsEvents } from "api/features/favoritesBonds/favoritesBondsTypes";
import { TTokenState } from "api/features/token/tokenSlice";
import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { db } from "index";
import moment from "moment";

export async function fetchGetLastPriceAPI({
    token,
    instrumentId,
}: {
    token: TTokenState["data"];
    instrumentId: string;
}): Promise<number> {
    const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.MarketDataService/GetLastPrices",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                instrumentId: [instrumentId],
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "Ошибка загрузки последней цены облигации"
        );
    }

    const priceObj = data.lastPrices?.[0];
    if (!priceObj) throw new Error("Нет данных о последней цене");

    const { units, nano } = priceObj.price;
    return Number(units) + nano / 1_000_000_000;
}

export async function fetchGetBondCouponsAPI({
    token,
    figi,
    from,
    to,
}: {
    token: TTokenState["data"];
    figi: string;
    from?: string; // ISO строка, например "2025-01-01T00:00:00Z"
    to?: string;   // ISO строка, например "2030-12-31T00:00:00Z"
}): Promise<{
    events?: IGetBondCouponsEvents[]
}> {
    const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                figi,
                from: from ?? moment().toISOString(),
                to: to ?? moment().add(10, "years").toISOString(), // по умолчанию +10 лет
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "Ошибка загрузки данных по купонам облигации"
        );
    }

    if (!data.events) return {
        events: []
    };

    return data;
}

const FAVORITES_BONDS_COLLECTION = "favoritesBonds";

const findFavoritesDocByUserId = async (userId: string) => {
    const ref = collection(db, FAVORITES_BONDS_COLLECTION);
    const q = query(ref, where("userId", "==", userId), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, data: docSnap.data() as { userId: string; isin: string[] } };
    }
    return null;
};

/**
 * Получить массив ISIN пользователя
 */
export const getUserFavoritesIsin = async (userId: string): Promise<string[]> => {
    const found = await findFavoritesDocByUserId(userId);
    return found?.data?.isin || [];
};

/**
 * Сохранить новый ISIN в Firebase
 */
export const saveFavoriteIsin = async (userId: string, isin: string): Promise<void> => {
    const found = await findFavoritesDocByUserId(userId);

    if (found) {
        const docRef = doc(db, FAVORITES_BONDS_COLLECTION, found.id);
        const updatedIsin = Array.from(new Set([...found.data.isin, isin])); // уникальные
        await setDoc(docRef, { userId, isin: updatedIsin }, { merge: true });
    } else {
        const newDocRef = doc(collection(db, FAVORITES_BONDS_COLLECTION));
        await setDoc(newDocRef, { userId, isin: [isin] });
    }
};
/**
 * Удалить ISIN из favoritesBonds для пользователя
 * @param userId - ID пользователя
 * @param isin - ISIN облигации для удаления
 * @returns boolean - true, если удаление прошло успешно, false иначе
 */
export const removeFavoriteIsin = async (userId: string, isin: string): Promise<boolean> => {
    try {
        const found = await findFavoritesDocByUserId(userId);

        if (!found) return false; // документ не найден, удалять нечего

        const { id, data } = found;
        const updatedIsin = data.isin.filter((i) => i !== isin);

        // Если массив остался пустым, можно оставить пустой массив
        const docRef = doc(db, FAVORITES_BONDS_COLLECTION, id);
        await setDoc(docRef, { userId, isin: updatedIsin }, { merge: true });

        return true; // удаление прошло успешно
    } catch (error) {
        console.error("Ошибка удаления ISIN из Firebase:", error);
        return false; // ошибка при удалении
    }
};