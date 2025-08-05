import { Outlet } from "react-router-dom";
import BottomMenu from "../BottomMenu";
import Container from "../Container";

const ProtectedLayout = () => {
  return (
    <Container>
      <Outlet />
      <BottomMenu />
    </Container>
  );
};

export default ProtectedLayout;