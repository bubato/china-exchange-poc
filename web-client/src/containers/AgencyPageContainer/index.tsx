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
import DashboardApiClient from "api/agency/DashboardApiClient";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { toCurrency } from "Utils/numberFormat";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";
import { Transaction } from "models/Transaction";
import { DEFAULT_DATE_TIME_FORMAT } from "Utils/setting";
import AgencyHeader from "components/AgencyHeader";
import TransactionApiClient from "api/agency/TransactionApiClient";
import { useTranslation } from "react-i18next";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";

import * as styles from "./styles.module.scss";

const dashboardApiClient = new DashboardApiClient();

const transactionApiClient = new TransactionApiClient();

const AgencyPageContainer: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date("2014-08-18T21:11:54"));
  const [deposit, setDeposit] = React.useState<string>("");
  const [transactions, setTransactions] = React.useState<Array<Transaction>>([]);
  const [pageTransactions, setPageTransactions] = React.useState(1);
  const [totalPageTransactions, setTotalPageTransactions] = React.useState(1);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    dashboardApiClient
      .getInformationDashboard()
      .then(res => setDeposit(res.deposit)).then(() => {
        transactionApiClient
          .getAllTransactions(pageTransactions as number)
          .then(trans => {
            setTransactions(trans.docs);
            setTotalPageTransactions(trans.totalPages);
          });
      });
  }, [pageTransactions]);

  const handleChangePageTransactions = (page: number) => {
    setPageTransactions(page);
  };

  return (
    <>
      <AgencyHeader />
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
          <Grid item xs={12}>
            <Box className={styles.tableAction}>
              <Box className={styles.btnGroup}>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <Button>{t("deposit")}</Button>
                  <Button>{t("withdraw")}</Button>
                </ButtonGroup>
              </Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container className={styles.dateContainer}>
                  <KeyboardDatePicker
                    className={styles.startDate}
                    margin="normal"
                    id="date-picker-dialog"
                    label={t("from")}
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={(event: any) => handleDateChange(event)}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label={t("to")}
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    onChange={(event: any) => handleDateChange(event)}
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
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell align="left">{moment(transaction.updatedAt).format(DEFAULT_DATE_TIME_FORMAT)}</TableCell>
                      <TableCell align="left">{transaction.merchandiser ? transaction.merchandiser._id : "N/A"}</TableCell>
                      <TableCell align="left">{transaction.paymentMethod.name}</TableCell>
                      <TableCell align="left">{transaction.senderAccountInfo ? transaction.senderAccountInfo : "N/A"}</TableCell>
                      <TableCell align="left">{toCurrency(transaction.commision)}</TableCell>
                      <TableCell align="left">{toCurrency(transaction.deposit)}</TableCell>
                      <TableCell align="left" className={styles.status}>{transaction.status}</TableCell>
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
      </Box>
    </>
  );
};

export default AgencyPageContainer;
