import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Form } from "react-final-form";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import LanguageSwitcher from "components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

import * as styles from "./styles.module.scss";

const AgencyHeader = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [openLogout, setOpenLogout] = React.useState(false);

  const Logout = () => {
    localStorage.removeItem("accessToken");
    history.push("/login");
  };

  const toggleLogoutModal = () => {
    setOpenLogout(!openLogout);
  };

  return (
    <Container className={styles.container} fixed>
      <Typography>
        ABC CASINO
      </Typography>
      <Box display="flex" flexDirection="row-reverse">
        <Box className={styles.boxContainer} p={1}>
          <Button variant="contained" onClick={toggleLogoutModal}>
            {t("logout")}
          </Button>
        </Box>
        <Box p={1}>
          <LanguageSwitcher />
        </Box>
      </Box>
      <Dialog
        open={openLogout}
        onClose={toggleLogoutModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogContainer}
      >
        <DialogTitle id="alert-dialog-title">{t("are you sure?")}</DialogTitle>
        <Box className={styles.form}>
          <Form
            onSubmit={() => {}}
            render={({ handleSubmit, form, submitting, pristine, values }) => {
              return (
                <DialogActions>
                  <Button onClick={() => Logout()} color="primary">
                    {t("yes")}
                  </Button>
                  <Button onClick={toggleLogoutModal} color="primary" autoFocus>
                    {t("no")}
                  </Button>
                </DialogActions>
              );
            }}
          />
        </Box>                       
      </Dialog>
    </Container>
  );
};

export default AgencyHeader;
