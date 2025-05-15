import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useCalendar } from "./hook/useCalendar";

const Calendar: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const {} = useCalendar({
    accountId,
  });
  return (
    <Container>
      <Button
        text="Назад"
        buttonAttributes={{
          type: "button",
          onClick: () => navigate(`/account/${accountId}`),
        }}
      />
    </Container>
  );
};

export default Calendar;
