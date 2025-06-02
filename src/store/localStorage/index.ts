import { USER_LOCALSTORAGE_NAME } from "store/slices/user.slice";
import { BONDS_LOCALSTORAGE_NAME } from "types/bonds.type";
import { ETFS_LOCALSTORAGE_NAME } from "types/etfs.type";
import { EVENTS_LOCALSTORAGE_NAME } from "types/event.type";
import { SHARE_LOCALSTORAGE_NAME } from "types/share.type";
import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";

export const clearImportantLocalData = () => {
    localStorage.removeItem(USER_LOCALSTORAGE_NAME);
    localStorage.removeItem(BONDS_LOCALSTORAGE_NAME);
    localStorage.removeItem(ETFS_LOCALSTORAGE_NAME);
    localStorage.removeItem(EVENTS_LOCALSTORAGE_NAME);
    localStorage.removeItem(TOKEN_LOCALSTORAGE_NAME);
    localStorage.removeItem(SHARE_LOCALSTORAGE_NAME);
}