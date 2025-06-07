import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";
import { TInstrument } from "../../types/bonds.type";
import { TFPosition } from "../../types/portfolio.type";
import { BondByAPI, GetBondCouponsAPI } from "./common";
import { Moment } from "moment";
import { collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { IBondsTable } from "pages/CalcBonds/hook/useCalcBonds";
import { db } from "index";
import moment from "moment";

export async function fetchAllGetBondsAPI(bondsPositions: TFPosition[]) {
    let results: TInstrument[] = [];
    try {
        return Promise.all(bondsPositions.map(async pos => {
            const res = await fetchGetBondByAPI(pos.figi);
            results.push(res);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetBondsAPI went wrong`);
    };
};


export async function fetchGetBondByAPI(figi: string) {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(BondByAPI, {
        method: "POST",
        body: JSON.stringify({
            idType: 'INSTRUMENT_ID_TYPE_FIGI',
            id: figi,
        }),
        headers: {
            Authorization: `Bearer ${tokenForApi}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if (data.status === 500) {
        throw data.error;
    }
    return data.instrument;
}

export async function fetchGetBondCouponsAPI(figi: string, from: Moment, to: Moment) {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(GetBondCouponsAPI, {
        method: "POST",
        body: JSON.stringify({
            from,
            to,
            instrumentId: figi,
        }),
        headers: {
            Authorization: `Bearer ${tokenForApi}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if (data.hasOwnProperty("status") && data.status === 500) {
        throw data.error;
    }
    return data.events;
}

export async function fetchReadBondsDataAPI(userId: string) {
    let collectionData: any = {
        date: '',
        userid: '',
        values: [],
    };
    const q = query(collection(db, "bonds"), where("userid", "==", userId), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        collectionData = docData;
        
    });

    return collectionData;
}

export async function fetchWriteBondsDataAPI({ data, userId }: { data: IBondsTable[], userId: string }) {
    await setDoc(doc(db, "bonds", userId), {
        userid: userId,
        date: moment().utc().toString(),
        values: JSON.stringify(data),
    });
}
