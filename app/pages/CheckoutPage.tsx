import { useEffect, useMemo, useRef, useState } from "react";
import type { CheckoutPaymentInput, CheckoutSnapshot, ShippingAddress, ShippingOption } from "../../commerce/provider-interface/commerce-provider";
import { formatMoney } from "../lib/money";
import { emitCommerceEvent } from "../lib/analytics";
import { validateCheckoutInput } from "../lib/checkoutValidation";
import { useCart } from "../providers/CartProvider";
import { useCommerceServices } from "../providers/CommerceProviderContext";

// Internal demo fixtures. Visitors are never asked to supply or edit personal/payment data.
const DEMO_EMAIL = "visitor@example.com";

const DEMO_ADDRESS: ShippingAddress = {
  firstName: "Demo",
  lastName: "Visitor",
  line1: "123 Sample Street",
  city: "Demo City",
  state: "CA",
  postalCode: "90001",
  country: "US",
};

const DEMO_PAYMENT: CheckoutPaymentInput = {
  cardholderName: "JUNO DEMO",
  cardNumber: "4111111111111111",
  expiryMonth: "12",
  expiryYear: "99",
  cvv: "123",
};

export const CheckoutPage = ({ navigate }: { navigate: (to: string) => void }) => {
  const { cart, cartId, cartLoading, clearCart } = useCart();
  const { checkoutService } = useCommerceServices();

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [checkout, setCheckout] = useState<CheckoutSnapshot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOptionId, setShippingOptionId] = useState("standard");
  const trackedBeginCheckoutCartId = useRef<string | null>(null);
  const orderPlacedRef = useRef(false);

  const validation = useMemo(
    () =>
      validateCheckoutInput({
        email: DEMO_EMAIL,
        address: DEMO_ADDRESS,
        shippingOptionId,
        validShippingOptionIds: shippingOptions.map((option) => option.id),
        payment: DEMO_PAYMENT,
      }),
    [shippingOptionId, shippingOptions],
  );

  useEffect(() => {
    let active = true;

    checkoutService
      .listShippingOptions({ country: DEMO_ADDRESS.country })
      .then((options) => {
        if (!active) return;

        setShippingOptions(options);
        if (options.length > 0) {
          setShippingOptionId(options[0].id);
        }
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Failed to load shipping options.");
        }
      });

    return () => {
      active = false;
    };
  }, [checkoutService]);

  const hasCartItems = useMemo(() => (cart?.lines.length ?? 0) > 0, [cart]);

  useEffect(() => {
    if (cartLoading || hasCartItems || orderPlacedRef.current) return;
    navigate("/cart");
  }, [cartLoading, hasCartItems, navigate]);

  useEffect(() => {
    if (!cartId || !cart || !hasCartItems) return;
    if (trackedBeginCheckoutCartId.current === cartId) return;

    trackedBeginCheckoutCartId.current = cartId;
    emitCommerceEvent("begin_checkout", {
      cart_id: cartId,
      item_count: cart.itemCount,
      subtotal: cart.subtotal.amount,
      source: "checkout_page",
    });
  }, [cartId, cart, hasCartItems]);

  const selectedShippingOption = shippingOptions.find((option) => option.id === shippingOptionId);
  const shippingPreview = selectedShippingOption?.price.amount ?? 0;
  const subtotalPreview = cart?.subtotal.amount ?? 0;
  const beforeTaxPreview = { currency: "USD" as const, amount: subtotalPreview + shippingPreview };

  const handlePlaceOrder = async () => {
    if (!cartId || !hasCartItems) {
      setError("Your cart is empty.");
      return;
    }

    if (!validation.valid) {
      setError("The demo checkout is not ready. Please select an available shipping option.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let nextCheckout = checkout;

      if (!nextCheckout) {
        nextCheckout = await checkoutService.beginCheckout({ cartId, email: DEMO_EMAIL });
      }

      nextCheckout = await checkoutService.setCheckoutAddress({
        checkoutId: nextCheckout.checkoutId,
        address: DEMO_ADDRESS,
      });

      nextCheckout = await checkoutService.setCheckoutShippingOption({
        checkoutId: nextCheckout.checkoutId,
        shippingOptionId,
      });

      nextCheckout = await checkoutService.setCheckoutPayment({
        checkoutId: nextCheckout.checkoutId,
        payment: DEMO_PAYMENT,
      });

      setCheckout(nextCheckout);

      const order = await checkoutService.placeOrder({ checkoutId: nextCheckout.checkoutId });
      orderPlacedRef.current = true;
      await clearCart();
      navigate(`/order/${order.orderId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to place demo order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <section className="page checkout-page">
        <p>Loading checkout...</p>
      </section>
    );
  }

  if (!hasCartItems) {
    return (
      <section className="page checkout-page checkout-empty-state">
        <h1>Your build is empty.</h1>
        <p>Return to your cart to review a JUNO configuration before checkout.</p>
        <button onClick={() => navigate("/cart")}>Go to Cart</button>
      </section>
    );
  }

  return (
    <section className="page checkout-page">
      <p className="eyebrow">Interactive Prototype / Checkout Demo</p>
      <h1>Finalize Your Build</h1>

      <div className="checkout-demo-notice" role="note">
        <strong>DEMO ONLY — NO PURCHASE OR PAYMENT.</strong>
        <p>Contact and delivery details below are fixed fictional examples, not fields to complete. No personal or payment details are requested. No money is charged, no order is fulfilled and no confirmation email is sent.</p>
      </div>

      <div className="checkout-step-strip" aria-label="Demo checkout stages">
        <span>1. Sample Contact</span>
        <span>2. Simulated Shipping</span>
        <span>3. Demo Payment</span>
        <span>4. Demo Confirmation</span>
      </div>

      <div className="checkout-grid">
        <section className="stacked-card checkout-form-column">
          <h2>Contact</h2>
          <dl className="checkout-demo-data" aria-label="Fixed fictional contact information">
            <div className="checkout-demo-data__item">
              <dt>Email · Demo example</dt>
              <dd>{DEMO_EMAIL}</dd>
            </div>
          </dl>

          <h2>Shipping Address</h2>
          <dl className="checkout-demo-data checkout-demo-data--address" aria-label="Fixed fictional shipping information">
            <div className="checkout-demo-data__item">
              <dt>Recipient · Demo example</dt>
              <dd>{DEMO_ADDRESS.firstName} {DEMO_ADDRESS.lastName}</dd>
            </div>
            <div className="checkout-demo-data__item">
              <dt>Country · Demo example</dt>
              <dd>{DEMO_ADDRESS.country}</dd>
            </div>
            <div className="checkout-demo-data__item checkout-demo-data__item--full">
              <dt>Address · Demo example</dt>
              <dd>{DEMO_ADDRESS.line1}</dd>
            </div>
            <div className="checkout-demo-data__item">
              <dt>City / State</dt>
              <dd>{DEMO_ADDRESS.city}, {DEMO_ADDRESS.state}</dd>
            </div>
            <div className="checkout-demo-data__item">
              <dt>Postal Code</dt>
              <dd>{DEMO_ADDRESS.postalCode}</dd>
            </div>
          </dl>
          <p className="checkout-demo-static-caption">Sample data is fixed. No personal details can be entered.</p>

          <h2>Shipping Method</h2>
          <label className="field-block">
            Delivery Option · Simulated
            <select
              value={shippingOptionId}
              disabled={submitting || shippingOptions.length === 0}
              onChange={(event) => {
                setShippingOptionId(event.target.value);
                setError(null);
              }}
            >
              {shippingOptions.length === 0 && <option value={shippingOptionId}>Loading options...</option>}
              {shippingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} ({formatMoney(option.price)})
                </option>
              ))}
            </select>
          </label>

          <h2>Demo Payment</h2>
          <div className="checkout-demo-payment" role="note">
            <strong>Automatic simulated payment</strong>
            <p>No credit card, bank details or payment provider required. An internal test fixture completes this checkout locally for demonstration purposes only.</p>
          </div>

          <button disabled={submitting || !validation.valid} onClick={() => void handlePlaceOrder()}>
            {submitting ? "Creating Demo Order..." : "Complete Demo Order"}
          </button>
        </section>

        <aside className="stacked-card order-summary checkout-summary-panel">
          <p className="eyebrow">Order Summary</p>
          <h2>Demo Order Preview</h2>
          {cart?.lines.map((line) => (
            <article key={line.lineId} className="checkout-line-item">
              {line.thumbnailUrl ? <img src={line.thumbnailUrl} alt={line.name} loading="lazy" /> : null}
              <div>
                <strong>{line.name}</strong>
                <p className="muted">{line.quantity} × {formatMoney(line.unitPrice)}</p>
              </div>
              <span>{formatMoney(line.lineTotal)}</span>
            </article>
          ))}
          <p>
            Subtotal <span>{formatMoney(cart?.subtotal ?? { currency: "USD", amount: 0 })}</span>
          </p>
          <p>
            Estimated Shipping <span>{selectedShippingOption ? formatMoney(selectedShippingOption.price) : "Loading..."}</span>
          </p>
          <p>
            Simulated Tax <span>Calculated at confirmation</span>
          </p>
          <p className="price">
            Est. Before Tax <span>{formatMoney(beforeTaxPreview)}</span>
          </p>
          <p className="muted">Preview prices only. Final simulated totals include tax. No payment is collected, and no goods will be shipped.</p>
        </aside>
      </div>

      {error && <p className="error checkout-error-banner">{error}</p>}
    </section>
  );
};
