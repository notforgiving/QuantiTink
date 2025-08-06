import CryptoJS from "crypto-js";

export const decryptData = (
  encryptedText: string,
  secretKey: string
): string | null => {
  try {
    if (!encryptedText || !secretKey) {
      console.warn("Пустой encryptedText или secretKey передан в decryptData");
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.warn("Не удалось расшифровать: строка пуста или ключ неверный");
      return null;
    }

    return decrypted;
  } catch (error) {
    console.error("Ошибка при расшифровке данных:", error);
    return null;
  }
};

/**
 * Шифрует строку с использованием AES и секретного ключа.
 * 
 * @param text - Открытый текст для шифрования
 * @param secretKey - Секретный ключ
 * @returns Зашифрованный текст (Base64), либо null при ошибке
 */
export const encryptData = (text: string, secretKey: string): string | null => {
  if (!text) {
    console.warn("encryptData: пустой текст для шифрования");
    return null;
  }

  if (!secretKey) {
    console.error("encryptData: секретный ключ не задан");
    return null;
  }

  try {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
  } catch (error) {
    console.error("Ошибка при шифровании данных:", error);
    return null;
  }
};
