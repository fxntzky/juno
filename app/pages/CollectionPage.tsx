import { useEffect, useState } from 'react';
import type { ProductSummary } from '../../commerce/provider-interface/commerce-provider';
import { productImageBySlug } from '../../catalog/media-manifest';
import { formatMoney } from '../lib/money';
import { useCommerceServices } from '../providers/CommerceProviderContext';

const ORDER = ['junom83', 'junom64', 'junom31', 'junob612'];

export const CollectionPage = ({ collectionId, navigate }: { collectionId: 'digital-time' | 'analog-time'; navigate: (to: string) => void }) => {
  const { catalogService } = useCommerceServices();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    catalogService.listProductsByCollection(collectionId)
      .then((items) => { if (live) setProducts([...items].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))); })
      .catch((caught) => { if (live) setError(caught instanceof Error ? caught.message : 'Could not load collection.'); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [catalogService, collectionId]);

  return (
    <div className="xp-collection-page">
      <div className="xp-collection-heading"><p className="xp-eyebrow">JUNO / Product family</p><h1>Digital Time.</h1><p>Four expressions of the same idea. Choose one to explore its construction and details.</p></div>
      {loading ? <p className="xp-state">Loading collection…</p> : null}
      {error ? <p className="xp-state" role="alert">{error}</p> : null}
      <div className="xp-collection-grid">
        {products.map((product) => <button className="xp-collection-card" key={product.id} onClick={() => navigate(`/product/${product.slug}`)}><span className="xp-collection-image"><img src={productImageBySlug[product.slug] ?? product.thumbnailUrl} alt={product.name} loading="lazy" /></span><span className="xp-collection-card-bottom"><strong>{product.name}</strong><span>{formatMoney(product.currentPrice)} <small>Demo ↗</small></span></span></button>)}
      </div>
      <p className="xp-collection-disclaimer">Concept collection. Prices and ordering are illustrative.</p>
    </div>
  );
};
