import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Form, Field } from "react-final-form";
import TextField from "components/TextField";
import { useHistory } from "react-router-dom";
import LoginApiClient from "api/LoginApiClient";
import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";
import { useTranslation } from "react-i18next";

import * as styles from "./styles.module.scss";

const loginApiClient = new LoginApiClient();

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(30),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const LoginPageContainer: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const history = useHistory();

  const onSubmit = async (values: any) => {
    try {
      const { token } = await loginApiClient.login(values);
      localStorage.setItem("accessToken", token);
      ChinaExchangeApiClient.accessToken = token;
      const currentUser = await loginApiClient.currentUser();
      if (currentUser.roles.includes("admin")) {
        history.push("/admin");
      } else if (currentUser.roles.includes("merchandiser")) {
        history.push("/merchandiser");
      } else {
        history.push("/agency");
      }
    } catch {
      // eslint-disable-next-line no-alert
      alert(t("login error"));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={`${classes.paper} ${styles.loginBox}`} p={4}>
        <Typography component="h1" variant="h5" className={styles.titles}>
          {t("login")}
        </Typography>

        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  name="username"
                  component={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label={t("username")}
                />
                <Field
                  name="password"
                  component={TextField}
                  type="password"
                  label={t("password")}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onSubmit={handleSubmit}
                  color="primary"
                  className={classes.submit}
                >
                  {t("login")}
                </Button>
                <Link color="inherit" className={styles.link} href="#">
                  {t("forgot password")}
                </Link>
                <Typography className={styles.greyText}>
                  {t("don't have account")}
                  <Link color="inherit" className={styles.linkSignUp} href="#">
                    {t("signup")}
                  </Link>
                </Typography>
              </form>
            );
          }}
        />
      </Box>
    </Container>
  );
};
export default LoginPageContainer;
