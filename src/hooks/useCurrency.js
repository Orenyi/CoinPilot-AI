import { useCurrency as useCurrencyContext } from "../context/CurrencyContext";

const useCurrency = () => {
  return useCurrencyContext();
};

export default useCurrency;
