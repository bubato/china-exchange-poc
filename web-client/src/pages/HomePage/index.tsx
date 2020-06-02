import React, { PureComponent } from "react";
import styles from "./styles.module.scss";

export default class HomePage extends PureComponent {
  render() {
    return (
      <div className={styles.homePage}>
        <div className={styles.pageTitle}>China Payment System</div>
      </div>
    );
  }
}
