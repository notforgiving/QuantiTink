import { USER_LOCALSTORAGE_NAME } from "store/slices/user.slice";
import { ACCOUNTS_LOCALSTORAGE_NAME } from "types/accounts.type";
import { BONDS_LOCALSTORAGE_NAME } from "types/bonds.type";
import { ETFS_LOCALSTORAGE_NAME } from "types/etfs.type";
import { EVENTS_LOCALSTORAGE_NAME } from "types/event.type";
import { OPERATIONS_LOCALSTORAGE_NAME } from "types/operations.types";
import { PORTFOLIOS_LOCALSTORAGE_NAME } from "types/portfolio.type";
import { SHARE_LOCALSTORAGE_NAME } from "types/share.type";
import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";

export const clearImportantLocalData = () => {
    localStorage.removeItem(USER_LOCALSTORAGE_NAME);
    localStorage.removeItem(BONDS_LOCALSTORAGE_NAME);
    localStorage.removeItem(ETFS_LOCALSTORAGE_NAME);
    localStorage.removeItem(EVENTS_LOCALSTORAGE_NAME);
    localStorage.removeItem(TOKEN_LOCALSTORAGE_NAME);
    localStorage.removeItem(SHARE_LOCALSTORAGE_NAME);
    localStorage.removeItem(ACCOUNTS_LOCALSTORAGE_NAME);
    localStorage.removeItem(OPERATIONS_LOCALSTORAGE_NAME);
    localStorage.removeItem(PORTFOLIOS_LOCALSTORAGE_NAME);
    localStorage.removeItem('T-balance-update');
}