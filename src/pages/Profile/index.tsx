import React, { FC } from "react";
import css from "./styles.module.scss";
import Button from "UI/components/Button";
import { useAuth } from "hooks/useAuth";
import { ReactComponent as EmailSvg } from "assets/email.svg";
import { useDispatch } from "react-redux";
import { tokenSlice } from "store/slices/token.slice";
import { userSlice } from "store/slices/user.slice";

const Profile: FC = () => {
  const { email } = useAuth();
  const dispatch = useDispatch();
  return (
    <div className={css.profile}>
      <div className={css.profile__header}>Ваши данные</div>
      <div className={css.profile__grid}>
        <div className={css.profile__gridItem}>
          <div className={css.profile__gridIcon}>
            <EmailSvg />
          </div>
          <div className={css.profile__gridData}>{email}</div>
        </div>
      </div>
      <Button
        text="Выйти"
        className={css.profile__exit}
        buttonAttributes={{
          onClick: () => {
            dispatch(userSlice.actions.removeUserAction());
            dispatch(tokenSlice.actions.removeTokenAction());
          },
        }}
      />
    </div>
  );
};

export default Profile;
