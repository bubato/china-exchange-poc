import React from "react";
import * as styles from "./styles.module.scss";

interface SectionHeaderProps {
  title: string;
}


const SectionHeader: React.FunctionComponent<SectionHeaderProps> = ({ title }) => {
  return (
    <div className={styles.headerContainer}>
      <span className={styles.headerText}>{title}</span>
    </div>
  );
};

export default SectionHeader;
