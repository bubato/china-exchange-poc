import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import SectionHeader from "components/SectionHeader";
import withStyles from "@material-ui/core/styles/withStyles";
import { useTranslation } from "react-i18next";
import * as styles from "./styles.module.scss";
import wechatIcon from "./wechat.png";
import alipayIcon from "./alipay.png";

interface MethodSectionProps {
  method: string, 
  amount:number | string,
  onChange: Function,
  onPay: Function,
  availableMethods: Array<any>
}

const StyledRadioGroup = withStyles(() => ({
  root: {
    flexDirection: "row",
    alignItems: "center",
    margin: "30px 0"
  }
}))(RadioGroup);

const StyledFormControlLabel = withStyles(() => ({
  root: {}
}))(FormControlLabel);

const MethodSection: React.FunctionComponent<MethodSectionProps> = ({ method, amount, onChange, onPay, availableMethods }) => {
  const { t } = useTranslation();

  const checkAvaibilityMethods = (methods: String) => {
    const paymentMethods = availableMethods.find((item: any)  => item.name === methods) || { available: false };
    return !paymentMethods.available || false;
  };

  const checkAlert = (methods: String) => {
    if (checkAvaibilityMethods(methods)) {
      // eslint-disable-next-line no-alert
      alert(`${methods  } method has not been created yet`);
    }
  };

  return (
    <>
      <SectionHeader title={t("method")} />
      <StyledRadioGroup
        aria-label="gender"
        name="gender1"
        value={method}
        onChange={event => onChange(event)}
      >
        <StyledFormControlLabel
          onMouseDown={() => checkAlert("wechat")}
          disabled={checkAvaibilityMethods("wechat")}
          value="wechat"
          control={<Radio />}
          label={
            <img
              className={styles.imgLabel}
              src={wechatIcon}
              alt="wechat-pay"
            />
                    }
        />
        <StyledFormControlLabel
          onMouseDown={() => checkAlert("alipay")}
          disabled={checkAvaibilityMethods("alipay")}
          value="alipay"
          control={<Radio />}
          label={
            <img className={styles.imgLabel} src={alipayIcon} alt="alipay" />
                    }
        />
        <StyledFormControlLabel
          onMouseDown={() => checkAlert("bank")}
          disabled={checkAvaibilityMethods("bank")}
          value="bank"
          control={<Radio />}
          label={t("bank transfer")}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!amount || !method}
          onClick={event => onPay(event)}
        >
          {t("pay")}
        </Button>
      </StyledRadioGroup>
    </>
  );
};

export default MethodSection;
