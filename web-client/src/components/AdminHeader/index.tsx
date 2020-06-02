import React from "react";
import PaymentAccountApiClient from "api/admin/PaymentAccountApiClient";
import PaymentMethodApiClient from "api/admin/PaymentMethodApiClient";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Form, Field } from "react-final-form";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import SettingsIcon from "@material-ui/icons/Settings";
import Table from "@material-ui/core/Table";
import TextField from "components/TextField";
import FileInput from "components/FileInput";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { PaymentAccount } from "models/PaymentAccount";
import { PaymentMethod } from "models/PaymentMethodModal";
import { useHistory } from "react-router-dom";
import LanguageSwitcher from "components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

import * as styles from "./styles.module.scss";

const paymentAccountApiClient = new PaymentAccountApiClient();

const paymentMethodApiClient = new PaymentMethodApiClient(); 

const AdminHeader = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [openLogout, setOpenLogout] = React.useState(false);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const [paymentAccounts, setPaymentAccounts] = React.useState<PaymentAccount[]>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [methodSelectedName, setMethodSelectedName] = React.useState<string>("");
  const [methodId, setMethodId] = React.useState<any>("");

  const handleClickOpen = () => {
    setOpen(true);
    getPaymentAccount();
    getPaymentMethods();
  };

  const handleClickOpenModalAdd = (name:string) => {
    setOpenModalAdd(true);
    setOpen(false);
    handleModalAddAccount(name);
    getPaymentMethodId(name);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
    setOpen(true);
  };

  const handleModalAddAccount = (name: string) => {
    setMethodSelectedName(name);
  };

  const getPaymentMethodId = (methodName: string) => {
    const method = paymentMethods.find(item => 
      item.name === methodName
    );
    setMethodId(method?._id);
  };

  const getPaymentAccount = () => {
    paymentAccountApiClient
      .getAllPaymentAccout()
      .then((res: any) => setPaymentAccounts(res));
  };

  const getPaymentMethods = () => {
    paymentMethodApiClient
      .getAllPaymentMethod()
      .then((res: any) => setPaymentMethods(res));
  };

  const onSubmit = (values: any) => {
    const formData = new FormData();
    !!values.accountOwnerName && formData.append("accountOwnerName", values.accountOwnerName);
    methodId && formData.append("paymentMethodId", methodId );
    !!values.accountNo && formData.append("accountNo", values.accountNo);
    !!values.name && formData.append("name", values.name);
    !!values.dailyLimit && formData.append("dailyLimit", values.dailyLimit );
    !!values.qrImage && formData.append("qrImage", values.qrImage.file);
    
    paymentAccountApiClient.createPaymentAccount(formData).then(() => handleCloseModalAdd()).then(() => getPaymentAccount()).catch(() => {
      // eslint-disable-next-line no-alert
      alert("Please fill out the information");
    });
  };

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
          <SettingsIcon onClick={handleClickOpen} className={styles.icon} />
          <Button variant="contained" onClick={toggleLogoutModal}>
            {t("logout")}
          </Button>
        </Box>
        <Box p={1}>
          <LanguageSwitcher />
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogContainer}
      >
        <DialogContent className={styles.dialog}>
          <DialogContentText id="alert-dialog-description">
            <TableContainer component={Paper}>
              <DialogTitle id="alert-dialog-title">{t("alipay")}</DialogTitle>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell align="right">{t("qr")}</TableCell>
                    <TableCell align="right">{t("daily limit")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentAccounts.filter(item =>item.paymentMethod.name === "alipay") !== [] && 
                  paymentAccounts.filter(item =>item.paymentMethod.name === "alipay").map(paymentAccount => (
                    <TableRow key={paymentAccount.paymentMethodId}>
                      <TableCell component="th" scope="row">
                        {paymentAccount.accountOwnerName}
                      </TableCell>
                      <TableCell align="right">
                        <img className={styles.qrImage} alt="qrCode" src={paymentAccount.qrCodeUrl} />
                      </TableCell>
                      <TableCell align="right">{paymentAccount.dailyLimit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogActions>
                <Button color="primary" onClick={() => handleClickOpenModalAdd("alipay")}>
                  {t("add")}
                </Button>
              </DialogActions>
            </TableContainer>
            <TableContainer component={Paper}>
              <DialogTitle id="alert-dialog-title">{t("wechat")}</DialogTitle>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell align="right">{t("qr")}</TableCell>
                    <TableCell align="right">{t("daily limit")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentAccounts.filter(item =>item.paymentMethod.name === "wechat") && 
                  paymentAccounts.filter(item =>item.paymentMethod.name === "wechat")
                    .map(paymentAccount => (
                      <TableRow key={paymentAccount.paymentMethodId}>
                        <TableCell component="th" scope="row">
                          {paymentAccount.accountOwnerName}
                        </TableCell>
                        <TableCell align="right">
                          <img className={styles.qrImage} alt="qrCode" src={paymentAccount.qrCodeUrl} />
                        </TableCell>
                        <TableCell align="right">{paymentAccount.dailyLimit}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <DialogActions>
                <Button color="primary" onClick={() => handleClickOpenModalAdd("wechat")}>
                  {t("add")}
                </Button>
              </DialogActions>
            </TableContainer>
            <TableContainer component={Paper}>
              <DialogTitle id="alert-dialog-title">{t("bank")}</DialogTitle>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell align="right">{t("bank")}</TableCell>
                    <TableCell align="right">{t("account no.")}</TableCell>
                    <TableCell align="right">{t("daily limit")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentAccounts.filter(item =>item.paymentMethod.name ==="bank") !== [] && 
                  paymentAccounts.filter(item =>item.paymentMethod.name ==="bank").map(paymentAccount => (
                    <TableRow key={paymentAccount.paymentMethodId}>
                      <TableCell component="th" scope="row">
                        {paymentAccount.accountOwnerName}
                      </TableCell>
                      <TableCell align="right">
                        {paymentAccount.name}
                      </TableCell>
                      <TableCell align="right">{paymentAccount.accountNo}</TableCell>
                      <TableCell align="right">{paymentAccount.dailyLimit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DialogActions>
                <Button color="primary" onClick={() => handleClickOpenModalAdd("bank")}>
                  {t("add")}
                </Button>
              </DialogActions>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openModalAdd}
        onClose={handleCloseModalAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialogContainer}
      >
        <DialogTitle id="alert-dialog-title">{methodSelectedName.toUpperCase()}</DialogTitle>
        <DialogContent className={styles.dialog}>
          <DialogContentText id="alert-dialog-description">
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, form, submitting, pristine, values }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Field
                      name="accountOwnerName"
                      component={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Name"
                    />
                    <Field
                      name="dailyLimit"
                      component={TextField}
                      label="Daily Limit"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                    {methodSelectedName === "bank" &&
                    <Field
                      name="name"
                      component={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Bank"
                    />}
                    {methodSelectedName === "bank" &&
                    <Field
                      name="accountNo"
                      component={TextField}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="Account No"
                    />}
                    {methodSelectedName !== "bank" && <Field
                      name="qrImage"
                      component={FileInput}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label="QR image"
                      formValues={values}
                    />}
                    <DialogActions>
                      <Button color="primary" onClick={handleCloseModalAdd}>
                        {t("close")}
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        onSubmit={handleSubmit}
                      >
                        {t("add")}
                      </Button>
                    </DialogActions>
                  </form>
                );
              }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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

export default AdminHeader;
