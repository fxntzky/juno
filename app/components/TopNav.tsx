import { useCart } from '../providers/CartProvider';
import type { AppRoute } from '../routes/AppRouter';

type Props = {
  currentRoute: AppRoute;
  navigate: (to: string) => void;
};

export const TopNav = ({
  currentRoute,
  navigate,
}: Props) => {
  const { itemCount } = useCart();

  const onHome = currentRoute.kind === 'home';

  const onCommerce =
    currentRoute.kind === 'checkout' ||
    currentRoute.kind === 'cart' ||
    currentRoute.kind === 'order';

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  return (
    <header className="xp-header">
      <div className="xp-global-nav">
        <button
          type="button"
          className="xp-brand"
          aria-label="JUNO home"
          onClick={() =>
            onHome
              ? window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              : navigate('/')
          }
        >
          JUNO
        </button>

        <nav
          className="xp-global-links"
          aria-label="Primary navigation"
        >
          {onCommerce ? (
            <button
              type="button"
              onClick={() => navigate('/')}
            >
              Explore
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  onHome
                    ? scrollTo('collection')
                    : navigate(
                        '/collection/digital-time',
                      )
                }
              >
                Products
              </button>

              <button
                type="button"
                onClick={() => navigate('/story')}
                aria-current={
                  currentRoute.kind === 'story'
                    ? 'page'
                    : undefined
                }
              >
                Story
              </button>
            </>
          )}

          <button
            type="button"
            className="xp-cart-link"
            onClick={() => navigate('/cart')}
            aria-label={`Cart with ${itemCount} items`}
          >
            Cart ({itemCount})
          </button>
        </nav>
      </div>

      {onHome ? (
        <nav
          className="xp-product-nav"
          aria-label="M83 product navigation"
        >
          <strong>
            M83 <span>Digital Time</span>
          </strong>

          <div>
            <button
              type="button"
              onClick={() => scrollTo('overview')}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo('design-notes')
              }
            >
              Design
            </button>

            <button
              type="button"
              onClick={() => scrollTo('functions')}
            >
              Functions
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo('specifications')
              }
            >
              Specs
            </button>

            <button
              type="button"
              className="xp-subnav-buy"
              onClick={() => scrollTo('buy')}
            >
              Buy
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
};