import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

export type FieldInputProp = {
  input: any;
  meta: any;
  formValues: any
};

export default function FileInput(props: FieldInputProp) {
  const { t } = useTranslation();
  const { input, formValues } = props;

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  async function handleChange(event: any) {
    const file = event?.currentTarget?.files[0];
    const base64 = await toBase64(file);
    input.onChange({ file, base64 });
  }
  
  return (
    <Box className={styles.container}>
      {!formValues.qrImage && 
      <Button variant="contained" component="label">
        {t("upload qr image")}<input type="file" style={{ display: "none" }} onChange={handleChange} />
      </Button>}
      {formValues.qrImage && 
      <>
        <Typography className={styles.qrCodeLabel}>
          {t("qr code")}
        </Typography>
        <img className={styles.image} src={formValues.qrImage.base64} alt="error" />
      </>}
    </Box>
  );
}
