import { firebaseAuthErrorMap } from 'api/features/user/firebaseErrorMap';
import { FirebaseError } from 'firebase/app';

export function parseFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    const friendly = firebaseAuthErrorMap[error.code];
    return friendly || 'Произошла неизвестная ошибка.';
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as any).code;
    return firebaseAuthErrorMap[code] || 'Произошла ошибка.';
  }

  return 'Что-то пошло не так. Попробуйте позже.';
}
