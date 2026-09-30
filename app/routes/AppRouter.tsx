import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { StoryPage } from '../pages/StoryPage';
import { CollectionPage } from '../pages/CollectionPage';
import { ProductPage } from '../pages/ProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OrderPage } from '../pages/OrderPage';

export type AppRoute =
  | { kind: 'home' }
  | { kind: 'story' }
  | { kind: 'collection'; collectionId: 'digital-time' }
  | { kind: 'product'; slug: string }
  | { kind: 'cart' }
  | { kind: 'checkout' }
  | { kind: 'order'; orderId: string }
  | { kind: 'not-found' };

export const AppRouter = ({ route, navigate }: { route: AppRoute; navigate: (to: string) => void }) => {
  switch (route.kind) {
    case 'home': return <HomePage navigate={navigate} />;
    case 'story': return <StoryPage navigate={navigate} />;
    case 'collection': return <CollectionPage collectionId={route.collectionId} navigate={navigate} />;
    case 'product': return <ProductPage slug={route.slug} navigate={navigate} />;
    case 'cart': return <CartPage navigate={navigate} />;
    case 'checkout': return <CheckoutPage navigate={navigate} />;
    case 'order': return <OrderPage orderId={route.orderId} navigate={navigate} />;
    case 'not-found': return <NotFoundPage navigate={navigate} />;
    default: return <NotFoundPage navigate={navigate} />;
  }
};
