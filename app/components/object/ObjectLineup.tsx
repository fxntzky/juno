import type { ProductSummary } from "../../../commerce/provider-interface/commerce-provider";

type LineupProps = {
  id: string;
  title: string;
  products: ProductSummary[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

export const ObjectLineup = ({ id, title, products, selectedSlug, onSelect }: LineupProps) => {
  return (
    <section className="object-lineup" id={id}>
      {products.length === 0 ? (
        <p className="muted">No products available in this collection yet.</p>
      ) : null}
      <div className="lineup-box-grid" role="listbox" aria-label={`${title} models`}>
        {products.map((product) => {
          const isSelected = product.slug === selectedSlug;

          return (
            <button
              key={product.slug}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={isSelected ? "lineup-box lineup-box-active" : "lineup-box"}
              onClick={() => onSelect(product.slug)}
            >
              <span className="lineup-box-label">{product.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
