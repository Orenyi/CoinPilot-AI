import { createContext, useContext, useEffect, useState } from "react";

import { CURRENCIES, DEFAULT_CURRENCY } from "../constants/currencies";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem("coinpilot-currency");

    return savedCurrency || DEFAULT_CURRENCY;
  });

  useEffect(() => {
    localStorage.setItem("coinpilot-currency", currency);
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    const exists = CURRENCIES.some((item) => item.code === newCurrency);

    if (!exists) return;

    setCurrency(newCurrency);

    // Later:
    // if (user) {
    //   update Supabase profile preferred_currency
    // }
  };

  const currencyInfo =
    CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        currencies: CURRENCIES,
        setCurrency: changeCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
