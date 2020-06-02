import React from "react";
import Modal from "@material-ui/core/Modal";
import { toCurrency } from "Utils/numberFormat";
import { Form, Field } from "react-final-form";
import TextField from "components/TextField";
import BuyerTransactionApiClient from "api/buyer/BuyerTransactionApiClient";
import { Box, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface PaymentModalProps {
  isOpen: boolean,
  toggle: Function,
  onDataAfterSubmit: Function,
  method: string,
  amount: number | string,
  account: {
    qrCodeUrl: string,
    name: string,
    accountOwnerName: string,
    accountNo: string
  },
  transaction: {
    _id: string
  }
}

const buyerTransactionApiClient = new BuyerTransactionApiClient();

const PaymentModal: React.FunctionComponent<PaymentModalProps> = ({
  isOpen,
  toggle,
  method,
  amount,
  account,
  onDataAfterSubmit,
  transaction
}) => {
  const { t } = useTranslation();
  const handleComplete = (values: any) => {
    onSubmit(values);
    onDataAfterSubmit();
  };

  const onSubmit = async (values: any) => {
    buyerTransactionApiClient.submitTransaction(transaction._id, values).then(() => {
      toggle();
    });
  };

  const renderLabel = () => {
    if(method === "bank"){
      return t("enter bank");
    }
    if(method === "alipay"){
      return t("provide alipay ID");
    }
    
    return t("Provide wechat ID");
    
  };

  return (
    <Modal open={isOpen} onClose={() => toggle()}>
      <div className={styles.modalContainer}>
        <div className={styles.modalTitle}>
          <h2>{`Pay with ${method}`}</h2>
          <h2>{toCurrency(amount)}</h2>
        </div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, valid, form, submitting, pristine, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  name="senderAccountInfo"
                  component={TextField}
                  label={renderLabel()}
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  validate={
                    (value) => {
                      if(!value){
                        return t("guide fill micro-signal");
                      }
                      
                      return "";
                    }
                  }
                />
                {
                  method === "bank" && account && 
                  <div className={styles.bankInformation}>
                    <p>{t("bank")}: {account.name}</p>
                    <p>{t("name")}: {account.accountOwnerName}</p>
                    <p>{t("account no")}: {account.accountNo}</p>
                  </div>
                }
                {method !== "bank" && !!values.senderAccountInfo && (
                <Box className={styles.imgContainer}>
                  <img className={styles.qrImage} src={account && account.qrCodeUrl} alt="qr" />
                </Box>
                )}
                <div className={styles.modalFooter}>
                  <Button variant="contained" disabled={!valid} color="primary" onClick={() => handleComplete(values)}>
                    {t("complete")}
                  </Button>
                </div>
              </form>
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default PaymentModal;