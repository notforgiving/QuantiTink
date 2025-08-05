import React, { FC } from "react";
import css from "./styles.module.scss";
import cn from "classnames";
import { ReactComponent as MainImg } from "assets/wallet.svg";
import { ReactComponent as ProfileImg } from "assets/preson.svg";
import { ReactComponent as CalcImg } from "assets/calc.svg";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Главная",
    path: "/",
    icon: <MainImg />,
    match: (pathname: string) =>
      !pathname.includes("/calcBonds") && !pathname.includes("/profile"),
  },
  {
    label: "Доходность облигаций",
    path: "/calcBonds",
    icon: <CalcImg />,
    match: (pathname: string) => pathname.includes("/calcBonds"),
  },
  {
    label: "Профиль",
    path: "/profile",
    icon: <ProfileImg />,
    match: (pathname: string) => pathname.includes("/profile"),
  },
];

const BottomMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={css.menu}>
      <div className={css.menu__wrapper}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={cn(css.menu__item, {
              _isActive: item.match(location.pathname),
            })}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomMenu;
