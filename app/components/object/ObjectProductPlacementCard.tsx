import { formatMoney } from "../../lib/money";
import type { Money } from "../../../commerce/provider-interface/commerce-provider";

export const ObjectProductPlacementCard = ({
  name,
  collectionLabel,
  subtitle,
  price,
  image,
  gallery,
  galleryIndex,
  onSelectGalleryIndex,
}: {
  name: string;
  collectionLabel: "Analog Time" | "Digital Time";
  subtitle: string;
  price: Money;
  image?: string;
  gallery: Array<{ url: string; alt?: string }>;
  galleryIndex: number;
  onSelectGalleryIndex: (index: number) => void;
}) => {
  const heroGallery = gallery.slice(0, 3);

  return (
    <section className="object-section product-placement-card" id="product-placement-card">
      <div className="hero-copy">
        <p className="eyebrow">{collectionLabel} • SERIES 2026</p>
        <h1>{name}</h1>
        <p className="lead">{subtitle}</p>
        <p className="hero-price">{formatMoney(price)}</p>
        <div className="hero-stat-strip">
          <span>Minimal</span>
          <span>Retrofuturist</span>
          <span>Digital Time</span>
        </div>
        <div className="hero-actions">
          <a className="hero-cta" href="#shop">
            Shop collection
          </a>
          <a className="button-secondary" href="#purchase">
            View purchase panel
          </a>
        </div>
      </div>
      <div className="hero-render-wrap">
        {image && <img className="hero-render" src={image} alt={`${name} render`} loading="eager" />}
        {heroGallery.length > 1 ? (
          <div className="hero-gallery hero-gallery-right" role="tablist" aria-label={`${name} image variants`}>
            {heroGallery.map((asset, index) => (
              <button
                key={`${asset.url}-${index}`}
                type="button"
                className={index === galleryIndex ? "hero-gallery-item hero-gallery-item-active" : "hero-gallery-item"}
                onClick={() => onSelectGalleryIndex(index)}
                aria-selected={index === galleryIndex}
              >
                <img src={asset.url} alt={asset.alt ?? `${name} view ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
