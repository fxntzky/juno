import type { CheckoutPaymentInput, ShippingAddress } from "../../commerce/provider-interface/commerce-provider";

export type CheckoutValidationInput = {
  email: string;
  address: ShippingAddress;
  shippingOptionId: string;
  validShippingOptionIds: string[];
  payment: CheckoutPaymentInput;
  now?: Date;
};

export type CheckoutValidationErrors = {
  email?: string;
  address?: Partial<Record<keyof ShippingAddress, string>>;
  shippingOptionId?: string;
  payment?: Partial<Record<keyof CheckoutPaymentInput, string>>;
};

export type CheckoutValidationResult = {
  valid: boolean;
  errors: CheckoutValidationErrors;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeDigits = (value: string): string => value.replace(/\D/g, "");

const addAddressError = (
  target: Partial<Record<keyof ShippingAddress, string>>,
  key: keyof ShippingAddress,
  message: string,
): void => {
  if (!target[key]) {
    target[key] = message;
  }
};

const addPaymentError = (
  target: Partial<Record<keyof CheckoutPaymentInput, string>>,
  key: keyof CheckoutPaymentInput,
  message: string,
): void => {
  if (!target[key]) {
    target[key] = message;
  }
};

export const validateCheckoutInput = (input: CheckoutValidationInput): CheckoutValidationResult => {
  const errors: CheckoutValidationErrors = {};

  const email = input.email.trim();
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const addressErrors: Partial<Record<keyof ShippingAddress, string>> = {};
  if (input.address.firstName.trim().length < 2) {
    addAddressError(addressErrors, "firstName", "First name must be at least 2 characters.");
  }
  if (input.address.lastName.trim().length < 2) {
    addAddressError(addressErrors, "lastName", "Last name must be at least 2 characters.");
  }
  if (input.address.line1.trim().length < 4) {
    addAddressError(addressErrors, "line1", "Address must be at least 4 characters.");
  }
  if (input.address.city.trim().length < 2) {
    addAddressError(addressErrors, "city", "City is required.");
  }
  if (input.address.state.trim().length < 2) {
    addAddressError(addressErrors, "state", "State is required.");
  }
  if (input.address.country.trim().length !== 2) {
    addAddressError(addressErrors, "country", "Country must be a 2-letter code.");
  }

  const postalNormalized = input.address.postalCode.trim();
  if (postalNormalized.length < 3 || postalNormalized.length > 12 || !/^[A-Za-z0-9 -]+$/.test(postalNormalized)) {
    addAddressError(addressErrors, "postalCode", "Postal code format is invalid.");
  }

  if (Object.keys(addressErrors).length > 0) {
    errors.address = addressErrors;
  }

  if (!input.validShippingOptionIds.includes(input.shippingOptionId)) {
    errors.shippingOptionId = "Select a valid shipping option.";
  }

  const paymentErrors: Partial<Record<keyof CheckoutPaymentInput, string>> = {};

  if (input.payment.cardholderName.trim().length < 3) {
    addPaymentError(paymentErrors, "cardholderName", "Cardholder name is required.");
  }

  const cardDigits = sanitizeDigits(input.payment.cardNumber);
  if (cardDigits.length < 12 || cardDigits.length > 19) {
    addPaymentError(paymentErrors, "cardNumber", "Card number is invalid.");
  }

  if (!/^\d{2}$/.test(input.payment.expiryMonth)) {
    addPaymentError(paymentErrors, "expiryMonth", "Use 2 digits (MM).");
  } else {
    const month = Number(input.payment.expiryMonth);
    if (month < 1 || month > 12) {
      addPaymentError(paymentErrors, "expiryMonth", "Expiry month is invalid.");
    }
  }

  if (!/^\d{2}$/.test(input.payment.expiryYear)) {
    addPaymentError(paymentErrors, "expiryYear", "Use 2 digits (YY).");
  }

  if (!/^\d{3,4}$/.test(input.payment.cvv.trim())) {
    addPaymentError(paymentErrors, "cvv", "CVV is invalid.");
  }

  if (!paymentErrors.expiryMonth && !paymentErrors.expiryYear) {
    const now = input.now ?? new Date();
    const currentYearTwoDigits = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const expiryYear = Number(input.payment.expiryYear);
    const expiryMonth = Number(input.payment.expiryMonth);

    if (expiryYear < currentYearTwoDigits || (expiryYear === currentYearTwoDigits && expiryMonth < currentMonth)) {
      addPaymentError(paymentErrors, "expiryYear", "Card is expired.");
    }
  }

  if (Object.keys(paymentErrors).length > 0) {
    errors.payment = paymentErrors;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
