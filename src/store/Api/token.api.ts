import { db } from "index";
import { addDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
import * as CryptoJS from 'crypto-js'

const encryptData = (text: string, secretKey: string) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
};

const decryptData = (encryptedText: string, secretKey: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) {
            return null;
        }
        return originalText;
    } catch (error) {
        return null
    }
};

export async function fetchReadTokenAPI(userId: string) {
    let token = '';
    const q = query(collection(db, "users"), where("userid", "==", userId), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        token = decryptData(docData.token, String(process.env.REACT_APP_SECRET_KEY)) || '';
    });

    return token;
}

export async function fetchWriteTokenAPI({ token, userId }: { token: string, userId: string }) {
    const encryptToken = encryptData(token, String(process.env.REACT_APP_SECRET_KEY));
    const docRef = await addDoc(collection(db, "users"), {
        userid: userId,
        token: encryptToken,
    });
    if (docRef.id) {
        console.log("Document written with ID: ", docRef.id);
        return token;
    } else {
        return null;
    }
}

