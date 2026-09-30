import { useState, type CSSProperties, type MouseEvent } from "react";
import { formatMoney } from "../../lib/money";
import type { Money } from "../../../commerce/provider-interface/commerce-provider";

const getPurchaseImageObjectPosition = (modelName: string, index: number): string | undefined => {
  const normalized = modelName.toLowerCase();

  if (normalized.includes("b612") && index === 0) {
    return "50% 28%";
  }

  if (normalized.includes("m31") && index === 1) {
    return "50% 26%";
  }

  return undefined;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const HoverMagnifyImage = ({
  src,
  alt,
  imgClassName,
  imgStyle,
  wrapperClassName,
  lensSize = 128,
  zoom = 2.2,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  imgClassName: string;
  imgStyle?: CSSProperties;
  wrapperClassName?: string;
  lensSize?: number;
  zoom?: number;
  loading?: "eager" | "lazy";
}) => {
  const [active, setActive] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [focusPosition, setFocusPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);
    const focusX = (x / rect.width) * 100;
    const focusY = (y / rect.height) * 100;

    setActive(true);
    setLensPosition({ x, y });
    setFocusPosition({ x: focusX, y: focusY });
  };

  const wrapperClasses = ["hover-magnify", wrapperClassName, active ? "hover-magnify-active" : ""].filter(Boolean).join(" ");
  const lensStyle: CSSProperties = {
    left: lensPosition.x,
    top: lensPosition.y,
    width: lensSize,
    height: lensSize,
    backgroundImage: `url("${src}")`,
    backgroundPosition: `${focusPosition.x}% ${focusPosition.y}%`,
    backgroundSize: `${zoom * 100}%`,
  };

  return (
    <div className={wrapperClasses} onMouseEnter={handleMouseMove} onMouseMove={handleMouseMove} onMouseLeave={() => setActive(false)}>
      <img className={imgClassName} src={src} alt={alt} loading={loading} style={imgStyle} />
      <span className="hover-magnify-lens" aria-hidden style={lensStyle} />
    </div>
  );
};

export const ObjectPurchase = ({
  productName,
  collectionLabel,
  price,
  stock,
  maxAdditionalQuantity,
  busy,
  errorMessage,
  noticeMessage,
  image,
  gallery,
  galleryIndex,
  onSelectGalleryIndex,
  onAddToCart,
  onBuyNow,
  onGoToCart,
}: {
  productName: string;
  collectionLabel: "Analog Time" | "Digital Time";
  price: Money;
  stock: number;
  maxAdditionalQuantity: number;
  busy: boolean;
  errorMessage?: string | null;
  noticeMessage?: string | null;
  image?: string;
  gallery: Array<{ url: string; alt?: string }>;
  galleryIndex: number;
  onSelectGalleryIndex: (index: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onGoToCart: () => void;
}) => {
  const cannotAddMore = maxAdditionalQuantity <= 0;
  const addBlocked = busy || stock <= 0 || cannotAddMore;
  const purchaseImageObjectPosition = getPurchaseImageObjectPosition(productName, galleryIndex);

  return (
    <section className="object-purchase" id="purchase">
      <p className="eyebrow">Purchase</p>
      <h2>{productName}</h2>
      <p className="muted">{collectionLabel}</p>
      {image ? (
        <HoverMagnifyImage
          src={image}
          alt={`${productName} purchase preview`}
          imgClassName="purchase-image"
          wrapperClassName="purchase-image-magnify"
          imgStyle={purchaseImageObjectPosition ? { objectPosition: purchaseImageObjectPosition } : undefined}
          lensSize={140}
          zoom={2.25}
        />
      ) : null}
      {gallery.length > 1 ? (
        <div className="purchase-gallery">
          {gallery.map((asset, index) => (
            <button
              key={`${asset.url}-${index}`}
              type="button"
              className={index === galleryIndex ? "purchase-gallery-item purchase-gallery-item-active" : "purchase-gallery-item"}
              onClick={() => onSelectGalleryIndex(index)}
            >
              <HoverMagnifyImage
                src={asset.url}
                alt={asset.alt ?? `${productName} angle ${index + 1}`}
                imgClassName="purchase-gallery-thumb"
                wrapperClassName="purchase-thumb-magnify"
                lensSize={74}
                zoom={2.8}
              />
            </button>
          ))}
        </div>
      ) : null}
      <p className="price purchase-price">{formatMoney(price)}</p>

      <p className="muted">
        {stock <= 0
          ? "Out of stock."
          : cannotAddMore
            ? "Unavailable for additional quantity."
            : "In stock."}
      </p>
      {errorMessage ? <p className="purchase-feedback purchase-feedback-error">{errorMessage}</p> : null}
      {!errorMessage && noticeMessage ? <p className="purchase-feedback purchase-feedback-notice">{noticeMessage}</p> : null}
      <div className="purchase-actions purchase-actions-column">
        <button className="button-secondary" disabled={addBlocked} onClick={onAddToCart}>
          {busy ? "Adding..." : "Add to Cart"}
        </button>
        <button disabled={addBlocked} onClick={onBuyNow}>
          {busy ? "Processing..." : "Buy (Demo)"}
        </button>
        <button className="button-secondary" onClick={onGoToCart}>
          Open Cart
        </button>
      </div>
      <ul className="purchase-notes">
        <li>Illustrative standard shipping: $12.</li>
        <li>Concept product — no real shipment or returns.</li>
        <li>Checkout is an interactive demonstration with fictional data.</li>
      </ul>
    </section>
  );
};
