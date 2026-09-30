import { useEffect, useState } from "react";
import type { OrderSnapshot } from "../../commerce/provider-interface/commerce-provider";
import { formatMoney } from "../lib/money";
import { useCommerceServices } from "../providers/CommerceProviderContext";

export const OrderPage = ({ orderId, navigate }: { orderId: string; navigate: (to: string) => void }) => {
  const { checkoutService } = useCommerceServices();
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    checkoutService
      .getOrder(orderId)
      .then((next) => {
        if (!active) {
          return;
        }

        if (!next) {
          setError("Demo order not found. Sample orders disappear when the page is reloaded.");
          setOrder(null);
          return;
        }

        setOrder(next);
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Unable to load order");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [checkoutService, orderId]);

  if (loading) {
    return (
      <section className="page order-page">
        <p>Loading order...</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="page order-page">
        <p className="error">{error ?? "Order not found."}</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </section>
    );
  }

  return (
    <section className="page order-page">
      <p className="eyebrow">Demo / Simulation Complete</p>
      <h1>Demo order {order.orderNumber} created.</h1>
      <p className="lead">
        Generated on {new Date(order.createdAtIso).toLocaleString()} for prototype testing only. No real purchase,
        card charge, delivery or confirmation email has taken place. This demo order disappears on page reload.
      </p>

      <div className="order-layout">
        <section className="stacked-card">
          <h2>Items</h2>
          {order.lines.map((line) => (
            <article key={line.lineId} className="checkout-line-item">
              {line.thumbnailUrl ? <img src={line.thumbnailUrl} alt={line.name} loading="lazy" /> : null}
              <div>
                <strong>{line.name}</strong>
                <p className="muted">{line.quantity} × {formatMoney(line.unitPrice)}</p>
              </div>
              <span>{formatMoney(line.lineTotal)}</span>
            </article>
          ))}
        </section>

        <section className="stacked-card">
          <h2>Sample Shipping Details</h2>
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p>{order.shippingAddress.line1}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p className="muted">{order.shippingOption.label}</p>
        </section>

        <section className="stacked-card order-summary">
          <h2>Simulated Totals</h2>
          <p>
            Subtotal <span>{formatMoney(order.subtotal)}</span>
          </p>
          <p>
            Shipping <span>{formatMoney(order.shippingTotal)}</span>
          </p>
          <p>
            Tax <span>{formatMoney(order.taxTotal)}</span>
          </p>
          <p className="price">
            Total <span>{formatMoney(order.total)}</span>
          </p>
        </section>
      </div>

      <div className="hero-actions">
        <button onClick={() => navigate("/")}>Back to JUNO</button>
      </div>
    </section>
  );
};
