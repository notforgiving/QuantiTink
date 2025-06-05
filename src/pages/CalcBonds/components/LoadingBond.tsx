import React from "react";
import css from "../styles.module.scss";
import Load from "UI/components/Load";

const LoadingBond = () => {
  return (
    <div className={css.bond}>
      <Load
        style={{
          width: "400px",
          height: "709px",
        }}
      />
    </div>
  );
};

export default LoadingBond;
