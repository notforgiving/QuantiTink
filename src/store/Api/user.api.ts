import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export async function fetchCreateUserAPI(email: string, password: string) {
    const auth = getAuth();
    const response = await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user: any = userCredential.user;
            console.log(user, 'createUserWithEmailAndPassword');
            return {
                email: user.email,
                token: user.stsTokenManager.accessToken,
                id: user.uid,
                error: '',
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            return {
                email: '',
                token: '',
                id: '',
                error: errorMessage,
            }
        });
    return response;
}

export async function fetchLoginUserAPI(email: string, password: string) {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user: any = userCredential.user;
            console.log(user, 'signInWithEmailAndPassword');
            return {
                email: user.email,
                token: user.stsTokenManager.accessToken,
                id: user.uid,
                error: '',
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            return {
                email: '',
                token: '',
                id: '',
                error: errorMessage,
            }
        });
    return response;
}