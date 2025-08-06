import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { deleteTokenRequest } from "api/features/token/tokenSlice";
import { useToken } from "api/features/token/useToken";
import { logout } from "api/features/user/userSlice";
import { useUser } from "api/features/user/useUser";
import { AppDispatch } from "api/store";
import { ReactComponent as EmailSvg } from "assets/email.svg";
import Button from "UI/components/Button";
import Input from "UI/components/Input";

import css from "./styles.module.scss";

const ProfilePage: FC = () => {
  const { currentUser } = useUser();
  const { token, loading } = useToken();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleDeleteToken = () => {
    if (!currentUser?.id) return;
    dispatch(deleteTokenRequest(currentUser?.id));
  };
  return (
    <div className={css.profile}>
      <div className={css.profile__header}>Ваши данные</div>
      <div className={css.profile__grid}>
        <div className={css.profile__item}>
          <div className={css.profile__itemBody}>
            <div className={css.profile__itemIcon}>
              <EmailSvg />
            </div>
            <div className={css.profile__itemData}>{currentUser?.email}</div>
          </div>
        </div>
        <Input
          label="Темная тема"
          leftLabel
          inputAttributes={{
            type: "checkbox",
            disabled: true,
          }}
        />
        {token && (
          <div>
            <span>Ваш токен: {token} </span>
            <button onClick={handleDeleteToken} disabled={loading}>{loading ? 'Удаление' : 'Удалить'}</button>
          </div>
        )}
      </div>
      <Button
        text="Выйти"
        className={css.profile__exit}
        buttonAttributes={{
          onClick: handleLogout,
        }}
      />
    </div>
  );
};

export default ProfilePage;
