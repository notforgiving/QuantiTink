import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAccountsRequest } from "api/features/accounts/accountsSlice";
import { fetchInfoRequest } from "api/features/info/infoSlice";
import { fetchTokenRequest } from "api/features/token/tokenSlice";
import { useToken } from "api/features/token/useToken";
import { useUser } from "api/features/user/useUser";

export const useLoadDataWithToken = () => {
  const dispatch = useDispatch();
  const { currentUser } = useUser();
  const { data: tokenData } = useToken();

  // Запрашиваем токен, если он отсутствует
  useEffect(() => {
    const userId = currentUser?.id;
    if (!tokenData && userId) {
      dispatch(fetchTokenRequest(userId));
    }
  }, [currentUser?.id, dispatch, tokenData]);

  // Загружаем аккаунты, когда токен уже есть
  useEffect(() => {
    if (tokenData) {
      dispatch(fetchAccountsRequest());
      dispatch(fetchInfoRequest());
    }
  }, [dispatch, tokenData]);
};
