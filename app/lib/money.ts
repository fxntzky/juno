import type { Money } from "../../commerce/provider-interface/commerce-provider";

export const formatMoney = (money: Money): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 2,
  }).format(money.amount);
};
