import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import thCommon from "./locales/th/common.json";
import thAuth from "./locales/th/auth.json";
import thDashboard from "./locales/th/dashboard.json";
import thProducts from "./locales/th/products.json";
import thOrders from "./locales/th/orders.json";
import thPos from "./locales/th/pos.json";
import thUsers from "./locales/th/users.json";
import thSettings from "./locales/th/settings.json";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enProducts from "./locales/en/products.json";
import enOrders from "./locales/en/orders.json";
import enPos from "./locales/en/pos.json";
import enUsers from "./locales/en/users.json";
import enSettings from "./locales/en/settings.json";

// Read persisted language from Zustand's localStorage
function getPersistedLanguage(): string {
  try {
    const stored = localStorage.getItem("pos-ui");
    if (stored) {
      const parsed = JSON.parse(stored) as { state?: { language?: string } };
      if (parsed.state?.language) {
        return parsed.state.language;
      }
    }
  } catch {
    // ignore parse errors
  }
  return "th";
}

i18n.use(initReactI18next).init({
  resources: {
    th: {
      common: thCommon,
      auth: thAuth,
      dashboard: thDashboard,
      products: thProducts,
      orders: thOrders,
      pos: thPos,
      users: thUsers,
      settings: thSettings,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      dashboard: enDashboard,
      products: enProducts,
      orders: enOrders,
      pos: enPos,
      users: enUsers,
      settings: enSettings,
    },
  },
  lng: getPersistedLanguage(),
  fallbackLng: "th",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
