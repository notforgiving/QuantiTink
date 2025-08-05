import { logout } from "api/features/user/userSlice";
import { AppDispatch } from "api/store";
import React from "react";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default HomePage;
