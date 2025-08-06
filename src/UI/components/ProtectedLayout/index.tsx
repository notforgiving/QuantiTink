import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchTokenRequest } from "api/features/token/tokenSlice";
import { useToken } from "api/features/token/useToken";
import { useUser } from "api/features/user/useUser";
import { AppDispatch } from "api/store";

import BottomMenu from "../BottomMenu";
import Container from "../Container";

const ProtectedLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useUser();
  const { token } = useToken();

  useEffect(() => {
    const userId = currentUser?.id;

    if (!token && userId) {
      dispatch(fetchTokenRequest(userId));
    }
  }, [token, currentUser?.id, dispatch]);
  
  return (
    <Container>
      <Outlet />
      <BottomMenu />
    </Container>
  );
};

export default ProtectedLayout;
