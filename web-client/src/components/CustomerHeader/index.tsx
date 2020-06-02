import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LanguageSwitcher from "components/LanguageSwitcher";
import * as styles from "./styles.module.scss";

const CustomerHeader = () => {

  return (
    <Container className={styles.container} fixed>
      <Typography>
        ABC CASINO
      </Typography>
      <Box display="flex" flexDirection="row-reverse">
        <Box p={1}>
          <LanguageSwitcher />
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerHeader;
