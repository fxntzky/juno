import { describe, expect, it } from "vitest";
import type { CheckoutPaymentInput, ShippingAddress } from "../commerce/provider-interface/commerce-provider";
import { validateCheckoutInput } from "../app/lib/checkoutValidation";

const validAddress: ShippingAddress = {
  firstName: "Nora",
  lastName: "Ishikawa",
  line1: "Calle 123",
  city: "Buenos Aires",
  state: "CABA",
  postalCode: "1001",
  country: "AR",
};

const validPayment: CheckoutPaymentInput = {
  cardholderName: "Nora Ishikawa",
  cardNumber: "4111111111111111",
  expiryMonth: "10",
  expiryYear: "30",
  cvv: "123",
};

describe("checkout validation", () => {
  it("reports strict field errors for invalid input", () => {
    const result = validateCheckoutInput({
      email: "broken-email",
      address: {
        firstName: "",
        lastName: "",
        line1: "x",
        city: "",
        state: "",
        postalCode: "@@@",
        country: "ARG",
      },
      shippingOptionId: "overnight",
      validShippingOptionIds: ["standard", "express"],
      payment: {
        cardholderName: "",
        cardNumber: "123",
        expiryMonth: "20",
        expiryYear: "AA",
        cvv: "1",
      },
      now: new Date("2026-03-12T00:00:00.000Z"),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.shippingOptionId).toBeTruthy();
    expect(result.errors.address?.firstName).toBeTruthy();
    expect(result.errors.address?.lastName).toBeTruthy();
    expect(result.errors.address?.line1).toBeTruthy();
    expect(result.errors.address?.city).toBeTruthy();
    expect(result.errors.address?.state).toBeTruthy();
    expect(result.errors.address?.postalCode).toBeTruthy();
    expect(result.errors.address?.country).toBeTruthy();
    expect(result.errors.payment?.cardholderName).toBeTruthy();
    expect(result.errors.payment?.cardNumber).toBeTruthy();
    expect(result.errors.payment?.expiryMonth).toBeTruthy();
    expect(result.errors.payment?.expiryYear).toBeTruthy();
    expect(result.errors.payment?.cvv).toBeTruthy();
  });

  it("passes with valid checkout input", () => {
    const result = validateCheckoutInput({
      email: "buyer@juno.test",
      address: validAddress,
      shippingOptionId: "standard",
      validShippingOptionIds: ["standard", "express"],
      payment: validPayment,
      now: new Date("2026-03-12T00:00:00.000Z"),
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("recovers from invalid to valid state", () => {
    const invalid = validateCheckoutInput({
      email: "buyer@juno",
      address: { ...validAddress, postalCode: "?" },
      shippingOptionId: "bad-id",
      validShippingOptionIds: ["standard"],
      payment: { ...validPayment, cardNumber: "1234" },
      now: new Date("2026-03-12T00:00:00.000Z"),
    });

    expect(invalid.valid).toBe(false);

    const recovered = validateCheckoutInput({
      email: "buyer@juno.test",
      address: validAddress,
      shippingOptionId: "standard",
      validShippingOptionIds: ["standard"],
      payment: validPayment,
      now: new Date("2026-03-12T00:00:00.000Z"),
    });

    expect(recovered.valid).toBe(true);
    expect(recovered.errors).toEqual({});
  });

  it("rejects expired cards", () => {
    const result = validateCheckoutInput({
      email: "buyer@juno.test",
      address: validAddress,
      shippingOptionId: "standard",
      validShippingOptionIds: ["standard"],
      payment: {
        ...validPayment,
        expiryMonth: "02",
        expiryYear: "26",
      },
      now: new Date("2026-03-12T00:00:00.000Z"),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.payment?.expiryYear).toContain("expired");
  });
});
