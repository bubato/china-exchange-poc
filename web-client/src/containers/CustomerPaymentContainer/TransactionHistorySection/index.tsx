import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import SectionHeader from "components/SectionHeader";
import moment from "moment";
import { Dialog, DialogTitle, DialogActions, Button, Typography, Box } from "@material-ui/core";
import { toCurrency } from "Utils/numberFormat";
import { DEFAULT_DATE_TIME_FORMAT } from "Utils/setting";
import { makeStyles } from "@material-ui/core/styles";
import { Transaction } from "models/Transaction";
import { useTranslation } from "react-i18next";
import Pagination from "@material-ui/lab/Pagination";

import styles from "./styles.module.scss";

interface TransactionHistorySectionProps {
  transactions: Array<Transaction>,
  totalPages: number,
  handleChangePageTransactions: Function
}

type SelectedTransaction = {
  _id: string,
  createdAt: string,
  paymentMethod: {
    name: string,
    _id: string
  },
  amount: number,
  status: string
};

const useStyles = makeStyles({
  createAt: {
    width: "25%"
  }
});

const TransactionHistorySection: React.FunctionComponent<TransactionHistorySectionProps> = ({ transactions, totalPages, handleChangePageTransactions }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<any>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewTransaction = (transaction: SelectedTransaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <SectionHeader title={t("transaction history")} />
      <Table>
        <TableBody>
          {(transactions || []).map(
            (transaction) => (
              <TableRow key={transaction._id} onClick={() => handleViewTransaction(transaction)} className={styles.tableRow}>
                <TableCell className={classes.createAt}>
                  {moment(transaction.createdAt).format(DEFAULT_DATE_TIME_FORMAT)}
                </TableCell>
                <TableCell>{transaction.paymentMethod.name}</TableCell>
                <TableCell>{toCurrency(transaction.amount)}</TableCell>
                <TableCell className={styles.status}>{transaction.status}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        {selectedTransaction &&
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={styles.dialog}
          >
            <DialogTitle id="alert-dialog-title">{t("Transaction Details")}</DialogTitle>
            <Box className={styles.box}>
              <Typography>{t("payment method")}: {selectedTransaction.paymentMethod.name}</Typography>
              <Typography>{t("status")}: {selectedTransaction.status}</Typography>
              <Typography>{t("account no")}: {selectedTransaction.receiverAccount.accountNo}</Typography>
              <Typography>{t("amount")}: {toCurrency(selectedTransaction.amount)}</Typography>
              {selectedTransaction && selectedTransaction.paymentMethod.name === "bank" &&
                <Typography>{t("bank name")}: {selectedTransaction.receiverAccount.name}</Typography>}
              <Typography>{t("created at")}: {moment(selectedTransaction.createdAt).format(DEFAULT_DATE_TIME_FORMAT)}</Typography>
              <Typography>{t("updated at")}: {moment(selectedTransaction.updatedAt).format(DEFAULT_DATE_TIME_FORMAT)}</Typography>
              {selectedTransaction && selectedTransaction.paymentMethod.name !== "bank" &&
                <>
                  <Typography>{t("qr code")}: </Typography>
                  <Box className={styles.qrCode}>
                    <img alt="qr code" src={selectedTransaction.receiverAccount.qrCodeUrl} />
                  </Box>
                </>}
            </Box>
            <DialogActions className={styles.btnGroup}>
              <Button onClick={handleClose} color="primary" autoFocus>
                {t("cancel")}
              </Button>
            </DialogActions>
          </Dialog>}
      </Table>
      <Box alignContent="flex-end" p={1}>
        <Pagination count={totalPages} variant="outlined" onChange={(e, page: number) => handleChangePageTransactions(page)} />
      </Box>
    </>
  );
};

export default TransactionHistorySection;