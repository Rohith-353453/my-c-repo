import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import messages from "../public/locale/en.json";

void i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: { en: { translation: messages } },
  interpolation: { escapeValue: false },
});
