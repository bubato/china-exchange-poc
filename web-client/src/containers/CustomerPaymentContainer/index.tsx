import React, { useEffect } from "react";
import AmountSection from "containers/CustomerPaymentContainer/AmountSection";
import MethodSection from "containers/CustomerPaymentContainer/MethodSection";
import TransactionHistorySection from "containers/CustomerPaymentContainer/TransactionHistorySection";
import PaymentModal from "containers/CustomerPaymentContainer/PaymentModal";
import BuyerTransactionApiClient from "api/buyer/BuyerTransactionApiClient";
import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";
import CustomerHeader from "components/CustomerHeader";
import LoginApiClient from "api/LoginApiClient";
import { Transaction } from "models/Transaction";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, Box, DialogActions, Button } from "@material-ui/core";
import TextField from "components/TextField";
import { Form, Field } from "react-final-form";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

const transactionApiClient = new BuyerTransactionApiClient();
const loginApiClient = new LoginApiClient();

type Values = {
  amount: number;
};

const CustomerPaymentContainer: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [amount, setAmount] = React.useState<number | string>(0);
  const [isPaymentModalOpen, togglePaymentModal] = React.useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [paymentAccount, setPaymentAccount] = React.useState<any>();
  const [transactions, setTransactions] = React.useState<Array<Transaction>>([]);
  const [newTransaction, setNewTransaction] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const merchToken = urlParams.get("merchToken");
  const customerId = urlParams.get("customerId");
  const [avaibilityMethods, setAvaibilityMethods] = React.useState([]);
  const [pageTransactions, setPageTransactions] = React.useState(1);
  const [totalPageTransactions, setTotalPageTransactions] = React.useState(1);

  interface MerchandiserUser {
    id: string;
    fullName: string;
    username: string;
    roles: string[];
    appToken: string ;
  }

  useEffect(() => {
    if (merchToken && customerId) {
      ChinaExchangeApiClient.appToken = merchToken;
      loginApiClient.currentMerchandiser().then(currentUser => {
        localStorage.setItem("customerId", customerId);
        if (!currentUser.roles.includes("merchandiser")) {
          history.push("/");
        } else {
          transactionApiClient
            .getAllTransactions(customerId, pageTransactions)
            .then(trans => {
              setTransactions(trans.docs);
              setTotalPageTransactions(trans.totalPages);
            });
        }
      }).catch(err => {
        history.push("/");
      });
    }

    const loadAvailableMethod = () => {
      loginApiClient.currentMerchandiser().then((currentUser: MerchandiserUser) => {
        localStorage.setItem("appToken", currentUser.appToken);
        ChinaExchangeApiClient.appToken = currentUser.appToken;
        transactionApiClient.methodAvaibilities().then(response => {
          setAvaibilityMethods(response);
        });
      });
    };
    
    loadAvailableMethod();
  }, [customerId, merchToken, history, pageTransactions]);

  const handleChange = (e: Event, value: string) => {
    setAmount(value);
  };

  const handleDataAfterSubmit = () => {
    handleClose();
    setPaymentMethod("");
    setAmount("");
    transactionApiClient
      .getAllTransactions(customerId as string, pageTransactions)
      .then(trans => {
        setTransactions(trans.docs);
        setTotalPageTransactions(trans.totalPages);
      });
  };

  const handleChangePageTransactions = (page: number) => {
    setPageTransactions(page);
  };

  const handleTogglePaymentModal = () => {
    togglePaymentModal(!isPaymentModalOpen);
  };

  const handleMethodChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayClick = () => {
    if (amount !== "other") {
      transactionApiClient
        .createTransaction({
          amount,
          paymentType: paymentMethod,
          customerId
        })
        .then((res: any) => {
          setPaymentAccount(res.paymentAccount);
          setNewTransaction(res.transaction);
        }).then(() => {
          handleTogglePaymentModal();
        });
    } else {
      setOpen(true);
    }
  };

  const handlePayOtherAmount = (values: Values) => {
    setAmount(values.amount);
    transactionApiClient
      .createTransaction({
        amount:values.amount,
        paymentType: paymentMethod,
        customerId
      })
      .then((res: any) => {
        setPaymentAccount(res.paymentAccount);
        setNewTransaction(res.transaction);
        handleTogglePaymentModal();
      });
  };

  return (
    <>
      <CustomerHeader />
      <div className={styles.pageContainer}>
        <AmountSection amount={amount} onChange={handleChange} />
        <MethodSection
          method={paymentMethod}
          onChange={handleMethodChange}
          onPay={handlePayClick}
          amount={amount}
          availableMethods={avaibilityMethods}
        />
        <TransactionHistorySection 
          transactions={transactions} 
          totalPages={totalPageTransactions} 
          handleChangePageTransactions={handleChangePageTransactions}
        />
        <PaymentModal
          isOpen={isPaymentModalOpen}
          toggle={handleTogglePaymentModal}
          method={paymentMethod}
          amount={amount}
          account={paymentAccount}
          transaction={newTransaction}
          onDataAfterSubmit={handleDataAfterSubmit}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={styles.dialog}
        >
          <DialogTitle id="alert-dialog-title">{t("please enter the amount")}</DialogTitle>
          <Box className={styles.form}>
            <Form
              initialValues={{ amount: 100 }}
              onSubmit={() => { }}
              render={({ handleSubmit, valid, form, submitting, pristine, values }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Field
                      name="amount"
                      component={TextField}
                      label="Amount"
                      type="number"
                      validate={(value) =>  {
                        if(!value) return "Required";
                        if(value < 100) return "Must greater than 100";
                        return null;
                      }}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      value={100}
                    />
                    <DialogActions>
                      <Button color="primary" disabled={!valid} onClick={() => handlePayOtherAmount(values as Values)}>
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
          </Box>
        </Dialog>
      </div>
    </>
  );
};

export default CustomerPaymentContainer;
