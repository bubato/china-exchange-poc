import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";

let language = localStorage.getItem("language");

if (!language) {
  language = "cn";
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "cn",
    debug: true,
    lng: language,
    backend: {
      loadPath: "/locales/{{lng}}.json"
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
