import React, { FC } from "react";
import css from "./styles.module.scss";
import Button from "UI/components/Button";
import { useAuth } from "hooks/useAuth";
import { ReactComponent as EmailSvg } from "assets/email.svg";

const Profile: FC = () => {
  const { email } = useAuth();
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
      <Button text="Выйти" className={css.profile__exit} />
    </div>
  );
};

export default Profile;
