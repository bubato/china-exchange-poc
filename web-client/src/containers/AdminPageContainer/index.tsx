import React, { useEffect } from "react";
import "date-fns";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import { Transaction } from "models/Transaction";
import { toCurrency } from "Utils/numberFormat";
import { DEFAULT_DATE_TIME_FORMAT } from "Utils/setting";
import TransactionApiClient from "api/admin/TransactionApiClient";
import DashboardApiClient from "api/admin/DashboardApiClient";
import { Form, Field } from "react-final-form";
import TextField from "components/TextField";
import { useTranslation } from "react-i18next";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Pagination from "@material-ui/lab/Pagination";

import moment from "moment";

import * as styles from "./styles.module.scss";

const transactionApiClient = new TransactionApiClient();

const dashboardApiClient = new DashboardApiClient();

type Values = {
  reason: string;
};

const AdminPageContainer: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date>(new Date("2014-08-18T21:11:54"));
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date>(new Date("2014-08-18T21:11:54"));
  const [selectedStatus, setStatus] = React.useState<any>(["submitted"]);
  const [transactions, setTransactions] = React.useState<Array<Transaction>>([]);
  const [deposit, setDeposit] = React.useState("");
  const [idSelectTransaction, handleSelectTransaction] = React.useState<any>("");
  const [action, setAction] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [pageTransactions, setPageTransactions] = React.useState(1);
  const [totalPageTransactions, setTotalPageTransactions] = React.useState(1);

  useEffect(() => {
    dashboardApiClient.getInformationDashboard().then(res => {
      setDeposit(res.deposit);
    });
    transactionApiClient
      .getAllTransactions(pageTransactions, selectedStatus)
      .then(trans => {
        setTransactions(trans.docs);
        setTotalPageTransactions(trans.totalPages);
      });
  }, [pageTransactions, selectedStatus, totalPageTransactions]);

  const handleStartDateChange = (date: Date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setSelectedEndDate(date);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTransaction = () => {
    transactionApiClient
      .getAllTransactions(pageTransactions, selectedStatus)
      .then(trans => {
        setTransactions(trans.docs);
        setTotalPageTransactions(trans.totalPages);
      });
  };

  const handleStatusChange = (status: any) => {
    setStatus(status);
    setPageTransactions(1);
  };

  const handleClickOpen = (data: string, id: string) => {
    setAction(data);
    setOpen(true);
    handleSelectTransaction(id);
  };

  const handleTransaction = (values?: Values) => {
    transactionApiClient
      .completeTransaction(action, idSelectTransaction, values).then(() => {
        getTransaction();
      })
      .then(() => {
        handleClose();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePageTransactions = (page: number) => {
    setPageTransactions(page);
  };

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Box>
                <Typography variant="h5">
                  {t("total deposit")}
                </Typography>
                <Typography>
                  {toCurrency(deposit)}
                </Typography>
              </Box>
              <Box>
                <Typography>
                  {t("last charged")}
                </Typography>
                <Typography>
                  2020.05.31
                </Typography>
                <Typography>
                  12:34:33
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Box>
                <Typography variant="h5">
                  {t("total payable")}
                </Typography>
                <Typography>
                  N/A
                </Typography>
              </Box>
              <Box>
                <Typography>
                  {t("last charged")}
                </Typography>
                <Typography>
                  2020.05.31
                </Typography>
                <Typography>
                  12:34:33
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Box className={styles.tableAction}>
            <Tabs
              className={styles.tabs}
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label={t("pending")} onClick={() => handleStatusChange(["submitted"])} />
              <Tab label={t("approved")} onClick={() => handleStatusChange(["approved"])} />
              <Tab label={t("rejected")} onClick={() => handleStatusChange(["rejected"])} />
            </Tabs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container className={styles.dateContainer}>
                <KeyboardDatePicker
                  className={styles.startDate}
                  margin="normal"
                  id="date-picker-dialog"
                  label={t("from")}
                  format="MM/dd/yyyy"
                  value={selectedStartDate}
                  onChange={(event: any) => handleStartDateChange(event)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label={t("to")}
                  format="MM/dd/yyyy"
                  value={selectedEndDate}
                  onChange={(event: any) => handleEndDateChange(event)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">{t("date")}</TableCell>
                  <TableCell align="left">{t("user ID")}</TableCell>
                  <TableCell align="left">{t("type")}</TableCell>
                  <TableCell align="left">{t("from user")}</TableCell>
                  <TableCell align="left">{t("commission")}</TableCell>
                  <TableCell align="left">{t("payable")}</TableCell>
                  <TableCell align="left">{t("status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions !== [] && transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell align="left">{moment(transaction.createdAt).format(DEFAULT_DATE_TIME_FORMAT)}</TableCell>
                    <TableCell align="left">{transaction.merchandiser ? transaction.merchandiser._id : "N/A"}</TableCell>
                    <TableCell align="left">{transaction.paymentMethod.name}</TableCell>
                    <TableCell align="left">{transaction.senderAccountInfo ? transaction.senderAccountInfo : "N/A"}</TableCell>
                    <TableCell align="left">{toCurrency(transaction.commision)}</TableCell>
                    <TableCell align="left">{toCurrency(transaction.deposit)}</TableCell>
                    <TableCell align="left">
                      {transaction.status === "submitted" &&
                        <>
                          <Button variant="contained" onClick={() => handleClickOpen("approve", transaction._id)} className={styles.btn} color="primary">
                            {t("paid")}
                          </Button>
                          <Button className={styles.btn} onClick={() => handleClickOpen("reject", transaction._id)} variant="contained" color="secondary">
                            {t("reject")}
                          </Button>
                        </>}
                      {transaction.status !== "submitted" && <p className={styles.status}>{transaction.status === "rejected" ? t("rejected") : t("approved")}</p>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box alignContent="flex-end" p={1}>
              <Pagination 
                page={pageTransactions} 
                count={totalPageTransactions} 
                variant="outlined" 
                onChange={(e, page: number) => handleChangePageTransactions(page)}
              />
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialog}
      >
        <DialogTitle id="alert-dialog-title">{action === "approve" ? t("are you sure") : t("enter reason")}</DialogTitle>
        {action === "reject" &&
        <Box className={styles.form}>
          <Form
            onSubmit={() => { }}
            render={({ handleSubmit, form, submitting, pristine, values }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Field
                    name="reason"
                    component={TextField}
                    label={t("reason")}
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                  <DialogActions>
                    <Button onClick={() => handleTransaction(values as Values)} color="primary">
                      {t("yes")}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      {t("no")}
                    </Button>
                  </DialogActions>
                </form>
              );
            }}
          />
        </Box>}
        {action === "approve" &&
        <DialogActions>
          <Button onClick={() => handleTransaction()} color="primary">
            {t("yes")}
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            {t("no")}
          </Button>
        </DialogActions>}
      </Dialog>
    </Box>
  );
};


export default AdminPageContainer;
