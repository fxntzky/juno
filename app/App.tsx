import { useEffect, useMemo, useState } from 'react';
import { SiteLayout } from './layouts/SiteLayout';
import { AppRouter, type AppRoute } from './routes/AppRouter';

const parsePath = (pathname: string): AppRoute => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return { kind: 'home' };
  if (normalized === '/story') return { kind: 'story' };
  if (normalized === '/collection/digital-time') return { kind: 'collection', collectionId: 'digital-time' };
  const product = normalized.match(/^\/product\/([a-z0-9-]+)$/);
  if (product) return { kind: 'product', slug: product[1] };
  if (normalized === '/cart') return { kind: 'cart' };
  if (normalized === '/checkout') return { kind: 'checkout' };
  const order = normalized.match(/^\/order\/([a-z0-9-]+)$/);
  if (order) return { kind: 'order', orderId: order[1] };
  return { kind: 'not-found' };
};

export const App = () => {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const route = useMemo(() => parsePath(path), [path]);
  const navigate = (to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return <SiteLayout currentRoute={route} navigate={navigate}><AppRouter route={route} navigate={navigate} /></SiteLayout>;
};
