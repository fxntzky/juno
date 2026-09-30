import { useEffect, useMemo, useState } from 'react';
import type { ProductDetail } from '../../commerce/provider-interface/commerce-provider';
import { formatMoney } from '../lib/money';
import { useCart } from '../providers/CartProvider';
import { useCommerceServices } from '../providers/CommerceProviderContext';

export const ProductPage = ({ slug, navigate }: { slug: string; navigate: (to: string) => void }) => {
  const { productService } = useCommerceServices();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    setActiveImage(0);
    setQuantity(1);
    productService.getProductBySlug(slug)
      .then((next) => { if (live) { setProduct(next); if (!next) setError('Product not found.'); } })
      .catch((caught) => { if (live) setError(caught instanceof Error ? caught.message : 'Could not load the model.'); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [productService, slug]);

  const media = useMemo(() => product?.media.filter((item) => item.type === 'image') ?? [], [product]);
  const quantityInCart = product ? cart?.lines.find((line) => line.productId === product.id)?.quantity ?? 0 : 0;
  const availableToAdd = product ? Math.max(0, product.inventory.quantity - quantityInCart) : 0;
  const canAdd = Boolean(product?.available && availableToAdd > 0);

  const handleAdd = async () => {
    if (!product || !canAdd) return;
    setAdding(true);
    setError(null);
    try {
      await addToCart({ productId: product.id, quantity: Math.min(quantity, availableToAdd) });
      navigate('/cart');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add this model to the cart.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <section className="xp-state">Loading model...</section>;
  if (!product) return <section className="xp-state"><p>{error ?? 'Product unavailable.'}</p><button onClick={() => navigate('/collection/digital-time')}>Back to collection</button></section>;

  return (
    <div className="xp-product-page">
      <div className="xp-breadcrumb"><button onClick={() => navigate('/collection/digital-time')}>Digital Time</button><span>/</span><span>{product.name}</span></div>
      <div className="xp-product-layout">
        <div className="xp-product-media">
          {media[activeImage] ? <img className="xp-product-image" src={media[activeImage].url} alt={media[activeImage].alt ?? product.name} /> : null}
          <div className="xp-product-thumbs" aria-label="Product photographs">
            {media.map((item, index) => <button type="button" key={`${item.url}-${index}`} aria-label={`View ${item.alt ?? `image ${index + 1}`}`} aria-pressed={activeImage === index} className={activeImage === index ? 'is-active' : ''} onClick={() => setActiveImage(index)}><img src={item.url} alt="" loading="lazy" /></button>)}
          </div>
        </div>
        <div className="xp-product-information">
          <p className="xp-eyebrow">JUNO / Digital Time</p>
          <h1>{product.name}</h1>
          <p className="xp-product-description">{product.description}</p>
          <p className="xp-product-price">{formatMoney(product.currentPrice)} <span>Illustrative price</span></p>
          <div className="xp-pdp-rule" />
          <p className="xp-pdp-label">Quantity</p>
          <div className="xp-quantity-control"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span aria-live="polite">{Math.min(quantity, Math.max(1, availableToAdd))}</span><button type="button" aria-label="Increase quantity" disabled={quantity >= availableToAdd} onClick={() => setQuantity((value) => Math.min(Math.max(1, availableToAdd), value + 1))}>+</button></div>
          <button className="xp-button xp-button--dark xp-pdp-add" disabled={adding || !canAdd} onClick={() => void handleAdd()}>{adding ? 'Adding…' : canAdd ? 'Add to demo cart ↗' : 'Unavailable'}</button>
          {error ? <p className="xp-product-error" role="alert">{error}</p> : null}
          <p className="xp-pdp-disclaimer">Interactive product concept. No real payment or shipping. No banking information required.</p>
          <div className="xp-pdp-rule" />
          <h2>About this model</h2>
          {product.storyModules.map((module) => <div className="xp-pdp-story" key={module.id}><h3>{module.title}</h3><p>{module.body}</p></div>)}
          <button className="xp-pdp-back" onClick={() => navigate('/collection/digital-time')}>← Explore the entire collection</button>
        </div>
      </div>
    </div>
  );
};
