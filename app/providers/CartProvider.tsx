import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { CartSnapshot } from "../../commerce/provider-interface/commerce-provider";
import { useCommerceServices } from "./CommerceProviderContext";

type CartContextValue = {
  cartId?: string;
  cart: CartSnapshot | null;
  itemCount: number;
  cartLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (input: { productId: string; quantity: number }) => Promise<CartSnapshot>;
  updateCartLine: (input: { lineId: string; quantity: number }) => Promise<CartSnapshot>;
  removeCartLine: (input: { lineId: string }) => Promise<CartSnapshot>;
  clearCart: () => Promise<CartSnapshot>;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "juno-cart-id";

const readStoredCartId = (): string | undefined => {
  try { return window.localStorage.getItem(CART_STORAGE_KEY) ?? undefined; }
  catch { return undefined; }
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { cartService } = useCommerceServices();
  const [cartId, setCartId] = useState<string | undefined>(readStoredCartId);
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [cartLoading, setCartLoading] = useState(() => Boolean(readStoredCartId()));

  const persistCartId = useCallback((nextCartId: string) => {
    setCartId(nextCartId);
    try { window.localStorage.setItem(CART_STORAGE_KEY, nextCartId); }
    catch { /* Browsing with disabled storage must still support the in-memory cart. */ }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!cartId) {
      setCart(null);
      return;
    }

    setCartLoading(true);
    try {
      const next = await cartService.getCart(cartId);
      setCart(next);
      persistCartId(next.cartId);
    } finally {
      setCartLoading(false);
    }
  }, [cartId, cartService, persistCartId]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (input: { productId: string; quantity: number }) => {
      const next = await cartService.addToCart({
        cartId,
        productId: input.productId,
        quantity: input.quantity,
      });
      setCart(next);
      persistCartId(next.cartId);
      return next;
    },
    [cartId, cartService, persistCartId],
  );

  const updateCartLine = useCallback(
    async (input: { lineId: string; quantity: number }) => {
      if (!cartId) {
        throw new Error("Cart not initialized.");
      }

      const next = await cartService.updateCartLine({
        cartId,
        lineId: input.lineId,
        quantity: input.quantity,
      });
      setCart(next);
      return next;
    },
    [cartId, cartService],
  );

  const removeCartLine = useCallback(
    async (input: { lineId: string }) => {
      if (!cartId) {
        throw new Error("Cart not initialized.");
      }

      const next = await cartService.removeCartLine({
        cartId,
        lineId: input.lineId,
      });
      setCart(next);
      return next;
    },
    [cartId, cartService],
  );

  const clearCart = useCallback(async () => {
    if (!cartId) {
      throw new Error("Cart not initialized.");
    }

    const next = await cartService.clearCart({ cartId });
    setCart(next);
    return next;
  }, [cartId, cartService]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartId,
      cart,
      itemCount: cart?.itemCount ?? 0,
      cartLoading,
      refreshCart,
      addToCart,
      updateCartLine,
      removeCartLine,
      clearCart,
    }),
    [cartId, cart, cartLoading, refreshCart, addToCart, updateCartLine, removeCartLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
