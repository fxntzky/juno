import { useMemo, useState } from "react";
import { formatMoney } from "../lib/money";
import { useCart } from "../providers/CartProvider";

export const CartPage = ({ navigate }: { navigate: (to: string) => void }) => {
  const { cart, cartLoading, updateCartLine, removeCartLine, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [busyLine, setBusyLine] = useState<string | null>(null);

  const hasItems = (cart?.lines.length ?? 0) > 0;
  const disabled = useMemo(() => cartLoading || !hasItems, [cartLoading, hasItems]);
  const estimatedShipping = useMemo(() => {
    if (!hasItems) {
      return { currency: "USD" as const, amount: 0 };
    }
    return { currency: "USD" as const, amount: 12 };
  }, [cart, hasItems]);

  const handleQty = async (lineId: string, quantity: number) => {
    setBusyLine(lineId);
    setError(null);
    try {
      await updateCartLine({ lineId, quantity });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update cart line.");
    } finally {
      setBusyLine(null);
    }
  };

  const handleRemove = async (lineId: string) => {
    setBusyLine(lineId);
    setError(null);
    try {
      await removeCartLine({ lineId });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to remove cart line.");
    } finally {
      setBusyLine(null);
    }
  };

  const handleClear = async () => {
    setError(null);
    try {
      await clearCart();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to clear cart.");
    }
  };

  if (!hasItems && !cartLoading) {
    return (
      <section className="page cart-page cart-empty-state">
        <p className="eyebrow">Cart</p>
        <h1>Your build is empty.</h1>
        <p className="lead">Select a JUNO model and return here to review it before checkout.</p>
        <div className="hero-actions">
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page cart-page">
      <p className="eyebrow">Cart</p>
      <h1>Review Your Build</h1>
      <p className="lead">Every line item includes real-time quantity controls before checkout.</p>

      {cartLoading && <p>Loading cart...</p>}

      {hasItems && cart && (
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.lines.map((line) => (
              <article key={line.lineId} className="cart-line">
                {line.thumbnailUrl ? <img src={line.thumbnailUrl} alt={line.name} loading="lazy" /> : null}
                <div className="cart-line-main">
                  <h3>{line.name}</h3>
                  <p className="muted">{line.slug}</p>
                  <p className="cart-unit-price">{formatMoney(line.unitPrice)} each</p>
                  <div className="line-actions">
                    <button
                      disabled={busyLine === line.lineId || line.quantity <= 1}
                      onClick={() => void handleQty(line.lineId, line.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="line-qty">{line.quantity}</span>
                    <button disabled={busyLine === line.lineId} onClick={() => void handleQty(line.lineId, line.quantity + 1)}>
                      +
                    </button>
                    <button
                      className="button-secondary"
                      disabled={busyLine === line.lineId}
                      onClick={() => void handleRemove(line.lineId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="cart-line-total">{formatMoney(line.lineTotal)}</strong>
              </article>
            ))}
          </div>

          <aside className="cart-summary stacked-card">
            <p className="eyebrow">Summary</p>
            <h2>Order Snapshot</h2>
            <p>
              Items <span>{cart.itemCount}</span>
            </p>
            <p>
              Subtotal <span>{formatMoney(cart.subtotal)}</span>
            </p>
            <p>
              Est. Shipping <span>{formatMoney(estimatedShipping)}</span>
            </p>
            <p className="price">
              Est. Before Tax
              <span>
                {formatMoney({
                  currency: "USD",
                  amount: cart.subtotal.amount + estimatedShipping.amount,
                })}
              </span>
            </p>
            <div className="purchase-actions purchase-actions-column">
              <button disabled={disabled} onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
              <button className="button-secondary" disabled={disabled} onClick={() => void handleClear()}>
                Clear Cart
              </button>
            </div>
            <p className="muted">Interactive checkout demo. Use fictional details only; no real payment, purchase or delivery.</p>
          </aside>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
};
