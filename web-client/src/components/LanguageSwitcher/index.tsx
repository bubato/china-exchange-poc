import React, { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { FORMAT_LANGUAGE } from "Utils/setting";
import { useTranslation } from "react-i18next";
import LoginApiClient from "api/LoginApiClient";
import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";
import styles from "./styles.module.scss";

const loginApiClient = new LoginApiClient();
let listLanguage = FORMAT_LANGUAGE;

export default function LanguageSwitcher() {
  const [language, setLanguage] = React.useState(localStorage.getItem("language") || "cn");
  const { i18n } = useTranslation();

  useEffect(() => {
    async function getCurrentUser() {
      ChinaExchangeApiClient.accessToken = localStorage.getItem("accessToken");
      const currentUser = await loginApiClient.currentUser();
      if (currentUser.roles.includes("buyer")) {
        listLanguage = listLanguage.filter(item => item.value !== "ko");
      }
    }

    getCurrentUser();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const getLanguage = event.target.value as string;
    i18n.changeLanguage(getLanguage);
    localStorage.setItem("language", getLanguage);
    setLanguage(getLanguage);
  };

  return (
    <FormControl className={styles.formControl}>
      <Select
        labelId="select-outlined-label"
        id="select-outlined"
        value={language}
        onChange={handleChange}
        label="Language"
      >
        {listLanguage.map((languageItem) => (
          <MenuItem key={languageItem.id} value={languageItem.value}>{languageItem.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}